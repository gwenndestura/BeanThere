<template>
  <div class="flex flex-col min-h-screen px-10 py-16 bg-white">
    <!-- User Name -->
    <section class="mb-16 text-center">
      <h1 class="text-5xl font-extrabold text-[#2C0E0E] mb-2">
        {{ user.name }}
      </h1>
    </section>

    <!-- Favorite Cafes -->
    <section>
      <h2 class="text-3xl font-bold text-[#2C0E0E] mb-10 text-center">
        Favorite Cafes
      </h2>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C0E0E]"></div>
      </div>

      <!-- No favorites message -->
      <div v-else-if="favoriteCafes.length === 0" class="py-10 text-center">
        <p class="text-xl text-gray-600">You don't have any favorite cafes yet.</p>
        <router-link
          to="/home"
          class="mt-4 inline-block px-6 py-3 bg-[#2C0E0E] text-white rounded-lg hover:bg-[#4C2E2E] transition-colors"
        >
          Explore Cafes
        </router-link>
      </div>

      <!-- Favorites grid -->
      <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="cafe in favoriteCafes"
          :key="cafe.id"
          class="flex flex-col items-center p-6 transition duration-300 transform bg-white shadow-lg rounded-2xl hover:scale-105"
        >
          <div class="relative w-64 h-64 mb-6 overflow-hidden rounded-xl">
            <img
              :src="cafe.image || '/Tinatangi.jpg'"
              :alt="cafe.name"
              class="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            />
          </div>
          <h3 class="mb-4 text-xl font-bold text-[#2C0E0E]">{{ cafe.name }}</h3>
          <div class="flex items-center justify-between w-full mb-4">
            <button
              @click="toggleFavorite(cafe.id)"
              class="flex items-center text-red-500 transition hover:text-red-700"
            >
              <span class="mr-2 text-2xl">❤️</span>
              <span>Remove from favorites</span>
            </button>
          </div>
          <router-link
            :to="`/cafe/${cafe.id}`"
            class="px-6 py-3 text-base font-semibold text-white transition-all duration-300 bg-[#2C0E0E] rounded-full shadow-md hover:bg-[#4C2E2E]"
          >
            See Menu
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
// import { useCafeStore } from 'stores/cafefavorites' // Not used or missing

const user = ref({ name: '' })
const favoriteCafes = ref([])
const loading = ref(true)
const route = useRoute()
// const cafeStore = useCafeStore() // Not used or missing

// Axios config with base URL and token
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`,
  },
})

// Fetch user profile
const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile/')
    user.value.name = response.data.name || 'User'
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Fetch favorite cafes
const getFavorites = async () => {
  try {
    loading.value = true
    const response = await api.get('/favorite/user/')
    console.log('Favorites API response:', response.data)

    if (Array.isArray(response.data)) {
      favoriteCafes.value = response.data.map(item => {
        if (item.cafe && item.cafe.id && item.cafe.name) {
          return {
            id: item.cafe.id,
            name: item.cafe.name,
            image: '/Somedays.jpg' // Default image
          }
        } else if (item.id && item.name) {
          return {
            id: item.cafe.id,
            name: item.cafe.name,
            image: '/Somedays.jpg',
          }
        } else {
          console.warn('Skipping invalid cafe item:', item)
          return null
        }
      }).filter(cafe => cafe !== null)
    } else {
      console.error('Unexpected response:', response.data)
      favoriteCafes.value = []
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    favoriteCafes.value = []
  } finally {
    loading.value = false
  }
}

// Remove from favorites and refresh list
const toggleFavorite = async (cafeId) => {
  try {
    await api.post(`/favorite/toggle/${cafeId}/`)
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('favoriteChanged'))
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

// Listen for favorite updates from other views
const favoriteChangeHandler = () => getFavorites()

onMounted(() => {
  getUserProfile()
  getFavorites()
  window.addEventListener('favoriteChanged', favoriteChangeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('favoriteChanged', favoriteChangeHandler)
})

// Refresh if navigated back to this route
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/favorites') {
      getFavorites()
    }
  }
)
</script>
