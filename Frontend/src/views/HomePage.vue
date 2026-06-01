<script setup>
import { useRouter } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

import homeCoffee from '/home-coffee.png';
import aboutCoffee from '/about-coffee.png';
import tinatangi from '/Tinatangi.jpg';
import somedays from '/Somedays.jpg';
import hbsb from '/HBSB.jpg';
import bfc from '/bfc.jpg';

const router = useRouter();
const userStore = useUserStore();

const searchQuery = ref('');
const showLoginMessage = ref(false);
const showFeedbackForm = ref(false);

const cafeRating = ref(5);
const cafeComment = ref('');
const selectedCafe = ref(null);
const submittingFeedback = ref(false);
const feedbackSuccess = ref(false);
const feedbackFormError = ref('');

const cafes = ref([
  { id: 1, name: "Tinatangi Café", image: tinatangi, route: "/tinatangi" },
  { id: 2, name: "Someday Brews", image: somedays, route: "/someday-brews" },
  { id: 3, name: "He Brews She Bakes", image: hbsb, route: "/he-brews-she-bakes" },
  { id: 4, name: "But First Coffee", image: bfc, route: "/but-first-coffee" }
]);

const filteredCafes = ref([...cafes.value]);

const feedbacks = ref([]);
const isLoadingFeedback = ref(false);
const feedbackError = ref('');

