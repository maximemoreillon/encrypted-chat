<script lang="ts">
  import { deleteDoc, doc, type DocumentData } from "firebase/firestore";
  import Button from "./ui/button/button.svelte";
  import TrashIcon from "@lucide/svelte/icons/trash";
  import { db } from "$lib/firebase";
  import { goto } from "$app/navigation";

  const { chat } = $props<{
    chat: DocumentData;
  }>();

  let loading = $state(false);

  async function onclick() {
    if (!chat) throw new Error("Countdown ID not defined");
    if (!confirm(`Delete chat?`)) return;
    loading = true;
    await deleteDoc(doc(db, "chats", chat.id));
    loading = false;
    return goto("/chats");
  }
</script>

<Button variant="destructive" {onclick}>
  <TrashIcon />
</Button>
