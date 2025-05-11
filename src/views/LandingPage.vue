<script setup lang="ts">
import Dashboard from "./Dashboard.vue"
import MapChart from "../components/map-chart/MapChart.vue"
</script>

<template>
  <div class="landing-page">
    <Dashboard></Dashboard>
    <MapChart></MapChart>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Add spacing between components */
}
</style>
