import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  install: (app, options) => {
    
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized errors globally
        if (error.response && error.response.status === 401) {
          const userStore = useUserStore()
          userStore.logout()
          
          // Redirect to login page if not already there
          const currentRoute = app.config.globalProperties.$route?.path
          if (currentRoute && currentRoute !== '/login') {
            app.config.globalProperties.$router.push('/login')
          }
        }
        return Promise.reject(error)
      }
    )
  }
}