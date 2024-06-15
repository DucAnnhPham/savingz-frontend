<script setup lang="ts">
import { ref} from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

const login = async () => {
  try {
    const response = await axios.post(`${url}/auth/login`, {
      username: username.value,
      password: password.value
    });

    if (response.status === 200) {
      localStorage.setItem('token', response.data.token); // Save token to local storage
      router.push('/').then(() => window.location.reload()); // Redirect to home page
    }
  } catch (error) {
    errorMessage.value = 'Invalid username or password';
  }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username"  v-model="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
  <div>
    <h3>Don't have an account?</h3>
    <button @click="router.push('/register')">Register</button>
  </div>
</template>

<style scoped>

div{
  margin-top: 10px;
}
label {
  display: block;
  font-size: 15px;
}
input{
  width: 500px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 15px;
}
button {
  padding: 0.5rem;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

</style>