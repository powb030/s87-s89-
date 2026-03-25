<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { Modal } from 'bootstrap';

const router = useRouter();
const userStore = useUserStore();
const posts = ref([]);
const isLoading = ref(true);

// Modal refs
const deleteModalRef = ref(null);
const notifModalRef = ref(null);
let deleteModalInstance = null;
let notifModalInstance = null;

// State
const postToDelete = ref(null);
const notif = ref({ type: 'success', title: '', message: '' });

onMounted(() => {
  getAllPosts();
});

function showNotif(type, message) {
  notif.value = {
    type,
    title: type === 'success' ? '✔ Success' : type === 'warning' ? '⚠ Warning' : '✖ Error',
    message
  };
  if (!notifModalInstance) {
    notifModalInstance = new Modal(notifModalRef.value);
  }
  notifModalInstance.show();
}

function openDeleteModal(postId) {
  postToDelete.value = postId;
  if (!deleteModalInstance) {
    deleteModalInstance = new Modal(deleteModalRef.value);
  }
  deleteModalInstance.show();
}

function confirmDelete() {
  deleteModalInstance.hide();
  axios.delete(`https://s87-s89-backend.onrender.com/posts/${postToDelete.value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(() => {
    posts.value = posts.value.filter(p => p._id !== postToDelete.value);
    postToDelete.value = null;
    showNotif('success', 'Post deleted successfully.');
  })
  .catch(error => {
    console.error(error);
    showNotif('danger', error.response?.data?.error || 'Failed to delete post.');
  });
}

function getAllPosts() {
  axios.get('https://s87-s89-backend.onrender.com/posts')
    .then(response => {
      posts.value = response.data.posts;
    })
    .catch(error => {
      console.error(error);
      showNotif('danger', 'Failed to load posts.');
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function handleReadMore(postId) {
  if (!userStore.user) {
    showNotif('warning', 'Please login to read the full post.');
    router.push('/login');
  } else {
    router.push(`/posts/${postId}`);
  }
}
</script>

<template>
  <div class="container mt-5">

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" ref="deleteModalRef" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title" id="deleteModalLabel">
              <span class="badge bg-danger me-2">🗑 Delete Post</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this post? This action <strong>cannot be undone</strong>.
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div class="modal fade" ref="notifModalRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title">
              <span class="badge me-2" :class="`bg-${notif.type}`">{{ notif.title }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            {{ notif.message }}
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Posts</h2>
      <RouterLink to="/addPost" class="btn btn-primary" v-if="userStore.user?.id">
        Create Post
      </RouterLink>
    </div>

    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center mt-5">
      <p class="text-muted">No posts yet. Be the first to post!</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="post in posts" :key="post._id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text text-muted" style="font-size: 0.85rem;">
              By <strong>{{ post.author }}</strong> &middot;
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </p>
            <p class="card-text">
              {{ post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content }}
            </p>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">

            <button
              class="btn btn-sm btn-outline-primary"
              @click="handleReadMore(post._id)"
            >
              Read More
            </button>

            <div v-if="userStore.user?.id === post.authorId || userStore.user?.isAdmin" class="d-flex gap-2">
              <RouterLink
                v-if="userStore.user?.id === post.authorId && !userStore.isAdmin"
                :to="`/posts/${post._id}/edit`"
                class="btn btn-sm btn-outline-secondary"
              >
                Edit
              </RouterLink>
              <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(post._id)">
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>