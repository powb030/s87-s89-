<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();
const email = ref('');
const password = ref('');

const isActive = computed(() => {
  return email.value !== '' && password.value !== '';
});

function authenticate() {
  axios.post('https://s87-s89-backend.onrender.com/users/login', {
    email: email.value,
    password: password.value
  })
  .then(response => {
    if (response.data.access !== undefined) {
      localStorage.setItem('token', response.data.access);
      retrieveUserDetails(response.data.access);
      email.value = '';
      password.value = '';
      notyf.success('Successful Login');
    }
  })
  .catch(error => {
    console.error(error);
    notyf.error('Login failed. Please check your credentials.');
  });
}

function retrieveUserDetails(token) {
  axios.get('https://s87-s89-backend.onrender.com/users/details', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    userStore.setUser({
      id: response.data.user._id,
      isAdmin: response.data.user.isAdmin,
      userName: response.data.user.userName
    });
    router.push('/posts');
  })
  .catch(error => {
    console.error("Failed to retrieve user details:", error);
    notyf.error("Could not fetch user details.");
  });
}

onMounted(() => {
  if (userStore.user?.id) {
    router.push('/posts'); 
  }
});
</script>

<template>
  <div class="container mt-5" style="max-width: 450px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">Login</h2>
        <form @submit.prevent="authenticate">

          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter email"
              required
              v-model="email"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
              v-model="password"
            />
          </div>

          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isActive"
            >
              Log In
            </button>
          </div>

          <div class="text-center mt-3">
            <small>Don't have an account?
              <RouterLink to="/register">Register here</RouterLink>
            </small>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>