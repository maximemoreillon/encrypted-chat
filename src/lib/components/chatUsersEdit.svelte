<script lang="ts">
  import { chats, currentUser } from "$lib/store";
  import Button from "./ui/button/button.svelte";
  import XIcon from "@lucide/svelte/icons/x";
  import UserPlusIcon from "@lucide/svelte/icons/user-plus";

  import Input from "./ui/input/input.svelte";
  import { doc, getFirestore, setDoc } from "firebase/firestore";

  const db = getFirestore();

  const { id } = $props<{ id: string }>();

  let countown = $derived(() => $chats.find((c) => c.id === id));
  let users = $derived(() => countown()?.data().users);

  let newUserEmail = $state("");

  async function addUser() {
    const cd = $chats.find((c) => c.id === id);
    if (!cd) return;

    const countdownDoc = doc(db, "chats", id);
    const users = [...cd.data().users, newUserEmail];
    await setDoc(countdownDoc, { users }, { merge: true });
  }

  async function deleteUser(email: string) {
    const cd = $chats.find((c) => c.id === id);
    if (!cd) return;

    const userDoc = doc(db, "chats", id);
    const users = cd.data().users;
    const userIndex = users.findIndex((u: string) => u === email);
    if (userIndex < 0) return console.error(`User not found`);
    users.splice(userIndex, 1);
    await setDoc(userDoc, { users }, { merge: true });
  }
</script>

<h3 class="text-xl my-4">Users</h3>

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

  <div class="flex gap-2 items-center">
    <Input
      type="email"
      placeholder="john@example.com"
      bind:value={newUserEmail}
    />
    <Button onclick={addUser}>
      <UserPlusIcon />
    </Button>
  </div>
</div>
