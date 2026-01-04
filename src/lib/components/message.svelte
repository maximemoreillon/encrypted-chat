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

  async function decryptMessage() {
    const { ciphertextBase64, ivBase64 } = message.data();
    if (!keyBase64) return "Missing key";
    try {
      return await decrypt(ciphertextBase64, ivBase64, keyBase64);
    } catch (error) {
      return "Decryption failed";
    }
  }

  const decryptedMessage = $derived(await decryptMessage());

  // TODO: consider decrypting here

  const className = $derived(
    () =>
      `border rounded-2xl px-4 py-2 wrap-anywhere ${own() ? "bg-primary text-white self-end" : ""}`
  );

  const shortDate = $derived(() => {
    if (!message.data().timestamp) return "";
    const date: Date = message.data().timestamp.toDate();
    return date.toLocaleString();
  });
</script>

<div class={className()}>
  <div class="text-xs gap-4 flex justify-between">
    <div>{message.data().sender}</div>
    <div>{shortDate()}</div>
  </div>
  <div class="my-2">
    {#if showDecrypted}
      {#await decryptedMessage}
        <div>Decrypting...</div>
      {:then decryptionResult}
        {decryptionResult}
      {/await}
    {:else}
      {message.data().ciphertextBase64}
    {/if}
  </div>
  <!-- {/if} -->
</div>
