import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const isAdmin = computed(() => user.value?.isAdmin === true)  
  const isLoggedIn = computed(() => user.value !== null)        

  function setUser(userData) {
    user.value = userData
  }

  function unsetUser() {
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, isAdmin, isLoggedIn, setUser, unsetUser }
})