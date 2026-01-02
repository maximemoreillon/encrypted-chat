<script lang="ts">
  import {
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
  } from "firebase/auth";
  import { auth, googleProvider } from "$lib/firebase";
  import Button from "$lib/components/ui/button/button.svelte";
  import LoginIcon from "@lucide/svelte/icons/log-in";

  // https://firebase.google.com/docs/auth/web/google-signin
  async function login() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) throw new Error("Missing crednetials");
      // TODO: Not sure what
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  }
</script>

<Button onclick={login}>
  <LoginIcon />
  Login with Google
</Button>
