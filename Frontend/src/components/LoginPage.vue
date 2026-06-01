<template>
  <div class="flex h-screen">
    <!-- Left Side - Image -->
    <div class="w-1/2 bg-center bg-cover" style="background-image: url('/login-coffee.png');"></div>

    <!-- Right Side - Form -->
    <div class="w-1/2 bg-[#2D1B15] flex flex-col justify-center items-center text-white px-10">
      <!-- Logo -->
      <div class="mb-8">
        <div class="flex items-center justify-center w-20 h-20 bg-gray-300 rounded-full">
          <img src="/beanthere-logo.png" alt="Bean There Logo" class="h-auto w-12" />
        </div>
      </div>

      <!-- Login Form -->
      <div class="w-full max-w-md">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Username" 
          class="w-full p-3 mb-4 text-black bg-white rounded" 
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          class="w-full p-3 mb-2 text-black bg-white rounded" 
        />
        
        <div v-if="errorMessage" class="mb-4 text-sm text-red-400">{{ errorMessage }}</div>
        <div v-if="successMessage" class="mb-4 text-sm text-green-400">{{ successMessage }}</div>

        <button 
          @click="login" 
          class="w-full bg-[#A37550] text-white py-3 rounded hover:bg-[#8B5E3B]"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign in</span>
        </button>

        <div class="my-4 text-center">Or</div>

        <router-link to="/signup" class="w-full block">
          <button class="w-full py-3 border border-white rounded">
            Create an account
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push(route.query.redirect?.toString() || '/home')
  }
})

const login = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter both username/email and password.'
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/accounts/login/', {
      username: username.value,
      password: password.value,
    })

    const token = response.data.token
    if (!token) throw new Error('No authentication token received')

    userStore.setToken(token)
    await userStore.fetchUserProfile()

    successMessage.value = 'Login successful! Redirecting...'

    setTimeout(() => {
      router.push(route.query.redirect?.toString() || '/home')
    }, 1000)

  } catch (error) {
    console.error('Login error:', error)
    userStore.setToken(null)

    const res = error.response?.data

    if (typeof res === 'object') {
      errorMessage.value = res.non_field_errors?.[0]
        || res.detail
        || res.error
        || 'Invalid credentials. Please try again.'
    } else {
      errorMessage.value = error.message === 'No authentication token received'
        ? error.message
        : 'Network error. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
