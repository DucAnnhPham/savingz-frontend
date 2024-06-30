<script setup lang="ts">
import {onMounted, ref, type Ref, watch} from 'vue'
import axios from "axios";

defineProps<{ title: string }>()

type Transaction = {
  transactionName: string,
  transactionCategory: string,
  transactionDate: Date,
  transactionAmount: number,
  id : number,
  userId: number,
  isEditing: boolean,
  [key: string]: string | number | Date | boolean;
}

const transactionsListData: Ref<Transaction[]> = ref([])
const nameField = ref("")
const categoryField = ref("")
const amountField = ref("")
const dateField = ref("")
const categories = ['Food', 'Clothing', 'Rent', 'Utilities', 'Entertainment', 'Income' ,'Other']
const errorMessage: Ref<string[]> = ref([])
const sortField = ref('id')
const sortOrder = ref('asc') // 'asc' for ascending, 'desc' for descending

const url = import.meta.env.VITE_APP_BACKEND_BASE_URL

function onFormSubmitted(): void {
  errorMessage.value = ["", "", "", ""];

  if (!nameField.value) {
    errorMessage.value[0] = "Name field must be filled out.";
  }
  if (!categoryField.value) {
    errorMessage.value[1] = "Category field must be filled out.";
  }
  if (!dateField.value) {
    errorMessage.value[2] = "Date field must be filled out.";
  }
  if (!amountField.value) {
    errorMessage.value[3] = "Amount field must be filled out.";
  }
  for(let i = 0; i < errorMessage.value.length; i++) {
    if (errorMessage.value[i] !== "") {
      return;
    }
  }
  createTransaction()
  nameField.value = "";
  categoryField.value = "";
  dateField.value = "";
  amountField.value = "";


}

function createTransaction(): void {
  const transaction = {
    transactionName: nameField.value, // string
    transactionCategory: categoryField.value, // string
    transactionDate: dateField.value, // string in "yyyy-MM-dd" format
    transactionAmount: parseFloat(amountField.value), // number
    userId: localStorage.getItem('userId') // number
  }
  axios
      .post<Transaction>(`${url}/transactions`, transaction)
      .then((response) => transactionsListData.value.push(response.data))
      .catch((error) => console.log(error))
}

function requestTransactions(): void {
  axios
      .get<Transaction[]>(`${url}/transactions?userId=${localStorage.getItem('userId')}`)
      .then((response) => (transactionsListData.value = response.data))
      .catch((error) => console.log(error))
}
function editTransaction(transaction: Transaction): void {
  transaction.isEditing = true;
}

function updateTransaction(id: number, transaction: Transaction): void {
  axios
      .put<Transaction>(`${url}/transactions/${id}`, transaction)
      .then((response) => {
        const index = transactionsListData.value.findIndex((h) => h.id === id)
        transactionsListData.value[index] = { ...response.data, isEditing: false }
      })
      .catch((error) => console.log(error))
}

function removeTransaction(id: number): void {
  if (window.confirm('Are you sure you want to delete this transaction?')) {
    axios
        .delete<void>(`${url}/transactions/${id}`)
        .then(() => (transactionsListData.value = transactionsListData.value.filter((h) => h.id !== id)))
        .catch((error) => console.log(error))
  }
}

