<script setup>
import { watch, ref } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import axios from 'axios';

const userName = ref("");
const email = ref("");
const password = ref("");
const confirmPass = ref("");
const isEnabled = ref(false);
const notyf = new Notyf();
const router = useRouter();

watch([userName, email, password, confirmPass], ([u, e, p, c]) => {
  isEnabled.value = u !== "" && e !== "" && p !== "" && c !== "" && p === c;
});

async function handleSubmit() {
  try {
    let response = await axios.post('https://s87-s89-backend.onrender.com/users/register', {
      userName: userName.value,
      email: email.value,
      password: password.value
    });
    if (response.status === 201) {
      notyf.success("Registration Successful!");
      userName.value = "";
      email.value = "";
      password.value = "";
      confirmPass.value = "";
      router.push({ path: '/login' });
    } else {
      notyf.error("Registration Failed.");
    }
  } catch (e) {
    if (e.response?.data?.message) {
      notyf.error(e.response.data.message);
    } else {
      notyf.error("Registration Failed.");
    }
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 450px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">Register</h2>
        <form @submit.prevent="handleSubmit">

          <div class="mb-3">
            <label for="userName" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="userName"
              placeholder="Enter your username"
              required
              v-model="userName"
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter your email"
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
              placeholder="Enter password"
              required
              v-model="password"
            />
          </div>

          <div class="mb-3">
            <label for="confirmPass" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPass"
              placeholder="Confirm password"
              required
              v-model="confirmPass"
            />
            <small v-if="password !== confirmPass && confirmPass !== ''" class="text-danger">
              Passwords do not match.
            </small>
          </div>

          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-primary"a
              :disabled="!isEnabled"
            >
              Register
            </button>
          </div>

          <div class="text-center mt-3">
            <small>Already have an account?
              <RouterLink to="/login">Login here</RouterLink>
            </small>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>