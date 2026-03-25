<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.unsetUser();  // ← clear user on mount
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
    <div class="card text-center" style="max-width: 400px; width: 100%;">
      <div class="card-body p-5">
        <div style="font-size: 56px; margin-bottom: 1rem;">&#127909;</div>
        <h4 class="text-white mb-2">You've been logged out</h4>
        <p class="text-muted mb-4">Thanks for watching. See you next time!</p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-primary" @click="$router.push('/login')">
            Log In Again
          </button>
          <button class="btn btn-outline-secondary" @click="$router.push('/movies')">
            Browse Movies
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
