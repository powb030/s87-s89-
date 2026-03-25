<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const title = ref('');
const content = ref('');
const isLoading = ref(false);
const isFetching = ref(true);

function getPost() {
  axios.get(`https://s87-s89-backend.onrender.com/posts/${route.params.id}`)
    .then(response => {
      const post = response.data.post;

      // only owner can edit
      if (userStore.user?.userName !== post.author) {
        notyf.error('Not authorized to edit this post.');
        router.push('/posts');
        return;
      }

      title.value = post.title;
      content.value = post.content;
    })
    .catch(error => {
      console.error(error);
      notyf.error('Failed to load post.');
      router.push('/posts');
    })
    .finally(() => {
      isFetching.value = false;
    });
}

function updatePost() {
  if (!title.value) {
    notyf.error('Title is required.');
    return;
  }
  if (!content.value) {
    notyf.error('Content is required.');
    return;
  }

  isLoading.value = true;

  axios.put(`https://s87-s89-backend.onrender.com/posts/${route.params.id}`, {
    title: title.value,
    content: content.value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(() => {
    notyf.success('Post updated successfully!');
    router.push(`/posts/${route.params.id}`);
  })
  .catch(error => {
    console.error(error);
    notyf.error(error.response?.data?.error || 'Failed to update post.');
  })
  .finally(() => {
    isLoading.value = false;
  });
}

onMounted(() => {
  getPost();
});
</script>

<template>
  <div class="container mt-5" style="max-width: 700px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="card-title mb-0">Edit Post</h2>
          <RouterLink :to="`/posts/${route.params.id}`" class="btn btn-sm btn-outline-secondary">
            &larr; Back
          </RouterLink>
        </div>

        <div v-if="isFetching" class="text-center mt-3">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <form v-else @submit.prevent="updatePost">
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
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>