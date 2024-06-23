<script setup lang="ts">

import router from "@/router";
import {computed} from "vue";
import {RouterLink} from "vue-router";

const logout = () => {
  localStorage.removeItem('userId'); // Remove token from local storage
  router.push('/login').then(() => window.location.reload()); // Redirect to login page and then refresh
};


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
}


h1 {
  font-weight: 500;
  font-size: 2.6rem;
  color: #72661b;
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