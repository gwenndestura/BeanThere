<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchQuery = ref(route.query.q || '');
const cafes = ref(route.params.cafes || []);

const filteredCafes = computed(() => {
  return cafes.value.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="min-h-screen font-serif text-[#5B3926] bg-[#F5EDE0] text-base">
    <div class="max-w-6xl py-32 mx-auto text-center">
      <h2 class="mb-20 text-4xl font-bold text-[#5B3926]">Search Results for "{{ searchQuery }}"</h2>
      <div class="grid items-center grid-cols-1 gap-6 md:grid-cols-4">
        <div v-for="cafe in filteredCafes" :key="cafe.name" class="flex flex-col items-center transition duration-300 transform hover:scale-105">
          <img :src="cafe.image" :alt="cafe.name" class="object-cover rounded-lg shadow-lg w-60 h-60">
          <button @click="$router.push(cafe.route)" class="mt-4 px-6 py-2 text-white bg-[#5B3926] rounded-full hover:bg-[#A67C52] text-lg shadow-md transition duration-300">Visit Now</button>
        </div>
      </div>
    </div>
  </div>
</template>