async function fetchCafes() {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cafes/?search=${searchQuery.value}`);
    const data = await response.json();
    cafes.value = data.results || cafes.value;
    filterCafe();
  } catch (error) {
    console.error('Error fetching cafes:', error);
  }
}

async function fetchFeedbacks() {
  isLoadingFeedback.value = true;
  try {
    const response = await fetch('http://127.0.0.1:8000/reviews/');
    if (!response.ok) throw new Error('Failed to fetch feedback');
    const data = await response.json();
    feedbacks.value = data.results || data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    feedbackError.value = 'Unable to load feedback. Please try again later.';
  } finally {
    isLoadingFeedback.value = false;
  }
}

function filterCafe() {
  filteredCafes.value = cafes.value.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}

watch(searchQuery, () => {
  filterCafe();
  fetchCafes();
  scrollToDirectory();
});

onMounted(() => {
  fetchCafes();
  fetchFeedbacks();
});

const goToLogin = () => {
  if (userStore.isLoggedIn) {
    showFeedbackForm.value = true;
    setTimeout(() => {
      const el = document.getElementById("feedback-form");
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    router.push('/login');
  }
};

const submitFeedback = async () => {
  if (!selectedCafe.value) {
    feedbackFormError.value = 'Please select a café';
    return;
  }
  if (!cafeComment.value.trim()) {
    feedbackFormError.value = 'Please enter your feedback';
    return;
  }

  submittingFeedback.value = true;
  feedbackFormError.value = '';

  try {
    const response = await axios.post('http://127.0.0.1:8000/reviews/', {
      cafe: selectedCafe.value,
      rating: cafeRating.value,
      comment: cafeComment.value
    }, {
      headers: { 'Authorization': `Token ${userStore.token}` }
    });
    feedbackSuccess.value = true;
    cafeComment.value = '';
    cafeRating.value = 5;
    selectedCafe.value = null;
    fetchFeedbacks();

    setTimeout(() => {
      showFeedbackForm.value = false;
      feedbackSuccess.value = false;
    }, 3000);

  } catch (error) {
    feedbackFormError.value = error.response?.data?.detail || 'Failed to submit feedback. Please try again.';
  } finally {
    submittingFeedback.value = false;
  }
};

const handleProfileClick = () => {
  if (userStore.token) {
    router.push({ name: 'userProfile' });
  } else {
    showLoginMessage.value = true;
    setTimeout(() => {
      showLoginMessage.value = false;
      router.push({ name: 'login' });
    }, 2000);
  }
};

function scrollToDirectory() {
  const section = document.getElementById("cafe-directory");
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

defineExpose({ handleProfileClick, goToLogin });
</script>

<template>
  <div class="min-h-screen font-serif text-[#5B3926] bg-[#F5EDE0] text-base">
    <!-- Navbar -->
    <nav class="fixed top-0 z-50 w-full bg-[#F8F5F0] shadow-md py-4">
      <div class="flex items-center justify-between px-8 mx-auto max-w-7xl">
        <!-- Logo -->
        <div><img src="/beanthere-logo.png" alt="Bean There Logo" class="w-12 h-auto"></div>

        <!-- Navigation Links -->
        <div class="hidden space-x-6 text-lg md:flex">
          <a href="#" class="text-[#5B3926] hover:text-[#A67C52] font-semibold">Home</a>
          <a href="#cafe-directory" class="text-[#5B3926] hover:text-[#A67C52] font-semibold">Café Directory</a>
          <a href="#feedbacks" class="text-[#5B3926] hover:text-[#A67C52] font-semibold">Feedbacks</a>
          <a href="#about" class="text-[#5B3926] hover:text-[#A67C52] font-semibold">About</a>
        </div>

        <!-- Search Bar & Profile Button -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search cafés..."
              class="px-4 py-2 text-sm border rounded-full w-36 md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5B3926]" />
          </div>

          <div class="relative">
            <button @click="handleProfileClick"
              class="px-4 py-1 bg-[#5B3926] text-white rounded-full hover:bg-[#A67C52] transition duration-300">
              Profile
            </button>
            
            <!-- Login Message Alert -->
            <div v-if="showLoginMessage" 
                class="absolute right-0 mt-2 px-4 py-2 text-sm text-white bg-[#A67C52] rounded-md shadow-lg z-50 whitespace-nowrap">
              Sign Up first... Redirecting to login page
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Home Section -->
    <header class="relative flex items-center justify-start h-[1000px] bg-cover bg-center text-white px-10"
      :style="`background-image: url(${homeCoffee})`">
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="relative z-10 max-w-xl">
        <p class="text-xl">Welcome to</p>
        <h1 class="text-6xl font-extrabold tracking-wide">BEAN THERE<span class="text-[#E3B897]">.</span></h1>
      </div>
    </header>

    <!-- Café Directory -->
    <section id="cafe-directory" class="py-32 bg-[#f8f5f0]">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="mb-20 text-4xl font-bold text-[#5B3926]">Café Directory</h2>

        <!-- Display filtered cafes -->
        <div v-if="filteredCafes.length > 0 && searchQuery !== ''"
          class="grid items-center grid-cols-1 gap-6 md:grid-cols-4">
          <div v-for="cafe in filteredCafes" :key="cafe.name"
            class="flex flex-col items-center transition duration-300 transform hover:scale-105">
            <img :src="cafe.image" :alt="cafe.name" class="object-cover rounded-lg shadow-lg w-60 h-60">
            <button @click="router.push(cafe.route)"
              class="mt-4 px-6 py-2 text-white bg-[#5B3926] rounded-full hover:bg-[#A67C52] text-lg shadow-md transition duration-300">Visit
              Now</button>
          </div>
        </div>

        <!-- Display 'No cafes found' message when no cafes match the search query -->
        <div v-else-if="searchQuery !== '' && filteredCafes.length === 0">
          <p class="text-lg font-semibold text-[#5B3926]">No cafes found for "{{ searchQuery }}".</p>
        </div>

        <!-- Default list of cafes when no search query is entered or no results -->
        <div v-else class="grid items-center grid-cols-1 gap-6 md:grid-cols-4">
          <div class="flex flex-col items-center transition duration-300 transform hover:scale-105">
            <img :src="tinatangi" alt="Tinatangi Cafe" class="object-cover rounded-lg shadow-lg w-60 h-60">
            <button @click="router.push('/tinatangi')"
              class="mt-4 px-6 py-2 text-white bg-[#5B3926] rounded-full hover:bg-[#A67C52] text-lg shadow-md transition duration-300">Visit
              Now</button>
          </div>
          <div class="flex flex-col items-center transition duration-300 transform hover:scale-105">
            <img :src="somedays" alt="Someday Brews" class="object-cover rounded-lg shadow-lg w-60 h-60">
            <button @click="router.push('/someday-brews')"
              class="mt-4 px-6 py-2 text-white bg-[#003366] rounded-full hover:bg-[#002244] text-lg shadow-md transition duration-300">Visit
              Now</button>
          </div>
          <div class="flex flex-col items-center transition duration-300 transform hover:scale-105">
            <img :src="hbsb" alt="He Brews She Bakes" class="object-cover rounded-lg shadow-xl w-60 h-60">
            <button @click="router.push('/he-brews-she-bakes')"
              class="mt-4 px-6 py-2 text-[#5B3926] bg-[#F8F5F0] border border-[#5B3926] rounded-full hover:bg-[#E3D5C5] text-lg shadow-md transition duration-300">Visit
              Now</button>
          </div>
          <div class="flex flex-col items-center transition duration-300 transform hover:scale-105">
            <img :src="bfc" alt="But First Coffee" class="object-cover rounded-lg shadow-lg w-60 h-60">
            <button @click="router.push('/but-first-coffee')"
              class="px-6 py-2 mt-4 text-lg text-white transition duration-300 bg-black rounded-full shadow-md hover:bg-gray-800">Visit
              Now</button>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-[#5B3926] text-white">
      <div class="flex flex-col items-center max-w-6xl mx-auto md:flex-row">
        <div class="md:w-1/2">
          <h2 class="mb-12 text-4xl font-bold">About Us</h2>
          <p class="text-lg font-medium">Bean There is all about celebrating the vibrant café culture in Dasmariñas,
            Cavite, making it easier for people to discover and support local coffee spots. We believe every café has a
            story to tell, from the cozy corners perfect for deep conversations to the carefully crafted brews that keep
            us coming back. By shining a light on these hidden gems, we’re not just promoting great coffee—we’re
            building connections, supporting small businesses, and creating a space where everyone can experience the
            magic of a good café.</p>
        </div>
        <div class="mt-6 md-6 md:mt-0 animate-float">
          <img :src="aboutCoffee" alt="About Coffee">
        </div>
      </div>
    </section>

   <!-- Feedback Section -->
  <section id="feedbacks" class="py-32 px-8 bg-[#F8F5F0]">
    <div class="max-w-6xl mx-auto">
      <h2 class="mb-10 text-4xl font-bold text-center text-[#5B3926]">Feedbacks</h2>

    <!-- Loading state -->
    <div v-if="isLoadingFeedback" class="text-center">
      <p class="text-[#5B3926]">Loading feedbacks...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="feedbackError" class="text-center">
      <p class="text-red-600">{{ feedbackError }}</p>
    </div>
    
    <!-- No feedback state -->
    <div v-else-if="feedbacks.length === 0" class="text-center">
      <p class="text-[#5B3926]">No feedback available yet. Be the first to share your experience!</p>
    </div>
    
    <!-- Display feedbacks -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      <div 
        v-for="feedback in feedbacks.slice(0, 4)" 
        :key="feedback.id" 
        class="bg-white text-[#5B3926] p-6 rounded-lg shadow"
      >
        <div class="flex items-center mb-2">
          <div class="mr-2 text-yellow-500">
            <span v-for="i in feedback.rating" :key="i">★</span>
            <span v-for="i in 5 - feedback.rating" :key="i + 5" class="text-gray-300">★</span>
          </div>
          <h3 class="font-semibold">{{ feedback.cafe}}</h3>
        </div>
        <p class="mb-2 text-sm text-gray-500">{{ feedback.user}}</p>
        <p>{{ feedback.comment }}</p>
        <p class="mt-2 text-xs text-right text-gray-500">{{ formatDate(feedback.created_at) }}</p>
      </div>
    </div>
    
    <!-- Button to Write Feedback - show for all users -->
    <div class="flex justify-center mt-10">
      <button @click="goToLogin"
        class="px-10 py-5 bg-[#E3B897] text-white rounded-full text-lg font-semibold hover:bg-[#C69575] transition duration-300">
        Get Started
      </button>
    </div>

    <!-- Feedback Form (shows only when logged in and button is clicked) -->
    <div v-if="showFeedbackForm" id="feedback-form" class="p-6 mt-12 bg-white rounded-lg shadow-lg">
      <h3 class="mb-6 text-2xl font-bold text-center">Share Your Experience</h3>
      
      <div v-if="feedbackSuccess" class="p-3 mb-4 text-green-700 bg-green-100 rounded">
        Thank you for your feedback! Your review has been submitted successfully.
      </div>
      
      <div v-if="feedbackFormError" class="p-3 mb-4 text-red-700 bg-red-100 rounded">
        {{ feedbackFormError }}
      </div>
      
      <form @submit.prevent="submitFeedback" class="space-y-4">
        <div>
          <label class="block mb-2 text-sm font-medium">Select Café</label>
          <select v-model="selectedCafe" class="w-full p-2 border rounded focus:ring focus:ring-[#A67C52]">
            <option :value="null">-- Select a café --</option>
            <option v-for="cafe in cafes" :key="cafe.id" :value="cafe.id">{{ cafe.name }}</option>
          </select>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium">Rating</label>
          <div class="flex items-center">
            <template v-for="i in 5" :key="i">
              <span 
                @click="cafeRating = i" 
                class="text-2xl cursor-pointer"
                :class="i <= cafeRating ? 'text-yellow-500' : 'text-gray-300'"
              >★</span>
            </template>
          </div>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium">Your Feedback</label>
          <textarea 
            v-model="cafeComment" 
            rows="4" 
            class="w-full p-2 border rounded focus:ring focus:ring-[#A67C52]"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        
        <div>
          <button 
            type="submit" 
            class="w-full px-6 py-3 bg-[#5B3926] text-white rounded hover:bg-[#A67C52] disabled:bg-gray-400"
            :disabled="submittingFeedback"
          >
            {{ submittingFeedback ? 'Submitting...' : 'Submit Feedback' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</section>


    <!-- Footer -->
    <footer class="bg-[#5B3926] text-white py-10 mt-0 text-center">
      <p>© 2025 Bean There. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-30px);
  }

  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>

