<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { currentUser } from "$lib/store";
  import {
    setDoc,
    getFirestore,
    doc,
    addDoc,
    collection,
  } from "firebase/firestore";
  import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";

  let name = $state("New chat");

  async function onsubmit(e: Event) {
    e.preventDefault();
    if (!$currentUser) return;

    const db = getFirestore();

    const docRef = await addDoc(collection(db, "chats"), {
      name,
      users: [$currentUser.email],
    });

    return goto(`/chats/${docRef.id}`);
  }
</script>

<div class="flex items-center gap-2 my-4">
  <Button href="/chats" variant="ghost">
    <ArrowLeftIcon />
  </Button>
  <h2 class="text-2xl">New chat</h2>
  <div class="grow"></div>
</div>

<form {onsubmit} class="m-4 flex gap-2">
  <Input
    type="text"
    placeholder="Your message"
    class="max-w-xs"
    bind:value={name}
  />
  <Button type="submit">Send</Button>
</form>
