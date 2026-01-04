<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import KeyIcon from "@lucide/svelte/icons/key";
  import SaveIcon from "@lucide/svelte/icons/save";
  import EyeIcon from "@lucide/svelte/icons/eye";
  import PlusIcon from "@lucide/svelte/icons/plus";

  import { arrayBuffer2Base64 } from "$lib/cryptography";
  import { type DocumentData } from "firebase/firestore";
  import { onMount } from "svelte";

  async function exportKeyToString(cryptoKey: CryptoKey) {
    const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
    return arrayBuffer2Base64(exportedKey);
  }

  async function keyGen() {
    let cryptoKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    keyBase64 = await exportKeyToString(cryptoKey);
  }

  let { chat, keyBase64 = $bindable("") } = $props<{
    chat: DocumentData;
    keyBase64: string;
  }>();

  let open = $state(false);

  const keyName = $derived(() => chat.id);

  async function onsubmit(e: Event) {
    e.preventDefault();

    localStorage.setItem(keyName(), keyBase64);

    open = false;
  }

  onMount(() => {
    keyBase64 = localStorage.getItem(keyName()) ?? "";
  });

  let show = $state(false);
</script>

<Dialog.Root bind:open>
  <form>
    <Dialog.Trigger class={buttonVariants({})}>
      <KeyIcon />
      <!-- <span>Key</span> -->
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Key</Dialog.Title>
        <!-- <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description> -->
      </Dialog.Header>
      <form {onsubmit} class="m-4 flex gap-4 flex-col">
        <div class="flex gap-2">
          <Input
            type={show ? "text" : "password"}
            placeholder="Your key"
            class=""
            bind:value={keyBase64}
          />

          <Button onclick={() => (show = !show)} variant="outline">
            <EyeIcon />
          </Button>
        </div>

        <div class="flex justify-between">
          <Button onclick={keyGen}>
            <PlusIcon />
            <span>Generate</span>
          </Button>
          <Button type="submit">
            <SaveIcon />
            <span>Save key</span>
          </Button>
        </div>
      </form>
      <!-- <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "outline" })}
          >Close</Dialog.Close
        >
      </Dialog.Footer> -->
    </Dialog.Content>
  </form>
</Dialog.Root>
