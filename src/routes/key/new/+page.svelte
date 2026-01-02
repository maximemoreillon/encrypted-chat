<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { arrayBuffer2Base64 } from "$lib/cryptography";

  async function exportKeyToString(cryptoKey: CryptoKey) {
    const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
    return arrayBuffer2Base64(exportedKey);
  }

  let keyString = $state("");

  async function onclick() {
    let cryptoKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    keyString = await exportKeyToString(cryptoKey);
  }
</script>

<div class="flex justify-center my-6">
  <Button {onclick}>Generate Key</Button>
</div>

{#if keyString}
  <div class="border rounded-2xl p-2 flex justify-center my-6">
    {keyString}
  </div>
{/if}
