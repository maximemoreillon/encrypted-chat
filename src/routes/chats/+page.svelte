<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";

  import { chats } from "$lib/store";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="flex justify-between">
  <h2 class="text-2xl">My chats</h2>
  <Button href="/countdowns/new">
    <PlusIcon />
    Create
  </Button>
</div>

<ul class="flex flex-col gap-2 my-6">
  {#each $chats as chat}
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
