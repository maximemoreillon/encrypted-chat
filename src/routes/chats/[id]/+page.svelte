<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { encrypt, decrypt } from "$lib/cryptography";
  import { onMount } from "svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import Message from "$lib/components/message.svelte";
  import { db } from "$lib/firebase";
  import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    type DocumentData,
  } from "firebase/firestore";
  import { chats, currentUser } from "$lib/store";
  import { page } from "$app/state";
  import ChatUsersEdit from "$lib/components/chatUsersEdit.svelte";

  let id = page.params.id;

  let newMessageText = $state("");
  let keyBase64 = $state<string | null>(null);

  let showDecrypted = $state(false);

  let messages = $state<DocumentData[]>([]);

  const subscribeToMessages = () => {
    if (!id) return alert("Missing chat ID");

    const collectionRef = collection(db, "chats", id, "messages");

    const q = query(collectionRef, orderBy("timestamp", "desc"));

    onSnapshot(q, ({ docs }) => {
      messages = docs;
    });
  };

  onMount(() => {
    keyBase64 = localStorage.getItem("key");

    if (!keyBase64) return alert("Key not found");

    subscribeToMessages();
  });

  async function decryptMessages() {
    const promises = messages.map(async (message) => {
      const { ciphertextBase64, ivBase64, sender } = message.data();
      if (!keyBase64) throw new Error("Missing key");
      const decrypted = await decrypt(ciphertextBase64, ivBase64, keyBase64);
      return { decrypted, sender };
    });

    return Promise.all(promises);
  }

  let decryptedMessages = $derived(await decryptMessages());

  async function onsubmit(e: Event) {
    e.preventDefault();

    if (!keyBase64) return alert("Missing key");
    if (!$currentUser) return alert("Missing user");
    if (!id) return alert("Missing chat ID");

    const { ivBase64, ciphertextBase64 } = await encrypt(
      newMessageText,
      keyBase64
    );

    await addDoc(collection(db, "chats", id, "messages"), {
      ciphertextBase64,
      ivBase64,
      sender: $currentUser.email,
      timestamp: serverTimestamp(),
    });

    newMessageText = "";
  }
</script>

<div class="flex items-center space-x-2 my-2">
  <Switch id="decrypted" bind:checked={showDecrypted} />
  <Label for="decrypted">Decrypt</Label>
</div>

{#if id}
  <ChatUsersEdit {id} />

  <div class="flex flex-col gap-2 my-6 items-start">
    {#if showDecrypted}
      {#await decryptedMessages}
        <div>Decrypting...</div>
      {:then dms}
        {#each dms.toReversed() as message}
          <Message own={$currentUser?.email === message.sender}>
            {message.decrypted}
          </Message>
        {/each}
      {/await}
    {:else}
      {#each messages.toReversed() as message}
        <Message own={$currentUser?.email === message.data().sender}>
          {message.data().ciphertextBase64}
        </Message>
      {/each}
    {/if}
  </div>
  <form {onsubmit} class="m-4 flex gap-2">
    <Input
      type="text"
      placeholder="Your message"
      class="max-w-xs"
      bind:value={newMessageText}
    />
    <Button type="submit">Send</Button>
  </form>
{/if}
