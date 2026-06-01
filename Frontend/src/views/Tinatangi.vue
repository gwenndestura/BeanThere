<script setup>
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const images = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
  "/img4.jpg",
  "/img5.jpg",
  "/img6.jpg",
  "/img7.jpg",
  "/img8.jpg",
  "/img9.jpg",
];

// Scroll to header on mount
onMounted(() => {
  const header = document.querySelector('header');
  if (header) {
    header.scrollIntoView({ behavior: 'smooth' });
  }
  fetchReviews();
  checkFavoriteStatus();
});


const props = defineProps({
  cafe: {
    type: Object,
    required: false,
    default: () => ({ id: null })  
  }
});

// Heart (favorite) logic
const isHeartClicked = ref(false);

// Utility: safely extract favorites
const checkFavoriteStatus = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/favorite/user/', {
      headers: {
        Authorization: `Token ${userStore.token}`,
      },
    });

    const favorites = Array.isArray(response.data) ? response.data : [];

    isHeartClicked.value = favorites.some(fav => {
      const cafe = fav.cafe || fav;  // fallback if structure is just the cafe
      return cafe.id === CAFE_ID;
    });

  } catch (error) {
    console.error('Error checking favorite status:', error);
  }
};

const toggleHeart = async () => {
  try {
    await axios.post(`http://127.0.0.1:8000/favorite/toggle/${CAFE_ID}/`, {}, {
      headers: {
        Authorization: `Token ${userStore.token}`,
      },
    });

    isHeartClicked.value = !isHeartClicked.value;

    // ✅ Dispatch event so Favorites.vue refreshes
    const event = new Event('favoriteChanged');
    window.dispatchEvent(event);

  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('Please log in to add this cafe to your favorites');
  }
};


// Review form state
const rating = ref(0);
const feedbackText = ref('');
const isSubmitting = ref(false);
const feedbackError = ref('');
const feedbackSuccess = ref('');
const reviews = ref([]);

// Set selected rating
const setRating = (star) => {
  rating.value = star;
};

