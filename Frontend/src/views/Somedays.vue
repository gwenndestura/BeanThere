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
const CAFE_ID = 2; // This should be dynamic if possible

const images = [
  "/g1.jpg",
  "/g2.jpg",
  "/g3.jpg",
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

const checkFavoriteStatus = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/favorite/user/', {
      headers: {
        Authorization: `Token ${userStore.token}`,
      },
    });
      
    isHeartClicked.value = response.data.some(fav => fav.cafe.id === CAFE_ID);
  

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
    <div class="min-h-screen font-serif text-[#003366] bg-[#ffffff] text-base">
    <!-- Heart Button -->
    <button 
      class="fixed z-20 flex items-center justify-center w-20 h-20 text-2xl text-black transition duration-300 ease-in-out border-2 border-white rounded-full shadow-lg bottom-8 left-8"
      :class="{ 'bg-red-500 text-white': isHeartClicked, 'bg-white text-black': !isHeartClicked }"
      @click="toggleHeart"> 
      ❤︎
    </button>

    <!--Navbar -->
        <nav class="fixed top-0 z-50 w-full bg-[#ffffff] shadow-md py-4">
        <div class="flex items-center justify-between px-8 mx-auto max-w-7xl">
    
    <!-- Logo -->
        <div><img src="/beanthere-logo.png" alt="Bean There Logo" class="w-12 h-auto"></div>

    <!-- Navigation -->
        <div class="hidden space-x-6 text-lg md:flex">
          <a href= "#" @click.prevent="router.push('/home')" class="text-[#003366] hover:text-[#9accff] font-semibold transition duration-300">Home</a>
          <a href="#feedback" class="text-[#003366] hover:text-[#9accff] font-semibold transition duration-300">Feedback</a>
          <a href="#menu" class="text-[#003366] hover:text-[#9accff] font-semibold transition duration-300">Menu</a>
          <a href="#about" class="text-[#003366] hover:text-[#9accff] font-semibold transition duration-300">About</a>
        </div>
      </div>

        </nav>

    <!-- Header -->
        <header 
          class="relative flex items-center justify-center h-screen font-bold text-white bg-center bg-cover text-7xl"
          style="background-image: url('/sbr2.jpg'); background-size: cover; background-position: center;">
  
    <!-- Dark overlay for better text visibility -->
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>

    <!-- Semi-transparent black overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Text container -->
        <div class="relative z-10 text-center">
          <h1 class="mb-4 text-4lx">Someday Brews</h1>
            <p class="text-xl italic text-gray-200">"Brewing Comfort, Connection, and Calm—One Cup at a Time."</p>
        </div>

    <!-- Location and Opening Hours -->
        </header>
          <section class="flex justify-center items-center text-center py-10 bg-[#003366] text-white w-full">
        <div class="flex items-center justify-between w-3/4 gap-16"> 

    <!-- Location -->
        <div class="w-1/3 px-8 text-center"> 
          <h3 class="text-2xl font-semibold">Location</h3>
            <p class="text-lg">Block 13, Lot 7, Cityview II Farm Lot Subdivision, Dasmariñas, Philippines, 4114</p>
        </div>

    <!-- Vertical Line -->
        <div class="h-40 w-[4px] bg-white"></div> 

    <!-- Opening Hours -->
        <div class="w-1/3 px-8 text-center"> 
          <h3 class="text-2xl font-semibold">Opening Hours</h3>
            <p class="text-lg">Monday - Sunday: 8AM - 10PM</p></div>
        </div>
        </section>

    <!-- About -->
        <section id="about" class="py-10 bg-[#003366] text-white"></section>
        <div class="flex justify-center items-center bg-[#003366] h-[550px] px-8">
        <div class="flex flex-col items-center w-full max-w-5xl space-x-12 md:flex-row">
    
    <!-- Image -->
        <div class="flex justify-center md:w-1/3">
          <img src="/Somedays.jpg" alt="Someday Brews" class="w-65 h-65 rounded-full object-cover border-4 border-white shadow-lg drop-shadow-[0_5px_15px_rgba(255,255,255,0.5)]"/>
        </div>

    <!-- Text Content -->
        <div class="text-left md:w-2/3 md:ml-16 md:mr-10">
          <h2 class="py-5 mb-6 text-5xl font-extrabold text-white ">
            ABOUT SOMEDAY BREWS </h2>
          <p class="mt-6 text-lg leading-relaxed text-white">
            Step into our cozy retreat and indulge in moments of warmth and flavor. Your guide to enjoying coffee, co-working, and a pet-friendly space awaits.</p>
          </div>
        </div>
      </div>

    <!-- Café Services -->
    <section class="py-12 bg-[#003366] text-[#ffffff] text-center">
      <h2 class="mb-6 text-4xl font-bold">Café Offerings</h2>
      <div class="relative max-w-5xl mx-auto overflow-hidden">
        <div class="flex animate-scroll-right">
          <div
            v-for="(offering, index) in [...offerings, ...offerings]"
            :key="index"
            class="flex-shrink-0 w-64 mx-14"
          >
            <div class="bg-[#ffffff] text-[#003366] p-3 rounded-lg shadow-lg font-semibold flex items-center justify-center h-20 text-sm">
              {{ offering }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Photo Gallery -->
    <section class="py-10 bg-[#003366] text-[#ffffff] text-center">
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
      class="w-full max-w-6xl"
    >
      <SwiperSlide v-for="(image, index) in images" :key="index" class="flex justify-center">
        <img :src="image" class="w-full h-[600px] object-cover rounded-lg shadow-xl" />
      </SwiperSlide>
      </Swiper>
      </div>
    </section>

<!--MENU-->
    <!--Coffee Based-->
      <section id="menu" class="py-2 bg-[#003366] text-white">
          <h1 class= "mb-10 text-5xl font-bold text-center">OUR MENU</h1>
          <hr class="w-20 mx-auto mb-8 border-t-4 border-white">
          <h2 class="mb-8 text-4xl font-bold text-center">ESPRESSO (HOT/ICED)</h2>
        <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

      <!-- Americano -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">AMERICANO</p>
      </div>
        <p class="text-lg font-semibold">100</p>
      </div>

      <!-- Cappuccino -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">CAPPUCCINO</p>
      </div>
        <p class="text-lg font-semibold">110</p>
      </div>

      <!-- French Vanilla Latte -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">FRENCH VANILLA LATTE</p>
      </div>
        <p class="text-lg font-semibold">130</p>
      </div>

      <!-- Hazelnut Latte -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">HAZELNUT LATTE</p>
      </div>
        <p class="text-lg font-semibold">130</p>
      </div>

      <!-- Mocha -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">MOCHA</p>
      </div>
        <p class="text-lg font-semibold">130</p>
      </div>

      <!-- Cinnamon Latte-->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">CINNAMON LATTE</p>
      </div>
        <p class="text-lg font-semibold">145</p>
      </div>
      </div>
    </div>
  </section>

    <!--Non Coffee Based-->
      <section class="py-12 bg-[#003366] text-white">
        <h2 class="mb-8 text-4xl font-bold text-center">NON-COFFEE BASED</h2>
          <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 gap-x-16 gap-y-8">
      <div class="flex justify-between pb-4 border-b">

      <!-- Hot/Iced Chocolate -->  
        <div>
          <p class="text-lg font-bold">HOT/ICED CHOCOLATE</p>
        </div>
          <p class="text-lg font-semibold">130</p>
        </div>
      
      <!-- Matcha Latte Item -->
      <div class="flex justify-between pb-4 border-b"> <div>
        <p class="text-lg font-bold">MATCHA LATTE</p>
      </div>
        <p class="text-lg font-semibold">135</p> </div>
      </div>
    </div>
  </section>

    <!--Frappuccino-->
      <section class="py-12 bg-[#003366] text-white">
        <h2 class="mb-8 text-4xl font-bold text-center">FRAPPUCCINO</h2>
          <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <div class="flex justify-between pb-4 border-b">

        <!-- Biscoff -->
          <div>
            <p class="text-lg font-bold">BISCOFF</p>
          </div>
            <p class="text-lg font-semibold">165</p>
          </div>

        <!-- Strawberry -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">STRAWBERRY</p>
          </div>
            <p class="text-lg font-semibold">130</p>
          </div>

        <!-- Cookies N Cream -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">COOKIES N CREAM</p>
          </div>
            <p class="text-lg font-semibold">145</p>
          </div>

        <!-- Matcha -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">MATCHA</p>
          </div>
            <p class="text-lg font-semibold">150</p>
          </div>

        <!-- Salted Caramel -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SALTED CARAMEL</p>
          </div>
            <p class="text-lg font-semibold">140</p>
          </div>

        <!-- Java Chip -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">JAVA CHIP</p>
          </div>
            <p class="text-lg font-semibold">160</p>
          </div>
        </div>
      </div>
  </section>

    <!--Refreshers-->
      <section class="py-12 bg-[#003366] text-white">
          <h2 class="mb-8 text-4xl font-bold text-center">REFRESHERS</h2>
        <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 gap-x-16 gap-y-8">
        <div class="flex justify-between">

        <!-- Green Apple Soda -->
          <div>
            <p class="text-lg font-bold">GREEN APPLE SODA</p>
          </div>
            <p class="text-lg font-semibold">80</p>
          </div>

        <!-- Blueberry Soda -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">BLUEBERRY SODA</p>
          </div>
            <p class="text-lg font-semibold">80</p>
          </div>

        <!-- Lemonade -->
          <div class="flex justify-between pt-4 border-t"> <div>
            <p class="text-lg font-bold">LEMONADE</p>
          </div>
            <p class="text-lg font-semibold">100</p>
          </div>
        </div>
      </div>
  </section>

    <!-- Appetizers -->
      <section class="py-12 bg-[#003366] text-white">
          <h2 class="mb-8 text-4xl font-bold text-center">APPETIZERS</h2>
          <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Cheesy Bacon Fries -->
          <div class="flex justify-between pb-4 border-b">
            <div>
            <p class="text-lg font-bold">CHEESY BACON FRIES</p>
          </div>
            <p class="text-lg font-semibold">140</p>
          </div>

        <!-- Beef Nachos -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">BEEF NACHOS</p>
          </div>
            <p class="text-lg font-semibold">150</p>
          </div>

        <!-- Potato Wedges -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">POTATO WEDGES</p>
          </div>
            <p class="text-lg font-semibold">190</p>
          </div>

        <!-- Mozzarella Sticks -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">MOZZARELLA STICKS</p>
          </div>
            <p class="text-lg font-semibold">190</p>
          </div>
        
        <!-- Chicken Tenders -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN TENDERS</p>
          </div>
            <p class="text-lg font-semibold">210</p>
          </div>

        <!-- Fish & Chips -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">FISH & CHIPS</p>
          </div>
            <p class="text-lg font-semibold">230</p>
          </div>

        <!-- Chicken Wings -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN WINGS</p>
          </div>
            <p class="text-lg font-semibold">250</p>
          </div>
        </div>
      </div>
  </section>

    <!-- Pasta Section -->
      <section class="py-12 bg-[#003366] text-white">
      <h2 class="mb-8 text-4xl font-bold text-center">PASTA & BREAKFAST</h2>
      <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Spaghetti -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SPAGHETTI</p>
          </div>
            <p class="text-lg font-semibold">250</p>
          </div>

        <!-- Carbonara -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CARBONARA</p>
          </div>
            <p class="text-lg font-semibold">260</p>
          </div>

        <!-- Chicken Pesto -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN PESTO</p>
          </div>
            <p class="text-lg font-semibold">270</p>
          </div>

        <!-- Pancakes -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">PANCAKES</p>
          </div>
            <p class="text-lg font-semibold">120</p>
          </div>

        <!-- French Toast -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">FRENCH TOAST</p>
          </div>
            <p class="text-lg font-semibold">150</p>
          </div>

        <!-- Ham & Cheese Omellete -->
          <div class="flex justify-between pb-4 border-b"> <div> 
            <p class="text-lg font-bold">HAM & CHEESE OMELETE</p>
          </div>
            <p class="text-lg font-semibold">220</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SALAD SECTION-->
      <section class="py-12 bg-[#003366] text-white">
        <h2 class="mb-8 text-4xl font-bold text-center">SALAD</h2>
      <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Caesar Salad -->     
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CAESAR SALAD</p>
          </div>
            <p class="text-lg font-semibold">200</p>
          </div>

        <!-- Chicken Caesar Salad -->  
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN CAESAR SALAD</p>
          </div>
            <p class="text-lg font-semibold">240</p>
          </div>

        <!-- Someday Salad -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SOMEDAY SALAD</p>
          </div>
            <p class="text-lg font-semibold">290</p>
          </div>
          </div>
        </div>
    </section>

  <!-- BURGERS & SANDWICHES -->
    <section class="py-12 bg-[#003366] text-white">
      <h2 class="mb-8 text-4xl font-bold text-center">BURGER & SANDWICHES</h2>
      <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Tuna Sandwich -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">TUNA SANDWICH</p>
            <p class="italic text-small">Tuna Dressing, Lettuce, Cheese.</p>
          </div>
            <p class="text-lg font-semibold">190</p>
          </div>

        <!-- Club Sandwich -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">Club Sandwich</p>
            <p class="italic text-small">Mayonnaise Ham, Lettuce, Tomato, Cheese, Egg, Cucumber.</p>
          </div>
            <p class="text-lg font-semibold">230</p>
          </div>

        <!-- Chicken Burger -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN BURGER</p>
            <p class="italic text-small">Chicken Breast, Lemon Pepper Sauce, Lettuce.</p>
          </div>
            <p class="text-lg font-semibold">280</p>
          </div>

        <!-- Someday Burger -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SOMEDAY BURGER</p>
            <p class="italic text-small">100% Beef, Mushroom, Lettuce, Tomato, Homemade Ranch.</p>
          </div>
            <p class="text-lg font-semibold">120</p>
          </div>
        </div>
      </div>
    </section>



    <!-- RICE BOWL -->
    <section class="py-12 bg-[#003366] text-white">
      <h2 class="mb-8 text-4xl font-bold text-center">RICE BOWL</h2>
      <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Beef  -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">BEEF TAPA</p>
          </div>
            <p class="text-lg font-semibold">240</p>
          </div>

        <!-- Bangus -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">BANGUS</p>
          </div>
            <p class="text-lg font-semibold">240</p>
          </div>

        <!-- Pork Longganisa -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">Pork Longganisa</p>
          </div>
            <p class="text-lg font-semibold">240</p>
          </div>

        <!-- Chicken Teriyaki -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">CHICKEN TERIYAKI</p>
          </div>
            <p class="text-lg font-semibold">240</p>
          </div>
        </div>
      </div>
    </section>


    <!-- MAINS -->
    <section class="py-12 bg-[#003366] text-white">
      <h2 class="mb-8 text-4xl font-bold text-center">MAINS</h2>
      <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 gap-x-16 gap-y-8">

        <!-- Fried Chicken -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">FRIED CHICKEN</p>
          </div>
            <p class="text-lg font-semibold">360</p>
          </div>

        <!-- Someday Chicken Inasal -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SOMEDAY CHICKEN INASAL</p>
          </div>
            <p class="text-lg font-semibold">370</p>
          </div>

        <!-- Salisbury Steak -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">SALISBURY STEAK</p>
          </div>
            <p class="text-lg font-semibold">380</p>
          </div>

        <!-- Grilled Porkchop -->
          <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">GRILLED PORKCHOP</p>
          </div>
            <p class="text-lg font-semibold">390</p>
          </div>

        <!-- Grilled Salmon -->
        <div class="flex justify-between pb-4 border-b"> <div>
            <p class="text-lg font-bold">GRILLED SALMON</p>
          </div>
            <p class="text-lg font-semibold">450</p>
          </div>  
        </div>
      </div>
    </section>


     <!-- Feedback Section -->
     <section id="feedback" class="py-16 bg-[#003366] text-[#fff] text-center">
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
          <!-- Error/SUccess Messages -->
          <div v-if="feedbackError" class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {{ feedbackError }}
          </div>
          <div v-if="feedbackSuccess" class="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
            {{ feedbackSuccess }}
          </div>

        <!-- Feedback Textarea -->
        <textarea 
          v-model="feedbackText"
          class="w-full p-4 mb-4 border-2 border-[#003366] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88cfff] text-[#003366]" 
          rows="5" 
          placeholder="Write your feedback here...">
          <required>
        </textarea>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="px-6 py-3 text-lg font-semibold text-[#003366] bg-[#ffffff] rounded-lg hover:bg-[#88cfff] transition duration-300"
          :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
        </button>
      </form>
    </section>


      <!-- Footer -->
      <footer class="text-sm text-[#003366] py-2 border-t-4 border-[#003366]">
          <div class="flex flex-col items-center justify-between px-6 mx-auto max-w-7xl md:flex-row">
            <!-- Left Side: Logo and Socials -->
            <div class="flex flex-col md:items-start">
              <div class="flex space-x-4">
                <a href="https://www.facebook.com/somedaybrews" target="_blank">
                  <img src="/fbb.jpg" alt="Facebook" class="w-10 h-10 rounded-full">
                </a>
                <a href="https://www.instagram.com/somedaybrews?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank">
                  <img src="/ig.jpg" alt="Instagram" class="w-10 h-10 rounded-full">
                </a>
                <a href="https://www.tiktok.com/@somedaybrews" target="_blank">
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
              <p class="text-sm mt-4 text-[#003366]">
                Block 13, Lot 7, Cityview II Farm Lot Subdivision, Dasmariñas, Philippines, 4114 <br>
              </p>
              <p class="text-sm mt-4 text-[#003366]">&copy; 2025 Someday Brews. All rights reserved.</p>
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