<template>
  <div class="flex h-screen">
    <!-- Left Side - Image -->
    <div class="w-1/2 bg-center bg-cover" style="background-image: url('/login-coffee.png');"></div>

    <!-- Right Side - Form -->
    <div class="w-1/2 bg-[#2D1B15] flex flex-col justify-center px-16 text-white">
      <h1 class="mb-8 text-4xl font-bold text-center">Sign up</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Full Name</label>
          <input v-model="fullName" type="text" placeholder="Name..." class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>
        <div>
          <label class="block mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Email Address..." class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>
        <div>
          <label class="block mb-1">Username</label>
          <input v-model="username" type="text" placeholder="Username..." class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>
        <div>
          <label class="block mb-1">Phone Number</label>
          <input v-model="phone" type="text" placeholder="Phone Number..." class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>
        <div>
          <label class="block mb-1">Password</label>
          <input v-model="password" type="password" placeholder="**********" class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>
        <div>
          <label class="block mb-1">Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="**********" class="w-full px-4 py-2 rounded bg-[#5B4642] text-white placeholder-gray-300" />
        </div>

        <div v-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</div>
        <div v-if="successMessage" class="text-sm text-green-400">{{ successMessage }}</div>

        <button type="submit" class="w-full py-2 mt-4 bg-[#A87C4F] hover:bg-[#996840] text-white font-semibold rounded">
          Sign up
        </button>
        <p class="mt-2 text-sm text-center">
        <router-link to="/login" class="underline hover:text-gray-300">Log in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' 

const router = useRouter()
const userStore = useUserStore()

const API_URL = 'http://127.0.0.1:8000/accounts/register/'

// Form fields
const fullName = ref('')
const email = ref('')
const username = ref('')
const phone = ref('')
const street = ref('')
const barangay = ref('')
const bio = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

// Form submission handler
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Form validation
  if (!fullName.value || !email.value || !username.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Name, email, username, and password are required.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true 

  try {
    // Request body structured according to your backend serializer expectations
    const response = await axios.post('http://127.0.0.1:8000/accounts/register/', {
      full_name: fullName.value,
      email: email.value,
      username: username.value,
      phone_number: phone.value,
      street: street.value,
      barangay: barangay.value,
      bio: bio.value,
      password: password.value,
      confirm_password: confirmPassword.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('Registration response:', response.data)
    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    // Redirect to login page after successful signup
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.response) {
      if (error.response.data) {
        const data = error.response.data
        
        // Handle detailed validation errors
        if (data.details && typeof data.details === 'object') {
          // Find the first error message
          for (const field in data.details) {
            errorMessage.value = `${field}: ${data.details[field][0]}`
            break
          }
        } else if (data.email) {
          errorMessage.value = `Email: ${data.email[0]}`
        } else if (data.username) {
          errorMessage.value = `Username: ${data.username[0]}`
        } else if (data.password) {
          errorMessage.value = `Password: ${data.password[0]}`
        } else if (data.phone_number) {
          errorMessage.value = `Phone number: ${data.phone_number[0]}`
        } else if (data.non_field_errors) {
          errorMessage.value = data.non_field_errors[0]
        } else if (data.detail) {
          errorMessage.value = data.detail
        } else if (data.error) {
          errorMessage.value = data.error
        } else {
          errorMessage.value = 'Registration failed. Please check your information.'
        }
      } else {
        errorMessage.value = `Server error: ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage.value = 'Network error. Please check your connection.'
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>