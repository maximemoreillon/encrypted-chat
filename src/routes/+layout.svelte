<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { auth, db } from "$lib/firebase";
  import { chats, currentUser } from "$lib/store";
  import LogoutButton from "$lib/components/logoutButton.svelte";
  import LoginButton from "$lib/components/loginButton.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import type { User } from "firebase/auth";
  import Button from "$lib/components/ui/button/button.svelte";
  import MessageSquareIcon from "@lucide/svelte/icons/message-square";
  import KeyIcon from "@lucide/svelte/icons/key";

  let { children } = $props();
  let loading = $state(true);

  const subscribeToChats = (user: User) => {
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where(`users`, "array-contains", user.email)
    );

    onSnapshot(q, ({ docs }) => {
      chats.set(docs);
    });
  };

  auth.onAuthStateChanged(async (user) => {
    currentUser.set(user);
    loading = false;
    if (!user) return;
    subscribeToChats(user);
  });
</script>

<svelte:head>
  <title>Encrypted chat</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="border p-4 flex gap-4 items-center">
  <h1 class="text-xl">Encrypted chat</h1>
  <div class="grow"></div>
  <nav class="flex gap-2">
    <Button href="/chats">
      <MessageSquareIcon />
      <span>Chats</span>
    </Button>
    <Button href="/key">
      <KeyIcon />
      <span>Key</span>
    </Button>
  </nav>
  {#if $currentUser}
    <LogoutButton />
  {/if}
</header>

<main class="max-w-xl mx-auto m-4">
  {#if loading}
    <div class="flex justify-center my-8">
      <Spinner class="size-16" />
    </div>
  {:else if $currentUser}
    {@render children()}
  {:else}
    <div class="flex justify-center m-8">
      <LoginButton />
    </div>
  {/if}
</main>
