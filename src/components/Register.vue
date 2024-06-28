<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios, {type AxiosError} from "axios";

type User = {
  username: string,
  email: string,
  password: string
  id: number
}
const router = useRouter();
const usernameField = ref('');
const emailField = ref('');
const passwordField = ref('');
const repeatPasswordField = ref('');
const errorMessage = ref('');

const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

const register = async () => {

  if (passwordField.value !== repeatPasswordField.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    const response = await axios.post(`${url}/auth/register`, {
      username: usernameField.value,
      password: passwordField.value,
      email: emailField.value
    });
    if (response.status === 200) {
      router.push('/login'); // Redirect to home page
    }
  } catch (error: any) {
    const axiosError = error as AxiosError;
    errorMessage.value = <string>axiosError.response?.data || 'An error occurred';
  }
};
</script>

<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">E-Mail:</label>
        <input type="text" id="email" v-model="emailField" required>
      </div>
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="usernameField" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="passwordField" required>
      </div>
      <div>
        <label for="repeatPassword">Repeat Password:</label>
        <input type="password" id="repeatPassword" v-model="repeatPasswordField" required>
      </div>
      <button @click="router.push('/register')">Register</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
  <div>

  </div>
</template>

<style scoped>

div{
  margin-top: 10px;
}

h1,p {
  color: black;
}
label {
  display: block;
  font-size: 15px;
  color: black;
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
  background-color: #4CAF50;
  color: white;


}

</style>