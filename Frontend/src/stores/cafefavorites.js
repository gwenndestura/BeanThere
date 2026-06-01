import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCafeStore = defineStore('cafe', () => {
  const favoriteCafes = ref([])
  const isLoading = ref(false)
  
  // Fetch all favorites
  const fetchFavorites = async () => {
    try {
      isLoading.value = true
      const response = await axios.get('http://127.0.0.1:8000/favorite/user/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
       console.log('API Response in store:', response.data)
      
      // Handle the array correctly
      if (Array.isArray(response.data)) {
        favoriteCafes.value = response.data.map(item => {
          // Handle both direct cafe objects and nested cafe objects
          if (item.cafe) {
            return {
              id: item.cafe.id,
              name: item.cafe.name,
              image: item.cafe.image || '/placeholder-cafe.jpg'
            }
          } else {
            return {
              id: item.id,
              name: item.name,
              image: item.image || '/placeholder-cafe.jpg'
            }
          }
        })
      } else {
        console.error('Unexpected response format:', response.data)
        favoriteCafes.value = []
      }
      
      return favoriteCafes.value
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Check if a specific cafe is favorited
  const isCafeFavorited = async (cafeId) => {
    // If we already have favorites loaded, check them first
    if (favoriteCafes.value.length > 0) {
      return favoriteCafes.value.some(cafe => cafe.id === cafeId)
    }
    
    // Otherwise fetch and check
    await fetchFavorites()
    return favoriteCafes.value.some(cafe => cafe.id === cafeId)
  }
  
  // Toggle favorite status for a cafe
  const toggleFavorite = async (cafeId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/favorite/toggle/${cafeId}/`, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      
      console.log('Toggle response:', response.data)
      
      // Update our local state after toggling
      await fetchFavorites()
      
      // Check if the cafe is now favorited
      const isFavorited = favoriteCafes.value.some(cafe => cafe.id === cafeId)
      
      // Notify other components about the change
      window.dispatchEvent(new CustomEvent('favoriteChanged', { 
        detail: { cafeId, isFavorited } 
      }))
      
      return isFavorited
    } catch (error) {
      console.error('Error toggling favorite status:', error)
      throw error
    }
  }
  
  return {
    favoriteCafes,
    isLoading,
    fetchFavorites,
    isCafeFavorited,
    toggleFavorite
  }
})