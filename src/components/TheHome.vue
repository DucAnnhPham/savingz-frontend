<script lang="ts">
import {computed, defineComponent} from 'vue'
export default defineComponent({
  name: "TheHome",
  setup() {
    const isLoggedIn = computed(() => !!window.localStorage.getItem('userId'));

    return {
      isLoggedIn
    }
  }
});
</script>

<template>
    <h1>Welcome to the Home Page</h1>
    <p> Savingz is your personal expense tracker.</p>
    <p> It will help you to track your expenses and income. </p>

    <p v-if="!isLoggedIn">To start login.</p>
    <p v-else>To start go to Transactions.</p>
</template>

<style scoped>
h1 {
    font-size: 50px;
    color: #72661b;
}
p {
    font-size: 20px;
    color: #72661b;
}

</style>