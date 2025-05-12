<script setup lang="ts">
import Dashboard from "./Dashboard.vue";
import MapChart from "../components/map-chart/MapChart.vue";
import CountryChart from "../components/country-chart/CountryChart.vue";
import MovieGenreChart from "../components/genre-chart/MovieGenreChart.vue";
</script>

<template>
  <div class="landing-page">
    <Dashboard></Dashboard>
    <div class="charts-container">
      <MapChart></MapChart>
      <CountryChart></CountryChart>
    </div>
    <div class="genre-chart-container">
      <MovieGenreChart></MovieGenreChart>
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

.genre-chart-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
