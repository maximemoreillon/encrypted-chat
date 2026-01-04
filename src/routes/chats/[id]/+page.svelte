<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { encrypt } from "$lib/cryptography";
  import { onMount } from "svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import Message from "$lib/components/message.svelte";
  import { db } from "$lib/firebase";
  import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    type DocumentData,
  } from "firebase/firestore";
  import { page } from "$app/state";
  import UsersDialog from "$lib/components/usersDialog.svelte";
  import MessageForm from "$lib/components/messageForm.svelte";
  import KeyDialog from "$lib/components/keyDialog.svelte";
  import MoveLeftIcon from "@lucide/svelte/icons/move-left";

  let id = page.params.id;

  let keyBase64 = $state<string>("");

  let showDecrypted = $state(false);

  let messages = $state<DocumentData[]>([]);
  let chat = $state<DocumentData>();

  const subscribeToMessages = () => {
    if (!id) return alert("Missing chat ID");
    const collectionRef = collection(db, "chats", id, "messages");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    onSnapshot(q, ({ docs }) => {
      messages = docs;
    });
  };

  const subscribeToChat = () => {
    if (!id) return alert("Missing chat ID");
    const docRef = doc(db, "chats", id);
    onSnapshot(docRef, (doc) => {
      chat = doc;
    });
  };

  onMount(() => {
    subscribeToChat();
    subscribeToMessages();
  });
</script>

{#if id && chat}
  <div class="my-4 flex gap-2">
    <h2 class="text-3xl">{chat.data().name}</h2>
  </div>

  <!-- Toolbar -->
  <div class="flex gap-2 flex-wrap">
    <Button href="/chats" variant="outline">
      <MoveLeftIcon />
      <span>Chats</span>
    </Button>
    <div class="flex items-center space-x-2 my-2">
      <Switch id="decrypted" bind:checked={showDecrypted} />
      <Label for="decrypted">Decrypt</Label>
    </div>
    <div class="grow"></div>
    <KeyDialog {chat} bind:keyBase64 />
    <UsersDialog {chat} />
  </div>

  <div class="flex flex-col gap-2 my-6 items-start">
    {#each messages.toReversed() as message}
      <Message {message} {showDecrypted} {keyBase64} />
    {/each}
  </div>
  <MessageForm {chat} {keyBase64} />
{/if}
