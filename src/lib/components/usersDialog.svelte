<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import UsersIcon from "@lucide/svelte/icons/users";

  import { currentUser } from "$lib/store";
  import XIcon from "@lucide/svelte/icons/x";
  import UserPlusIcon from "@lucide/svelte/icons/user-plus";

  import {
    doc,
    getFirestore,
    setDoc,
    type DocumentData,
  } from "firebase/firestore";

  const db = getFirestore();

  const { chat } = $props<{ chat: DocumentData }>();

  let users = $derived(() => chat.data().users);

  let newUserEmail = $state("");

  async function addUser() {
    const chatDoc = doc(db, "chats", chat.id);

    const newUsers = [...users(), newUserEmail];
    await setDoc(chatDoc, { users: newUsers }, { merge: true });

    newUserEmail = "";
  }

  async function deleteUser(email: string) {
    const chatDoc = doc(db, "chats", chat.id);

    const newUsers = chat.data().users;
    const userIndex = newUsers.findIndex((u: string) => u === email);
    if (userIndex < 0) return console.error(`User not found`);
    newUsers.splice(userIndex, 1);

    await setDoc(chatDoc, { users: newUsers }, { merge: true });
  }
</script>

<Dialog.Root>
  <form>
    <Dialog.Trigger class={buttonVariants({})}>
      <UsersIcon />
      <span> Users</span>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Chat users</Dialog.Title>
        <!-- <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description> -->
      </Dialog.Header>
      <div class="flex gap-2 flex-wrap">
        {#each users() as user}
          <div
            class="rounded-full border border-secondary px-2 py-1 flex items-center gap-1"
          >
            <span>
              {user}
            </span>
            <Button
              disabled={user === $currentUser?.email}
              variant="ghost"
              class="rounded-full"
              size="icon-sm"
              onclick={() => deleteUser(user)}
            >
              <XIcon />
            </Button>
          </div>
        {/each}

        <div class="flex gap-2">
          <Input
            class="grow"
            type="email"
            placeholder="john@example.com"
            bind:value={newUserEmail}
          />
          <Button onclick={addUser}>
            <UserPlusIcon />
          </Button>
        </div>
      </div>
      <!-- <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "outline" })}
          >Close</Dialog.Close
        >
      </Dialog.Footer> -->
    </Dialog.Content>
  </form>
</Dialog.Root>
