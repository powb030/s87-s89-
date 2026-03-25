<script setup>
import { ref, onMounted, watch } from "vue";
import { RouterView } from "vue-router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import NavBarComponent from '@/components/NavBarComponent.vue';

const userStore = useUserStore();
const ready = ref(false);

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.get(`https://s87-s89-backend.onrender.com/users/details`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.data.user && response.data.user._id) {
        userStore.setUser({
          id: response.data.user._id,
          isAdmin: response.data.user.isAdmin
        });
      } else {
        userStore.unsetUser();
      }
    })
    .catch(error => {
      console.error("Token validation failed:", error);
      userStore.unsetUser();
    })
    .finally(() => {
      ready.value = true;
    });
  } else {
    ready.value = true;
  }
});

watch(() => userStore.user, (newUser) => {
  console.log(newUser);
  console.log(localStorage);
}, { deep: true });
</script>

<template>

  <div v-if="ready">
    <NavBarComponent />
    <RouterView />
  </div>
  <!-- ← show spinner while loading -->
  <div v-else class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>