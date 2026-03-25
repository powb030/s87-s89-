<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';

const notyf = new Notyf();
const router = useRouter();

const title = ref('');
const content = ref('');
const isLoading = ref(false);

function createPost() {
  if (!title.value) {
    notyf.error('Title is required.');
    return;
  }
  if (!content.value) {
    notyf.error('Content is required.');
    return;
  }

  isLoading.value = true;

  axios.post('https://s87-s89-backend.onrender.com/posts', {
    title: title.value,
    content: content.value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(() => {
    notyf.success('Post created successfully!');
    title.value = '';
    content.value = '';
    router.push('/posts');
  })
  .catch(error => {
    console.error(error);
    notyf.error(error.response?.data?.error || 'Failed to create post.');
  })
  .finally(() => {
    isLoading.value = false;
  });
}
</script>

<template>
  <div class="container mt-5" style="max-width: 700px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="card-title mb-0">Create Post</h2>
          <RouterLink to="/posts" class="btn btn-sm btn-outline-secondary">
            &larr; Back
          </RouterLink>
        </div>

        <form @submit.prevent="createPost">

          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Enter post title"
              v-model="title"
              required
            />
          </div>

          <div class="mb-3">
            <label for="content" class="form-label">Content</label>
            <textarea
              class="form-control"
              id="content"
              placeholder="Write your post content here..."
              rows="8"
              v-model="content"
              required
            ></textarea>
          </div>

          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ isLoading ? 'Publishing...' : 'Publish Post' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>