import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import UserProfile from "../views/UserProfile.vue";
import SearchResults from "../views/SearchResults.vue";
import SignUp from '..SignUp.vue';
import { User } from "lucide-vue-next";
import SettingsPage from "../views/SettingsPage.vue"; // Import your SettingsPage component



const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: "/search",
    name: "searchResults",
    component: SearchResults,
    props: route => ({ query: route.query.q })

  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
  path: '/settings',
  name: 'settings', // Or a different name if you prefer
  component: SettingsPage // Import your SettingsPage component
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;