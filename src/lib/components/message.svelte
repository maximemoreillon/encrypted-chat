<script lang="ts">
  let { children, own } = $props<{ children: any; own?: boolean }>();

  let className = $derived(
    () =>
      `border rounded-2xl px-4 py-2 wrap-anywhere ${own ? "bg-primary text-white self-end" : ""}`
  );
</script>

<div class={className()}>
  {@render children()}
</div>
