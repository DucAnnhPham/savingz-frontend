<script setup lang="ts">
import {onMounted, onUnmounted, type Ref, ref} from 'vue';
import router from "@/router";
import { computed } from "vue";
import { RouterLink } from "vue-router";

let timeoutId: Ref<number | null> = ref(null);

const logout = () => {
  localStorage.removeItem('userId'); // Remove token from local storage
  router.push('/login').then(() => window.location.reload()); // Redirect to login page and then refresh
};

const logoutInactivity = () => {
  localStorage.removeItem('userId');// Remove token from local storage
  window.alert('You have been logged out due to inactivity.');
  router.push('/login').then(() => window.location.reload()); // Redirect to login page and then refresh
};

const setLogoutTimer = () => {
  if (isLoggedIn.value) { // Check if user is logged in
    timeoutId.value = setTimeout(logoutInactivity, 10 * 60 * 1000) as unknown as number; // Set timer to 10 minutes
  }
};

const resetLogoutTimer = () => {
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value); // Clear the existing timer
  }
  setLogoutTimer(); // Reset the timer
};

onMounted(() => {
  // Set the initial timer
  setLogoutTimer();

  // Reset the timer on any of these events
  window.addEventListener('mousemove', resetLogoutTimer);
  window.addEventListener('keypress', resetLogoutTimer);
  window.addEventListener('scroll', resetLogoutTimer);
});

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted
  window.removeEventListener('mousemove', resetLogoutTimer);
  window.removeEventListener('keypress', resetLogoutTimer);
  window.removeEventListener('scroll', resetLogoutTimer);
});

const isLoggedIn = computed(() => !!window.localStorage.getItem('userId'));
</script>

<template>

  <header>
    <div class="wrapper">
      <nav>
        <img alt="savings_pic" src="@/assets/coins-pic-horizontal.png" width="250" height="50" />
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/transactions">Transactions</RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
      </nav>
      <button v-if="isLoggedIn" @click="logout">LogOut</button>
    </div>
  </header>

</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 30px;
  width: 100%;
  z-index: 1;
  background-color: #c4e5ed;
}


h1 {
  font-weight: 500;
  font-size: 2.6rem;
  color: #000709;
}

nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

button{
  font-size: 15px;
  margin-top: -50px;
  margin-left: 1400px;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #d84a4a;
  color: white;

}

nav a.router-link-active {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
}


nav a {
  display: inline-block;
  padding: 0 1rem;
  color: black;
  position: relative;
  font-size: 15px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }


  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

</style>