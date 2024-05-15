<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

defineProps<{ title: string }>()

type Transaction = {  transactionID : number
                      transactionName: string,
                      transactionCategory: string,
                      transactionDate: Date
                      formattedDate: string,
                      transactionAmount: number,}

const transactions: Ref<Transaction[]> = ref([])
const nameField = ref("")
const categoryField = ref("")
const amountField = ref("")
const dateField = ref("")
const categories = ['Food', 'Clothing', 'Rent', 'Utilities', 'Entertainment', 'Other']
const errorMessage: Ref<string[]> = ref([])
let currentID = 1


function initTransactionlist(): void {
  addTransaction("Groceries", "Food", new Date("2024-04-19"), Number("56.73"))
  addTransaction("Jacket", "Clothing", new Date("2024-04-18"), Number("76.95"))
}

function addTransaction(transactionName: string, transactionCategory: string, transactionDate: Date, transactionAmount: number): void {
  const formattedDate = formatDate(transactionDate);
  transactions.value.push({transactionName,transactionCategory,transactionDate,formattedDate,transactionAmount, transactionID: currentID++ })
}

function onFormSubmitted(): void {
  errorMessage.value = []
  if (!nameField.value) {
    errorMessage.value.push("Name field must be filled out.");
  }
  if (!categoryField.value) {
    errorMessage.value.push("Category field must be filled out.");
  }
  if (!dateField.value) {
    errorMessage.value.push("Date field must be filled out.");
  }
  if (!amountField.value) {
    errorMessage.value.push("Amount field must be filled out.");
  }
  if(errorMessage.value.length > 0){
    return;
  }
  addTransaction(nameField.value, categoryField.value, new Date(dateField.value),Number(amountField.value))

  nameField.value = "";
  categoryField.value = "";
  dateField.value = "";
  amountField.value = "";


}

function removeTransaction(id: number): void {
  transactions.value = transactions.value.filter((transaction) => transaction.transactionID !== id)
}

function formatDate(date: Date): string{
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Lifecycle Hook
onMounted(() => {
  initTransactionlist()
})

</script>

<template>
  <h2>{{ title }}</h2>
    <form @submit.prevent="onFormSubmitted()">
    <!-- "@submit.prevent" prevents a page refresh after submitting form -->
    <input class="form-input" type="text" placeholder="Name" v-model="nameField" />
    <select class="form-input" v-model="categoryField">
      <option value="" disabled selected>Select a Category</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <input class="form-input" type="date" placeholder="Date" v-model="dateField" />
    <input class="form-input" type="number" placeholder="Amount" v-model="amountField" step="0.01"/>
    <button>Add Transaction</button>
    <p style="color: red" v-for="(error, index) in errorMessage" :key="index">{{ error }}</p>  </form>
  <hr />
  <table>
    <tr>

      <th>Name</th>
      <th>Category</th>
      <th>Date</th>
      <th>Amount</th>
      <th>ID</th>
      <th>Delete</th>
    </tr>
    <tr v-if="!transactions.length">
      <td colspan="2">The are no past Transactions!</td>
    </tr>
    <tr v-for="transaction in transactions" :key="transaction.transactionID">

      <td>{{ transaction.transactionName }}</td>
      <td>{{ transaction.transactionCategory }}</td>
      <td>{{ transaction.formattedDate }}</td>
      <td>{{ (Math.round(transaction.transactionAmount * 100) / 100).toFixed(2) }}</td>
      <td>({{ transaction.transactionID }})</td>
      <td>
      <button @click="removeTransaction(transaction.transactionID)" class="delete">delete</button>
      </td>
    </tr>

  </table>

</template>

<style scoped>

h2 {
  font-size: 50px;
  color: #72661b;
}

.form-input {
  width: 160px; /* Adjust this value to your needs */
  box-sizing: border-box;
  padding: 0; /* Reset padding */
  border: 0; /* Reset border */
}

form {
  display: flex;
  margin: 0 -16px;

  * {
    margin: 16px;
  }

  input {
    flex-grow: 1;
  }
}

table {
  margin: 16px -16px 0;

  th,
  td {
    padding: 16px;
  }
}
table th, table td {
  text-align: center;
  width: 200px; /* Adjust this value to your needs */
}

table th:nth-last-child(-n+2), table td:nth-last-child(-n+2) {
  width: 80px; /* Half the size of the other columns */
}

button {
  border-radius: 50px;
  padding: 10px;
  border: none;
  cursor: pointer;

  &.delete {
    background: #72661b;
    color: #f4e4fd;
  }
}

</style>