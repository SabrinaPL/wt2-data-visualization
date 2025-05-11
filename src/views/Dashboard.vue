<template>
  <div class="dashboard">
    <h1>Gender Statistics by Country</h1>
    <button @click="fetchUSA" :disabled="store.isLoading">
      {{ store.isLoading ? 'Loading...' : 'Fetch USA Statistics' }}
    </button>
    <button @click="fetchJapan" :disabled="store.isLoading">
      {{ store.isLoading ? 'Loading...' : 'Fetch Japan Statistics' }}
    </button>
    <button @click="fetchGermany" :disabled="store.isLoading">
      {{ store.isLoading ? 'Loading...' : 'Fetch Germany Statistics' }}
    </button>
    <p v-if="store.error" class="error">{{ store.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGenderStatisticsStore } from '../stores/genderStatisticsStore'

// Access the store
const store = useGenderStatisticsStore();

const fetchUSA = () => store.fetchGenderStatisticsByCountry('US')
const fetchJapan = () => store.fetchGenderStatisticsByCountry('JP')
const fetchGermany = () => store.fetchGenderStatisticsByCountry('DE')
</script>

<style scoped>
.error {
  color: red;
}
</style>