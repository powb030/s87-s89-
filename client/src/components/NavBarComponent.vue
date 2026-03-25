<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.unsetUser(); 
  router.push('/login');  
}

</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark" style="background-color: #191919; border-bottom: 2px solid #2a9fd6;">
    <div class="container">

      <router-link 
        class="navbar-brand fw-bold" 
        :to="{ name: 'posts' }" 
        style="color: #2a9fd6; letter-spacing: 1px;"
      >
        ✏️ Scribbly Stories
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style="border-color: #2a9fd6;"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto align-items-center gap-2">

          <!-- Logged in users -->
          <router-link
            class="nav-link"
            :to="{ name: 'posts' }"
            v-if="userStore.user"
            style="color: #adafae;"
            active-class="active-link"
          >
            Blogs
          </router-link>

          <!-- Guest links -->
          <router-link
            class="nav-link"
            :to="{ name: 'register' }"
            v-if="!userStore.user"
            style="color: #adafae;"
            active-class="active-link"
          >
            Register
          </router-link>

          <router-link
            class="nav-link"
            :to="{ name: 'login' }"
            v-if="!userStore.user"
            style="color: #adafae;"
            active-class="active-link"
          >
            Login
          </router-link>

          <!-- Logout -->
          <router-link :to="{ name: 'login' }" custom v-slot="{ navigate }">
            
            <a
              class="btn btn-outline-danger btn-sm"
              href="#"
              @click.prevent="() => { logout(); navigate(); }"
              v-if="userStore.user"
            >
              Logout
            </a>
          </router-link>

        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.active-link {
  color: #2a9fd6 !important;
  font-weight: 600;
}
.nav-link:hover {
  color: #fff !important;
}
</style>