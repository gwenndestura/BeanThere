<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Initialize fields with current data from store
const firstName = ref(userStore.user.firstName)
const lastName = ref(userStore.user.lastName)
const email = ref(userStore.user.email)
const phone = ref(userStore.user.phone)
const bio = ref(userStore.user.bio)
const profilePictureFile = ref(null)
const profilePicturePreview = ref(userStore.user.profilePicture)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  if (userStore.user) {
    firstName.value = userStore.user.firstName
    lastName.value = userStore.user.lastName
    email.value = userStore.user.email
    phone.value = userStore.user.phone
    bio.value = userStore.user.bio
    profilePicturePreview.value = userStore.user.profilePicture
    console.log(userStore.user.profilePicture)
  }
})

// Handle Profile Picture Upload
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profilePictureFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePicturePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Save the changes to profile picture and bio
const saveChanges = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('bio', bio.value)
    if (profilePictureFile.value) {
      formData.append('profile_picture', profilePictureFile.value)
    }

    const response = await axios.put('http://127.0.0.1:8000/accounts/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${userStore.token}`
      }
    })

    // Update the user data in the store
    userStore.setUser({
      ...userStore.user,
      bio: response.data.bio,
      profilePicture: response.data.profile_picture
    });

    successMessage.value = 'Profile updated successfully!'
    await userStore.fetchUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to update profile.'
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="flex flex-col items-center w-full max-w-3xl mx-auto mb-10">
      <div class="w-32 h-32 mb-4 overflow-hidden bg-gray-300 rounded-full">
        <img
          v-if="profilePicturePreview"
          :src="profilePicturePreview"
          alt="Profile Picture"
          class="object-cover w-full h-full"
        />
      </div>

      <input
        type="file"
        @change="handleImageUpload"
        accept="image/*"
        class="hidden"
        ref="fileInput"
      />
      <button
        @click="$refs.fileInput.click()"
        class="bg-[#4A2C2A] hover:bg-[#603A36] text-white font-semibold px-6 py-2 rounded-full shadow-md mb-4"
      >
        Change Profile Picture
      </button>
      <p class="text-center">{{ firstName }} {{ lastName }}</p>
    </div>

    <!-- Settings Form -->
    <form @submit.prevent="saveChanges" class="w-full max-w-4xl p-8 bg-white rounded shadow-md">
      <!-- Display-only fields -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label class="block mb-2 font-semibold text-gray-700">First Name</label>
          <input
            v-model="firstName"
            type="text"
            class="block w-full p-2 bg-gray-100 border rounded-md"
            readonly
          />
        </div>
        <div>
          <label class="block mb-2 font-semibold text-gray-700">Last Name</label>
          <input
            v-model="lastName"
            type="text"
            class="block w-full p-2 bg-gray-100 border rounded-md"
            readonly
          />
        </div>
        <div>
          <label class="block mb-2 font-semibold text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="block w-full p-2 bg-gray-100 border rounded-md"
            readonly
          />
        </div>
        <div>
          <label class="block mb-2 font-semibold text-gray-700">Phone Number</label>
          <input
            v-model="phone"
            type="text"
            class="block w-full p-2 bg-gray-100 border rounded-md"
            readonly
          />
        </div>
      </div>

      <!-- Editable Bio -->
      <div class="mt-6">
        <label class="block mb-2 font-semibold text-gray-700">Bio</label>
        <textarea
          v-model="bio"
          class="block w-full p-2 bg-gray-100 border rounded-md"
          rows="3"
        ></textarea>
      </div>

      <div class="mt-10 text-center">
        <button
          type="submit"
          class="bg-[#4A2C2A] hover:bg-[#603A36] text-white font-semibold px-10 py-3 rounded-full shadow-md"
        >
          Save Changes
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="text-center text-red-500 error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-center text-green-500 success">{{ successMessage }}</p>
  </div>
</template>