function formatDate(dateString: Date): string{
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function sortTransactions() {
  if (sortField.value) {
    transactionsListData.value.sort((a, b) => {
      let aValue = a[sortField.value];
      let bValue = b[sortField.value];

      // If sorting by amount, use absolute values
      if (sortField.value === 'transactionAmount') {
        if (typeof aValue === "number") {
          aValue = Math.abs(aValue);
        }
        if (typeof bValue === "number") {
          bValue = Math.abs(bValue);
        }
      }

      if (sortOrder.value === 'asc') {
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
      } else if (sortOrder.value === 'desc') {
        if (aValue < bValue) {
          return 1;
        }
        if (aValue > bValue) {
          return -1;
        }
      }
      return 0;
    })
  }
}

function getTotalAmount() {
  let total = 0;
  for (let i = 0; i < transactionsListData.value.length; i++) {
    total += transactionsListData.value[i].transactionAmount;
  }
  return total;
}
watch(sortField, sortTransactions)
watch(sortOrder, sortTransactions)

// Lifecycle Hook
onMounted(() => requestTransactions())

</script>

<template>
  <h2>{{ title }}</h2>
  <div class="sort-container">
    <h3>Sort by:</h3>
    <select v-model="sortField">
      <option value="id">added</option>
      <option value="transactionName">Name</option>
      <option value="transactionCategory">Category</option>
      <option value="transactionDate">Date</option>
      <option value="transactionAmount">Amount</option>
    </select>
    <select v-model="sortOrder">
      <option value="asc">↑ ascending</option>
      <option value="desc">↓ descending</option>
    </select>
  </div>
  <table class = "error-popup">
    <tr>
      <td>{{ errorMessage[0] }}</td>
      <td>{{ errorMessage[1] }}</td>
      <td>{{ errorMessage[2] }}</td>
      <td>{{ errorMessage[3] }}</td>
    </tr>
  </table>
  <div class="container">
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
      </form>
    <table>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Date</th>
        <th>Amount</th>
        <th>Edit/Delete Transaction</th>
      </tr>
      <tr v-if="!transactionsListData.length">
        <td colspan="2">The are no past Transactions!</td>
      </tr><tr v-for="transaction in transactionsListData" :key="transaction.id">
      <td v-if="!transaction.isEditing">{{ transaction.transactionName }}</td>
      <td v-else><input v-model="transaction.transactionName" /></td>

      <td v-if="!transaction.isEditing">{{ transaction.transactionCategory }}</td>
      <td v-else>
        <select v-model="transaction.transactionCategory">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </td>

      <td v-if="!transaction.isEditing">{{ formatDate(transaction.transactionDate) }}</td>
      <td v-else><input type="date" v-model="transaction.transactionDate" /></td>

      <td v-if="!transaction.isEditing">{{ transaction.transactionAmount.toFixed(2) }}</td>
      <td v-else><input type="number" v-model="transaction.transactionAmount" /></td>


      <td class="button-container">
        <button class="button-click" @click="editTransaction(transaction)" v-if="!transaction.isEditing">Edit</button>
        <button class="button-click" @click="updateTransaction(transaction.id, transaction)" v-else>Save</button>
        <button class="button-click-delete" @click="removeTransaction(transaction.id)">Delete</button>
      </td>

    </tr>

      <tr class="total-amount-row">
        <td colspan="3">Total Amount:</td>
        <td>{{ getTotalAmount().toFixed(2) }}</td>
      </tr>

    </table>
  </div>
</template>

<style scoped>

h2 {
  font-size: 50px;
  color: #000709;
  margin-top: 50px;
}
h3 {
  font-size: 15px;
  color: #000709;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.sort-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.error-popup td {
  display: inline-block;
  margin-right: 17px;
  color: darkred;
  font-size: 13.5px;
}

.total-amount-row td {
  font-size: 20px;
  font-weight: bold;
}

.form-input, .form-input select {
  box-sizing: border-box;
  width: 180px;
  height: 40px;
  padding: 0;
  border: none;
}

form {
  display: flex;
  margin: 0 -16px;

  * {
    margin: 16px;
  }
}

table {
  margin: 16px -16px 0;
  color: black;

}
table th, table td {
  text-align: center;
  width: 200px; /* Adjust this value to your needs */
  padding: 16px;
}


button {
  border-radius: 50px;
  padding: 5px;
  border: none;
  background: #389726;
  color: white;
  width: 100px;
}


.button-container {
  display: flex;
  justify-content: space-around; /* Adjusts the spacing between the buttons */
  align-items: center; /* Aligns the buttons vertically in the middle */
  flex-direction: row; /* Ensures the buttons are placed in a row */
}
.button-click {
  background: #cfc70a;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50px;
  cursor: pointer;
}

.button-click-delete{
  background: #d84a4a;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50px;
  cursor: pointer;

}

</style>