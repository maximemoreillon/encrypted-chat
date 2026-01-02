<script lang="ts">
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import Button from "$lib/components/ui/button/button.svelte";
  import LogoutIcon from "@lucide/svelte/icons/log-out";

  // https://firebase.google.com/docs/auth/web/google-signin
  async function logout() {
    await signOut(auth);
  }
</script>

<Button onclick={logout} variant="secondary">
  <LogoutIcon />
</Button>
