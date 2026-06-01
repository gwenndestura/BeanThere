import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import TinatangiCafe from './views/Tinatangi.vue';
import SomedayBrews from './views/Somedays.vue';
import HeBrewsSheBakes from './views/HBSB.vue';
import ButFirstCoffee from './views/BFC.vue';
import UserProfile from './views/UserProfile.vue';
import SignUp from './views/SignUp.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/tinatangi', name: 'tinatangi', component: TinatangiCafe },
  { path: '/someday-brews', name: 'somedayBrews', component: SomedayBrews },
  { path: '/he-brews-she-bakes', name: 'heBrewsSheBakes', component: HeBrewsSheBakes },
  { path: '/but-first-coffee', name: 'butFirstCoffee', component: ButFirstCoffee },
  { path: '/profile', name: 'userProfile', component: UserProfile },
  { path: '/signup', name: 'SignUp', component: SignUp }   
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;





