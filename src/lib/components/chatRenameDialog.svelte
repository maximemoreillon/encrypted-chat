<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import SaveIcon from "@lucide/svelte/icons/save";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import { doc, setDoc, type DocumentData } from "firebase/firestore";
  import { db } from "$lib/firebase";

  let { chat } = $props<{ chat: DocumentData }>();

  let newName = $state(chat.data().name);

  let open = $state(false);

  async function onsubmit(e: Event) {
    e.preventDefault();

    const chatDoc = doc(db, "chats", chat.id);

    await setDoc(chatDoc, { name: newName }, { merge: true });

    open = false;
  }
</script>

<Dialog.Root bind:open>
  <form>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
      <PencilIcon />
      <!-- <span>Key</span> -->
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Rename chat</Dialog.Title>
        <!-- <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description> -->
      </Dialog.Header>
      <form {onsubmit} class="m-4 flex gap-4 flex-col">
        <div class="flex gap-2">
          <Input
            type="text"
            placeholder="Your chat name"
            class=""
            bind:value={newName}
          />

          <Button type="submit">
            <SaveIcon />
            <span>Save</span>
          </Button>
        </div>

        <div class="flex justify-between"></div>
      </form>
      <!-- <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "outline" })}
          >Close</Dialog.Close
        >
      </Dialog.Footer> -->
    </Dialog.Content>
  </form>
</Dialog.Root>
