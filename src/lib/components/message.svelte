<script lang="ts">
  import type { DocumentData } from "firebase/firestore";
  import { currentUser } from "$lib/store";
  import { decrypt } from "$lib/cryptography";

  let {
    message,
    showDecrypted = false,
    keyBase64,
  } = $props<{
    message: DocumentData;
    showDecrypted?: boolean;
    keyBase64?: string | null;
  }>();

  let own = $derived(() => {
    return $currentUser?.email === message.data().sender;
  });

  type DecryptionResult = {
    error: null | string;
    data: null | string;
    pending: boolean;
  };

  let decryptionResult = $state<DecryptionResult>({
    error: null,
    pending: false,
    data: null,
  });

  $effect(() => {
    if (decryptionResult.data) return; // Do not re-decrypt messages

    if (!showDecrypted) return;
    if (!keyBase64) return;

    decryptionResult.pending = true;
    const { ciphertextBase64, ivBase64 } = message.data();

    decrypt(ciphertextBase64, ivBase64, keyBase64)
      .then((decrypted) => {
        decryptionResult.error = null;
        decryptionResult.data = decrypted;
      })
      .catch((error) => {
        decryptionResult.error = "Decryption failed";
        decryptionResult.data = "";
      })
      .finally(() => {
        decryptionResult.pending = false;
      });
  });

  const className = $derived(
    () =>
      `border rounded-2xl px-4 py-2 wrap-anywhere ${own() ? "bg-primary text-white self-end" : ""}`
  );
</script>

<div class={className()}>
  <div class="text-xs gap-4 flex justify-between">
    <div>{message.data().sender}</div>
    <div>{message.data().timestamp?.toDate().toLocaleString()}</div>
  </div>
  <div class="my-2">
    {#if showDecrypted}
      {#if decryptionResult.pending}
        <span>Decrypting...</span>
      {:else if decryptionResult.error}
        <span>{decryptionResult.error}</span>
      {:else}
        <span>{decryptionResult.data}</span>
      {/if}
    {:else}
      {message.data().ciphertextBase64}
    {/if}
  </div>
</div>
