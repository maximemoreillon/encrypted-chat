<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { onMount } from "svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import EyeIcon from "@lucide/svelte/icons/eye";
  import SaveIcon from "@lucide/svelte/icons/save";

  let keyString = $state("");
  let visible = $state(false);

  async function onsubmit(e: Event) {
    e.preventDefault();

    localStorage.setItem("key", keyString);
  }

  onMount(() => {
    keyString = localStorage.getItem("key") ?? "";
  });
</script>

<div class="flex justify-between">
  <h2 class="text-2xl">Key</h2>
  <Button href="/key/new">
    <PlusIcon />
    Generate
  </Button>
</div>

<form {onsubmit} class="flex gap-2 my-8">
  <Input
    type={visible ? "text" : "password"}
    placeholder="Your key"
    bind:value={keyString}
  />
  <Button onclick={() => (visible = !visible)}>
    <EyeIcon />
  </Button>
  <Button type="submit">
    <SaveIcon />
  </Button>
</form>
