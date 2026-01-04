<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";

  import * as Card from "$lib/components/ui/card/index.js";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { currentUser } from "$lib/store";
  import type { DocumentData } from "firebase/firestore";
  import { onMount } from "svelte";

  let loading = $state(true);
  let chats = $state<DocumentData[]>([]);

  const subscribeToChats = () => {
    if (!$currentUser) throw new Error("Current user not available");
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where(`users`, "array-contains", $currentUser.email)
    );

    onSnapshot(q, ({ docs }) => {
      chats = docs;
    });
  };

  onMount(subscribeToChats);
</script>

<div class="flex justify-between">
  <h2 class="text-2xl">My chats</h2>
  <Button href="/chats/new">
    <PlusIcon />
    Create
  </Button>
</div>

<ul class="flex flex-col gap-2 my-6">
  {#each chats as chat}
    <li>
      <Card.Root>
        <Card.Header>
          <Card.Title>{chat.data().name}</Card.Title>
          <Card.Description>
            {chat.data().users.join(", ")}
          </Card.Description>
        </Card.Header>
        <!-- <Card.Content>
        <p>Card Content</p>
      </Card.Content> -->
        <Card.Footer class="flex justify-end">
          <Button href={`/chats/${chat.id}`}>See</Button>
        </Card.Footer>
      </Card.Root>
    </li>
  {/each}
</ul>
