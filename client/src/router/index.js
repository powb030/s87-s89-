import { createRouter, createWebHistory } from "vue-router"
import Register from "../pages/Register.vue"
import Login from "../pages/Login.vue"
import Posts from "../pages/Posts.vue"
import Logout from "../pages/Logout.vue"
import AddPost from "../pages/AddPost.vue"
import PostDetail from "../pages/PostDetail.vue"
import EditPost from "../pages/EditPost.vue"



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/posts"
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
        {
      path: "/posts",
      name: "posts",
      component: Posts                  
    },
    {
      path: "/posts/:id", 
      name: "postDetail",
      component: PostDetail
    },    
    {
      path: "/addPost",
      name: "addPost ",
      component: AddPost,   
    },
    {
      path: "/posts/:id/edit",
      name: "editPost",
      component: EditPost
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout
    }

  ]
})

router.beforeEach(async (to) => {
  const { useUserStore } = await import('../stores/user')
  const userStore = useUserStore()

  // Admin-only route guard
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'posts' }
  }

  // Logged-in-only route guard
  if (to.meta.requiresAuth && !userStore.user) {
    return { name: 'login' }
  }

})

export default router