<template>
  <div class="dashboard">
    <h1>Gender Statistics by Country</h1>
    <button @click="fetchAll" :disabled="store.isLoading">
      {{ store.isLoading ? 'Loading...' : 'Fetch country statistics' }}
    </button>
    <p v-if="store.error" class="error">{{ store.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGenderStatisticsStore } from '../stores/genderStatisticsStore'

// Access the store
const store = useGenderStatisticsStore();

const fetchAll = () => store.fetchCountryGenderStatistics()
</script>

<style scoped>
.error {
  color: red;
}
</style>