<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TransactionsList from "@/components/icons/TransactionsList.vue";
</script>

<template>
  <header>
    <img alt="savings_pic" class="logo" src="@/assets/coins-pic.png" width="125" height="125" />
    <h1 class="black">{{ "Savingz" }}</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <router-link to="/transactions">Transactions</router-link>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -50px;
  color: #72661b;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: left;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

nav a.router-link-exact-active {
  color: darkgoldenrod;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  left: -125px;
  color: black;
  position: relative;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
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

<style>
body {
  background-color: lightgrey;
}
</style>