// Submit review
const submitFeedback = async () => {
  if (rating.value === 0) {
    feedbackError.value = 'Please select a rating';
    return;
  }
  if (!feedbackText.value.trim()) {
    feedbackError.value = 'Please enter your feedback';
    return;
  }

  feedbackError.value = '';
  isSubmitting.value = true;

  try {
    const reviewData = {
      cafe: CAFE_ID,           // Must be integer ID
      rating: rating.value,    // integer 1 to 5
      comment: feedbackText.value,
    };

    const response = await axios.post('http://127.0.0.1:8000/reviews/', reviewData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userStore.token}`,  // Auth token
      },
    });

    feedbackSuccess.value = 'Thank you for your feedback!';
    rating.value = 0;
    feedbackText.value = '';
    fetchReviews();

  } catch (error) {
    console.error('Error submitting review:', error);
    if (error.response && error.response.data) {
      console.error('Backend validation error:', error.response.data);
      // Show detailed backend error message if available
      feedbackError.value = Object.values(error.response.data).flat().join(' ');
    } else {
      feedbackError.value = 'Failed to submit feedback. Please try again later.';
    }
  } finally {
    isSubmitting.value = false;
  }
};


// Fetch reviews by cafe
const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/reviews/?cafe=${CAFE_ID}`);
    reviews.value = response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

// Cafe offerings
const offerings = [
  '☕ Dine-in',
  '🌿 Outdoor Seating',
  '🥡 Takeout',
  '🎉 Reservation / Events',
  '💻 Co-Working Space',
  '🐾 Pet-Friendly',
  '🛵 Delivery (Food Panda)',
  '🚗 Parking'
];
</script>


<template>
  <div class="min-h-screen font-serif text-[#5B3926] bg-[#ffffff] text-base">

  <!-- Heart Button - Bottom Left -->

  <button 
    class="fixed z-20 flex items-center justify-center w-20 h-20 text-2xl text-black transition duration-300 ease-in-out border-2 border-white rounded-full shadow-lg bottom-8 left-8"
    :class="{ 'bg-red-500 text-white': isHeartClicked, 'bg-white text-black': !isHeartClicked }"
    @click="toggleHeart"> 
    ❤︎
  </button>

    <!--Navbar -->
        <nav class="fixed top-0 z-50 w-full bg-[#F8F5F0] shadow-md py-4">
        <div class="flex items-center justify-between px-8 mx-auto max-w-7xl">
    
    <!-- Logo -->
        <div><img src="/beanthere-logo.png" alt="Bean There Logo" class="w-12 h-auto"></div>

    <!-- Navigation -->
        <div class="hidden space-x-6 text-lg md:flex">
          <a href="#" @click.prevent="router.push('/home')" class="text-[#5B3926] hover:text-[#A67C52] font-semibold transition duration-300">Home</a>
          <a href="#feedback" class="text-[#5B3926] hover:text-[#A67C52] font-semibold transition duration-300">Feedback</a>
          <a href="#menu" class="text-[#5B3926] hover:text-[#A67C52] font-semibold transition duration-300">Menu</a>
          <a href="#about" class="text-[#5B3926] hover:text-[#A67C52] font-semibold transition duration-300">About</a>
        </div>

    
        </div>
        </nav>

    <!-- Header -->
        <header 
          class="relative flex items-center justify-center h-screen font-bold text-white bg-center bg-cover text-7xl"
          style="background-image: url('/tinatangibg.jpg'); background-size: cover; background-position: center;">

  
    <!-- Dark overlay for better text visibility -->
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>

    <!-- Semi-transparent black overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Text container -->
        <div class="relative z-10 text-center">
          <h1 class="mb-2 text-4lx">Tinatangi Café</h1>
            <p class="text-xl italic text-gray-200">"Crafted with care, poured with passion"</p>
        </div>

    <!-- Location and Opening Hours -->
        </header>
          <section class="flex justify-center items-center text-center py-10 bg-[#5B3926] text-white w-full">
        <div class="flex items-center justify-between w-3/4 gap-16"> 

    <!-- Location -->
        <div class="w-1/3 px-8 text-center"> 
          <h3 class="text-2xl font-semibold">Location</h3>
            <p class="text-lg">1524 Abel Santos Avenue, Brgy. Sabang, Dasmariñas, Cavite</p>
        </div>

    <!-- Vertical Line -->
        <div class="h-40 w-[4px] bg-white"></div> 

    <!-- Opening Hours -->
        <div class="w-1/3 px-8 text-center"> 
          <h3 class="text-2xl font-semibold">Opening Hours</h3>
            <p class="text-lg">Monday - Sunday: 7AM - 12MN</p>
          </div>
        </div>
        </section>

    <!-- About -->
        <section id="about" class="py-12 bg-[#5B3926] text-[#ffffff] text-center"></section>
        <div class="flex justify-center items-center bg-[#5B3926] h-[550px] px-">
        <div class="flex flex-col items-center w-full max-w-5xl space-x-12 md:flex-row">
    
    <!-- Image -->
        <div class="flex justify-center md:w-1/3">
          <img src="/logstin.png" alt="Tinatangi Café Logo" class="h-auto w-120 rounded-full bg-[#5B3926] shadow-[0_0_30px_10px_white]" />
        </div>

    <!-- Text Content -->
        <div class="flex items-center justify-end md:w-2/3 md:ml-16">
          <div class="text-center md:text-left">
            <h2 class="mb-8 text-5xl font-extrabold text-white">
            ABOUT TINATANGI CAFE </h2>
          <p class="mt-8 text-lg leading-relaxed text-white">
          Bean Scene is a coffee shop that provides you with quality coffee that helps boost your productivity and helps build your mood.
          Having a cup of coffee is good, but having a cup of real coffee is greater. There is no doubt that you will enjoy this coffee more than others you have ever tasted.
          </p>
        </div>
      </div>
      </div>
      </div>

    <!-- Café Offerings -->
      <section class="py-12 bg-[#5B3926] text-[#ffffff] text-center">
        <h2 class="mb-6 text-4xl font-bold">Café Offerings</h2>
      <div class="relative max-w-5xl mx-auto overflow-hidden">
        <div class="flex animate-scroll-right">
          <div
            v-for="(offering, index) in [...offerings, ...offerings]"
            :key="index"
            class="flex-shrink-0 w-64 mx-4"
          >
            <div class="bg-[#ffffff] text-[#5B3926] p-3 rounded-lg shadow-lg font-semibold flex items-center justify-center h-20 text-sm">
              {{ offering }}
            </div>
          </div>
        </div>
      </div>
      </section>


    <!-- Gallery -->
      <section class="py-10 bg-[#5B3926] text-[#ffffff] text-center">
        <h2 class="mb-0 text-4xl font-bold">Gallery</h2>
      <div class="flex justify-center items-center h-[800px] bg-[#5B3926]-900">
      <Swiper
        :modules="[EffectCoverflow, Pagination]"
        effect="coverflow"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView="'auto'"
        :coverflowEffect="{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }"
        :pagination="{ clickable: true }"
        class="w-full max-w-7xl"
      >
        <SwiperSlide v-for="(image, index) in images" :key="index" class="flex justify-center">
          <img :src="image" class="w-full h-[600px] object-cover rounded-lg shadow-xl" />
        </SwiperSlide>
      </Swiper>
        </div>
      </section>


    <!--MENU-->

      <!--Coffee Based-->
        <section id="menu" class="py-2 bg-[#5B3926] text-white">
          <h1 class="mb-10 text-5xl font-bold text-center">OUR MENU</h1>
          <hr class="w-20 mx-auto mb-8 border-t-4 border-white">
                <h2 class="mb-10 text-4xl font-bold text-center">Coffee Based</h2>
                <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <!--White Mocha-->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">WHITE MOCHA</p>
            <p>Expresso Shot, White Chocolate, Milk</p>
          </div>
            <p class="text-lg font-semibold">150</p>
          </div>
        <!--Dark Mocha-->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">DARK MOCHA</p>
            <p>Expresson Shot, Dark Chocolate, Milk</p>
          </div>
            <p class="text-lg font-semibold">150</p>
          </div>
        <!--Americano-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">AMERICANO</p>
            <p>Expresso Shot, Water</p>
          </div>
            <p class="text-lg font-semibold">99</p>
          </div>
        <!--Cappuccino-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">CAPPUCCINO</p>
            <p>Expresso, steamed milk, milk form</p>
          </div>
            <p class="text-lg font-semibold">130</p>
          </div>
        </div>
        </div>
      </section>

      <!--Non Coffee Based-->
        <section class="py-12 bg-[#5B3926] text-white">
          <h2 class="mb-6 text-4xl font-bold text-center">Non-Coffee Based</h2>
          <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 gap-x-16 gap-y-8">
          <div class="flex justify-between">
        <!--Matcha-->  
          <div>
            <p class="text-lg font-bold">MATCHA</p>
            <p>Matcha, Milk</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
        <!--Strawberry-->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">STRAWBERRY</p>
            <p>Strawberry, Milk</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
        <!--Blueberry-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">BLUEBERRY</p>
            <p>Blueberry, milk</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
        <!--Caramel Vanilla-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">CARAMEL VANILLA</p>
            <p>Caramel Vanilla, Milk</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
          </div>
          </div>
        </section>


      <!--Bread & Tinatangi Loaf-->
        <section class="py-12 bg-[#5B3926] text-white">
          <h2 class="mb-6 text-4xl font-bold text-center">Bread & Tinatangi Loaf</h2>
          <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 gap-x-16 gap-y-8">
          <div class="flex justify-between">
        <!--Muni-Muni Loaf-->
          <div>
            <p class="text-lg font-bold">MUNI-MUNI LOAF</p>
            <p>Plain Loaf</p>
          </div>
            <p class="text-lg font-semibold">140</p>
          </div>
        <!--Padayon Loaf-->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">PADAYON LOAF</p>
            <p>Chocolate Loaf</p>
          </div>
          <p class="text-lg font-semibold">160</p>
          </div>
        <!--Puhon Loaf-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">PUHON LOAF</p>
            <p>Cheese Loaf</p>
          </div>
            <p class="text-lg font-semibold">175</p>
          </div>
        <!--Matahom Loaf-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">MATAHOM LOAF</p>
            <p>Ube Loaf</p>
          </div>
            <p class="text-lg font-semibold">175</p>
          </div>
          </div>
          </div>
        </section>


      <!--Cakes & Pastries-->
        <section class="py-12 bg-[#5B3926] text-white">
          <h2 class="mb-6 text-4xl font-bold text-center">Cakes & Pastries</h2>
        <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <div class="flex justify-between">
        <!--Red Velvet Cake-->
          <div>
            <p class="text-lg font-bold">RED VELVET CAKE</p>
          </div>
            <p class="text-lg font-semibold">155</p>
          </div>
        <!--Strawberry Cheesecake-->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">STRAWBERRY CHEESECAKE</p>
          </div>
            <p class="text-lg font-semibold">165</p>
          </div>
        <!--Blueberry Cheesecake-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">BLUEBERRY CHEESECAKE</p>
          </div>
            <p class="text-lg font-semibold">165</p>
          </div>
        <!--Matcha Cheesecake-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">MATCHA CHEESECAKE</p>
          </div>
            <p class="text-lg font-semibold">170</p>
          </div>
        <!--Oreo Cheesecake-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">OREO CHEESECAKE</p>
          </div>
          <p class="text-lg font-semibold">170</p>
          </div>
        <!--Triple Chocolate Cake-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">TRIPLE CHOCOLATE CAKE</p>
          </div>
            <p class="text-lg font-semibold">210</p>
          </div>
          </div>
          </div>
        </section>

        <!-- Rice Meals -->
          <section class="py-12 bg-[#5B3926] text-white">
            <h2 class="mb-6 text-4xl font-bold text-center">Breakfast Rice Meal</h2>
            <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <!-- Liempo Tocino -->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">LIEMPO TOCINO</p>
            <p class="text-sm text-white-600">Homemade Liempo Tocino with a side of egg served with sinangag rice.</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
        <!-- Daing na Bangus -->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">DAING NA BANGUS</p>
            <p class="text-sm text-white-600">Homemade Daing na Bangus with sinangag rice and egg.</p>
          </div>
            <p class="text-lg font-semibold">205</p>
          </div>
        <!-- Sisig-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">SIZZLING PORK SISIG</p>
            <p class="text-sm text-white-600">Pork, red and white onion, green chill, egg, mixed with our homemade mayo mix served in a sizzing plate with rice.</p>
          </div>
            <p class="text-lg font-semibold">199</p>
          </div>
        <!-- Beef Tapa-->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">BEEF TAPA</p>
            <p class="text-sm text-white-600">Special Beef Tapa with sinangag rice and egg.</p>
          </div>
            <p class="text-lg font-semibold">210</p>
          </div>
          </div>
          </div>
          </section>

      <!-- Pasta Section -->
        <section class="py-12 bg-[#5B3926] text-white">
          <h2 class="mb-6 text-4xl font-bold text-center">Pasta</h2>
        <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <!-- Bolognese -->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">BOLOGNESE</p>
            <p class="text-sm text-white-600">Spaghetti pasta topped with our homemade Bolognese sauce topped with grated parmesan along with toasted bread</p>
          </div>
            <p class="text-lg font-semibold">225</p>
          </div>
        <!-- Charlie Chan -->
          <div class="flex justify-between">
          <div>
            <p class="text-lg font-bold">CHARLIE CHAN</p>
            <p class="text-sm text-white-600">Spaghetti pasta tossed with our homemade oriental sauce, Shitake mushrooms, and peanut topped with spring onions</p>
          </div>
            <p class="text-lg font-semibold">250</p>
          </div>
        <!-- Spanish Sardines -->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">SPANISH SARDINES</p>
            <p class="text-sm text-white-600">Spaghetti pasta tossed with seasoned olive oil, Spanish sardines, and fresh basil with toasted bread</p>
          </div>
            <p class="text-lg font-semibold">235</p>
          </div>
        <!-- Creamy Pesto -->
          <div class="flex justify-between pt-4 border-t">
            <div>
              <p class="text-lg font-bold">CREAMY PESTO</p>
              <p class="text-sm text-white-600">Linguini pasta tossed with our homemade pesto sauce and grilled chicken topped with crushed cashew, parmesan along with toasted bread</p>
            </div>
              <p class="text-lg font-semibold">265</p>
            </div>
        <!-- Chicken Alfredo -->
          <div class="flex justify-between pt-4 border-t">
          <div>
            <p class="text-lg font-bold">CHICKEN ALFREDO</p>
            <p class="text-sm text-white-600">Linguini pasta tossed with our homemade alfredo sauce and grilled chicken topped with grated parmesan along with toasted bread</p>
          </div>
            <p class="text-lg font-semibold">245</p>
          </div>
          </div>
          </div>
      </section>

       <!-- Feedback Section -->
      <section id="feedback" class="py-12 bg-[#5B3926] text-[#fff] text-center">
        <h2 class="mb-6 text-4xl font-bold">We Value Your Feedback</h2>
        <p class="mb-4 text-lg">How was your experience with us?</p>
    
      <div class="flex justify-center mb-6">
        <button 
          v-for="star in 5" 
          :key="star" 
          @click="setRating(star)" 
          class="text-3xl text-white transition duration-300 hover:text-yellow-500"
          :class="{ 'text-yellow-500': rating >= star }">
          ★
        </button>
      </div>
    
      <form class="max-w-3xl mx-auto" @submit.prevent="submitFeedback">
        <!-- Error/Success Messages -->
        <div v-if="feedbackError" class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {{ feedbackError }}
        </div>
        <div v-if="feedbackSuccess" class="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {{ feedbackSuccess }}
        </div>
      
        <!-- Feedback text area -->
        <textarea 
          v-model="feedbackText"
          class="w-full p-4 mb-4 border-2 border-[#5B3926] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] text-[#5B3926]" 
          rows="5" 
          placeholder="Write your feedback here..."
          required>
        </textarea>
      
         <!-- Submit button -->
        <button 
          type="submit" 
          class="px-6 py-3 text-lg font-semibold text-[#5B3926] bg-[#ffffff] rounded-lg hover:bg-[#A67C52] transition duration-300"
          :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
        </button>
      </form>
    </section>
  
      <!-- Footer -->
        <footer class="text-sm text-[#5B3926] py-2 border-t-4 border-[#5B3926]">
          <div class="flex flex-col items-center justify-between px-6 mx-auto max-w-7xl md:flex-row">
            <!-- Left Side: Logo and Socials -->
            <div class="flex flex-col md:items-start">
              <div class="flex space-x-4">
                <a href="https://www.facebook.com/TinatangiCafe" target="_blank">
                  <img src="/fbb.jpg" alt="Facebook" class="w-10 h-10 rounded-full">
                </a>
                <a href="https://www.instagram.com/tinatangi_cafe/" target="_blank">
                  <img src="/ig.jpg" alt="Instagram" class="w-10 h-10 rounded-full">
                </a>
                <a href="https://www.tiktok.com/@tinatangi.cafe" target="_blank">
                  <img src="/tiktok.jpg" alt="TikTok" class="w-10 h-10 rounded-full">
                </a>
              </div>
            </div>

            <!-- Right Side: Links & Contact Info -->
            <div class="mt-6 text-right md:mt-0">
              <nav class="mb-4">
                <ul class="flex flex-col space-y-2 text-lg md:flex-row md:space-y-0 md:space-x-6">
                  <!-- Add navigation links here if needed -->
                </ul>
              </nav>
              <p class="text-sm mt-4 text-[#5B3926]">
                13 Jose Abad Santos Avenue, Brgy. Salawag, Cavite, Dasmariñas, Philippines, 4114 <br>
                <a href="mailto:tinatangicafe@gmail.com" class="hover:text-[#5B3926]">tinatangicafe@gmail.com</a>
              </p>
              <p class="text-sm mt-4 text-[#5B3926]">&copy; 2024 Tinatangi Cafe. All rights reserved.</p>
            </div>
          </div>
        </footer>

  </div>
</template>

<script>
export default {
  name: "TinatangiCafe",
};
</script>
<style scoped>
/* Ensure Swiper respects Tailwind's styles */
:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes scroll-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-scroll-right {
  display: flex;
  animation: scroll-right 40s linear infinite;
  width: calc(200%); /* Ensures smooth looping */
}
</style>