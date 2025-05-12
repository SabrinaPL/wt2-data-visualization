<script setup lang="ts">
import Dashboard from "./Dashboard.vue";
import MapChart from "../components/map-chart/MapChart.vue";
import CountryChart from "../components/country-chart/CountryChart.vue";
</script>

<template>
  <div class="landing-page">
    <Dashboard></Dashboard>
    <div class="charts-container">
      <MapChart></MapChart>
      <CountryChart></CountryChart>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charts-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}
</style>
