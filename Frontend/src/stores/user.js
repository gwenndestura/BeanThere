// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    profilePicture: '',
    username: ''
  })
  const isLoading = ref(false)
  const error = ref('')

  // Computed property to check if user is logged in
  const isLoggedIn = computed(() => {
    return !!token.value && token.value.length > 0
  })

  // Set user data
  const setUser = (userData) => {
    user.value = {
      firstName: userData.first_name || userData.firstName || '',
      lastName: userData.last_name || userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone_number || userData.phone || '',
      bio: userData.bio || '',
      profilePicture: userData.profile_picture 
        ? `http://127.0.0.1:8000${userData.profile_picture}` 
        : (userData.profilePicture || ''),
      username: userData.username || ''
    }
  }

  // Set authentication token
  const setToken = (newToken) => {
    if (newToken) {
      token.value = newToken
      localStorage.setItem('token', newToken)
    } else {
      token.value = ''
      localStorage.removeItem('token')
    }
  }

  // Fetch user profile data from the backend
  const fetchUserProfile = async () => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/profile/', {
        headers: {
          'Authorization': `Token ${token.value}`
        }
      })

      setUser(response.data)
      isLoading.value = false
      return response.data
    } catch (err) {
      console.error('Error fetching user profile:', err)
      error.value = err.response?.data?.error || 'Failed to load profile data'
      isLoading.value = false

      if (err.response && err.response.status === 401) {
        logout()
      }
      return Promise.reject(err)
    }
  }

  // Logout function
  const logout = async () => {
    if (token.value) {
      try {
        await axios.post('http://127.0.0.1:8000/accounts/logout/', {}, {
          headers: {
            'Authorization': `Token ${token.value}`
          }
        })
      } catch (err) {
        console.error('Error during logout:', err)
      }
    }

    token.value = ''
    localStorage.removeItem('token')
    user.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      profilePicture: '',
      username: ''
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isLoggedIn,
    setUser,
    setToken,
    fetchUserProfile,
    logout
  }
})
