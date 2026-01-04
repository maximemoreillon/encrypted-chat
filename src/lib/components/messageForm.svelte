<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { encrypt } from "$lib/cryptography";
  import SendIcon from "@lucide/svelte/icons/send";

  import { db } from "$lib/firebase";
  import {
    addDoc,
    collection,
    serverTimestamp,
    type DocumentData,
  } from "firebase/firestore";
  import { currentUser } from "$lib/store";

  let { chat, keyBase64 } = $props<{
    chat: DocumentData;
    keyBase64?: string | null;
  }>();

  let newMessageText = $state("");

  async function onsubmit(e: Event) {
    e.preventDefault();

    if (!keyBase64) return alert("Missing key");
    if (!$currentUser) return alert("Missing user");

    const { ivBase64, ciphertextBase64 } = await encrypt(
      newMessageText,
      keyBase64
    );

    await addDoc(collection(db, "chats", chat.id, "messages"), {
      ciphertextBase64,
      ivBase64,
      sender: $currentUser.email,
      timestamp: serverTimestamp(),
    });

    newMessageText = "";
  }
</script>

<form {onsubmit} class="m-4 flex gap-2">
  <Input
    type="text"
    placeholder="Your message"
    bind:value={newMessageText}
    disabled={!keyBase64}
  />
  <Button type="submit" disabled={!keyBase64}>
    <SendIcon />
  </Button>
</form>
