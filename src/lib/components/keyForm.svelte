<!-- THIS IS CURRENTLY UNUSED -->
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { onMount } from "svelte";

  let keyString = $state("");

  async function onsubmit(e: Event) {
    e.preventDefault();

    localStorage.setItem("key", keyString);
  }

  onMount(() => {
    keyString = localStorage.getItem("key") ?? "";
  });
</script>

<form {onsubmit} class="m-4 flex gap-2">
  <Input
    type="password"
    placeholder="Your key"
    class="max-w-xs"
    bind:value={keyString}
  />
  <Button type="submit">Save</Button>
</form>
