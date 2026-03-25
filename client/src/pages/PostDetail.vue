<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { Modal } from 'bootstrap';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const post = ref(null);
const isLoading = ref(true);
const comment = ref('');
const isCommenting = ref(false);

const deleteModalRef = ref(null);
const notifModalRef = ref(null);
let deleteModalInstance = null;
let notifModalInstance = null;

const notif = ref({ type: 'success', title: '', message: '' });

onMounted(() => {
  getPost();
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

function openDeleteModal() {
  if (!deleteModalInstance) {
    deleteModalInstance = new Modal(deleteModalRef.value);
  }
  deleteModalInstance.show();
}

function confirmDelete() {
  deleteModalInstance.hide();
  axios.delete(`https://s87-s89-backend.onrender.com/posts/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(() => {
    showNotif('success', 'Post deleted successfully.');
    setTimeout(() => router.push('/posts'), 1800);
  })
  .catch(error => {
    console.error(error);
    showNotif('danger', error.response?.data?.error || 'Failed to delete post.');
  });
}

function getPost() {
  axios.get(`https://s87-s89-backend.onrender.com/posts/${route.params.id}`)
    .then(response => {
      post.value = response.data.post;
      console.log('post.author:', post.value.author);
      console.log('userStore.user:', userStore.user);
      console.log('match:', userStore.user?.userName === post.value.author);
    })
    .catch(error => {
      console.error(error);
      showNotif('danger', 'Failed to load post.');
      router.push('/posts');
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function addComment() {
  if (!comment.value) {
    showNotif('warning', 'Comment cannot be empty.');
    return;
  }
  isCommenting.value = true;
  axios.post(`https://s87-s89-backend.onrender.com/posts/${route.params.id}/comments`, {
    comment: comment.value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => {
    showNotif('success', 'Comment added!');
    comment.value = '';
    post.value = response.data.post;
  })
  .catch(error => {
    console.error(error);
    showNotif('danger', error.response?.data?.error || 'Failed to add comment.');
  })
  .finally(() => {
    isCommenting.value = false;
  });
}
</script>

<template>
  <div class="container mt-5" style="max-width: 800px;">

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

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="post">

      <RouterLink to="/posts" class="btn btn-sm btn-outline-secondary mb-4">
        &larr; Back to Posts
      </RouterLink>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <h2 class="card-title">{{ post.title }}</h2>
          <p class="text-muted" style="font-size: 0.85rem;">
            By <strong>{{ post.author }}</strong> &middot;
            {{ new Date(post.createdAt).toLocaleDateString() }}
          </p>
          <hr />
          <p class="card-text" style="white-space: pre-line;">{{ post.content }}</p>

          <div v-if="userStore.user" class="d-flex gap-2 mt-3">
            <RouterLink
              v-if="userStore.user?.userName === post.author"
              :to="`/posts/${post._id}/edit`"
              class="btn btn-sm btn-outline-secondary"
            >
              Edit Post
            </RouterLink>
            <button
              v-if="userStore.user?.userName === post.author || userStore.isAdmin"
              class="btn btn-sm btn-outline-danger"
              @click="openDeleteModal"
            >
              Delete Post
            </button>
          </div>

        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <h5 class="mb-3">
            Comments
            <span class="badge bg-secondary ms-1">{{ post.comments?.length || 0 }}</span>
          </h5>

          <p v-if="!post.comments || post.comments.length === 0" class="text-muted">
            No comments yet. Be the first to comment!
          </p>

          <div
            v-for="c in post.comments"
            :key="c._id"
            class="border rounded p-3 mb-2"
          >
            <div class="d-flex justify-content-between">
              <strong>{{ c.userName }}</strong>
              <small class="text-muted">{{ new Date(c.createdAt).toLocaleDateString() }}</small>
            </div>
            <p class="mb-0 mt-1">{{ c.comment }}</p>
          </div>

          <div v-if="userStore.user" class="mt-4">
            <hr />
            <h6>Leave a Comment</h6>
            <form @submit.prevent="addComment">
              <div class="mb-3">
                <textarea
                  class="form-control"
                  rows="3"
                  placeholder="Write your comment..."
                  v-model="comment"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isCommenting"
              >
                <span v-if="isCommenting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isCommenting ? 'Posting...' : 'Post Comment' }}
              </button>
            </form>
          </div>

          <div v-else class="mt-4 text-center">
            <p class="text-muted">
              <RouterLink to="/login">Login</RouterLink> to leave a comment.
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>