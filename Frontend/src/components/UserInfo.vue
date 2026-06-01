<template>
  <div class="flex flex-col items-center p-12">
    <!-- Loading state -->
    <div v-if="isLoading" class="py-8 text-center">
      <p class="text-xl">Loading profile data...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="py-8 text-center">
      <p class="text-xl text-red-500">{{ error }}</p>
      <button 
        @click="retryFetch" 
        class="mt-4 px-4 py-2 bg-[#A37550] text-white rounded hover:bg-[#8B5E3B]"
      >
        Retry
      </button>
    </div>
    
    <!-- Profile content -->
    <div v-else class="w-full">
      <!-- Profile Header -->
      <div class="flex flex-col items-center w-full max-w-3xl mx-auto mb-10">
        <div class="relative w-24 h-24 mb-4 overflow-hidden bg-gray-300 rounded-full group">
          <img v-if="userStore.user.profilePicture" :src="`http://localhost:8000/uploads/${userStore.user.profilePicture}`" alt="Profile Picture" class="object-cover w-full h-full" />  
          <div v-else class="flex items-center justify-center w-full h-full bg-[#A37550] text-white text-2xl font-bold">
          {{ userInitials }}
        </div>
  
    <!-- Overlay with edit icon -->
    <div class="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 cursor-pointer group-hover:opacity-100" @click="triggerFileInput">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
   </div>
  
    <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
    </div>
  </div>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-[#3A1C1A]">{{ user.firstName }} {{ user.lastName }}</h2>
        <p class="text-gray-600">@{{ user.username }}</p>
      </div>
    </div>

      <!-- Profile Display Section -->
      <div class="w-full max-w-3xl mx-auto">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="block mb-2 text-gray-700">First Name</label>
            <span class="block w-full p-3 truncate bg-gray-100 border rounded">{{ user.firstName || 'Not provided' }}</span>
          </div>
          <div>
            <label class="block mb-2 text-gray-700">Last Name</label>
            <span class="block w-full p-3 truncate bg-gray-100 border rounded">{{ user.lastName || 'Not provided' }}</span>
          </div>
          <div>
            <label class="block mb-2 text-gray-700">Email</label>
            <span class="block w-full p-3 truncate bg-gray-100 border rounded">{{ user.email || 'Not provided' }}</span>
          </div>
          <div>
            <label class="block mb-2 text-gray-700">Phone Number</label>
            <span class="block w-full p-3 truncate bg-gray-100 border rounded">{{ user.phone || 'Not provided' }}</span>
          </div>
        </div>

        <div class="mt-6">
          <label class="block mb-2 text-gray-700">Bio</label>
          <span class="block w-full p-3 bg-gray-100 border rounded min-h-[100px] overflow-auto">
            {{ user.bio || 'No bio provided yet.' }}
          </span>
        </div>
        </div>
      </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// Use the store's refs
const isLoading = ref(false)
const error = ref('')
const user = ref({})
const fileInput = ref(null)

// Get user initials for avatar fallback
const userInitials = computed(() => {
  const first = user.value.firstName ? user.value.firstName.charAt(0).toUpperCase() : '';
  const last = user.value.lastName ? user.value.lastName.charAt(0).toUpperCase() : '';
  return first + last;
})

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
}

// Watch for changes in the store's user object
watch(() => userStore.user, (newUserData) => {
  user.value = newUserData
}, { deep: true })

// Fetch user data when component mounts
onMounted(async () => {
  if (!userStore.token) {
    // No token means user is not logged in
    router.push('/login');
    return;
  }
  
  isLoading.value = true
  
  try {
    // Fetch user profile data
    await userStore.fetchUserProfile();
    // Copy data from store to local ref
    user.value = userStore.user
    isLoading.value = false
  } catch (err) {
    error.value = err.message
    isLoading.value = false
    
    // If there's an error and it's related to authentication, redirect to login
    if (error.value && (error.value.includes('authentication') || error.value.includes('Not authenticated'))) {
      router.push('/login');
    }
  }
})

//User profile picture upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  isLoading.value = true;
  
  try {
    // Prepare form data for multipart upload
    const formData = new FormData();
    formData.append('profile_picture', file);
    formData.append('bio', user.value.bio || '');
    
    const response = await fetch('http://127.0.0.1:8000/accounts/profile/', {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${userStore.token}`  
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile picture');
    }
    
    const responseData = await response.json();
    
    // Update the local state and store with the URL returned from the server
    user.value.profilePicture = responseData.data.profile_picture;
    userStore.setUser({
      ...userStore.user,
      profilePicture: responseData.data.profile_picture
    });
    
    // Clear error message
    error.value = '';
    
  } catch (uploadError) {
    console.error('Error uploading image:', uploadError);
    error.value = 'Failed to upload profile picture';
  } finally {
    isLoading.value = false;
  }
};

const retryFetch = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await userStore.fetchUserProfile();
    user.value = userStore.user
    isLoading.value = false
  } catch (err) {
    error.value = err.message
    isLoading.value = false
  }
}

const logout = () => {
  console.log('userStore.logout() called')
  userStore.logout();
  router.push('/login');
}
</script>
