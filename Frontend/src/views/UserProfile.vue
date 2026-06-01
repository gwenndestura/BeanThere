<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-[320px] bg-[#3A1C1A] text-white flex flex-col p-10">
      <div>
        <h2 class="mb-12 font-serif text-4xl font-bold">User Profile</h2>
        <ul class="space-y-10">
          <li @click="activeTab = 'info'" :class="tabClass('info')">
            <UserIcon class="w-7 h-7" />
            <span class="font-serif text-xl">User Info</span>
          </li>
          <li @click="activeTab = 'favorites'" :class="tabClass('favorites')">
            <HeartIcon class="w-7 h-7" />
            <span class="font-serif text-xl">Favorites</span>
          </li>
          <li @click="activeTab = 'settings'" :class="tabClass('settings')">
            <SettingsIcon class="w-7 h-7" />
            <span class="font-serif text-xl">Settings</span>
          </li>
        </ul>
      </div>

      <div class="pt-10 mt-auto">
        <ul>
          <li @click="logout" class="flex items-center gap-4 cursor-pointer hover:text-gray-300">
            <LogoutIcon class="w-7 h-7" />
            <span class="font-serif text-xl">Log Out</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-12 overflow-y-auto bg-white">
      <UserInfo v-if="activeTab === 'info'" />
      <Favorites v-if="activeTab === 'favorites'" />
      <Settings v-if="activeTab === 'settings'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserInfo from "@/components/UserInfo.vue";
import Favorites from "@/components/Favorites.vue";
import Settings from "@/components/Settings.vue";
import { useUserStore } from "@/stores/user"; 

// Icons
import { UserIcon, HeartIcon, SettingsIcon, LogOutIcon as LogoutIcon } from "lucide-vue-next";

// Reactive tab
const activeTab = ref("info");

// Router for logout
const router = useRouter();
// Get user store
const userStore = useUserStore();

const logout = async () => {
  console.log('Logging out...')
  await userStore.logout()
  router.push('/login')
}


const tabClass = (tab) => {
  return [
    "flex items-center gap-4 cursor-pointer",
    activeTab.value === tab ? "text-yellow-400" : "hover:text-gray-300"
  ];
};
</script>
