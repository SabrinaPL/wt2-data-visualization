<script setup lang="ts">
import Dashboard from "./Dashboard.vue";
import MapChart from "../components/map-chart/MapChart.vue";
import CountryChart from "../components/country-chart/CountryChart.vue";
import MovieGenreChart from "../components/genre-chart/MovieGenreChart.vue";
import DepartmentChart from "../components/department-chart/DepartmentChart.vue";
import ProductionYearChart from "../components/year-chart/ProductionYearChart.vue";
</script>

<template>
  <div class="landing-page">
    <Dashboard></Dashboard>
    <div class="country-charts-container">
      <MapChart></MapChart>
      <CountryChart></CountryChart>
    </div>
    <div class="bar-charts-container">
      <MovieGenreChart></MovieGenreChart>
      <DepartmentChart></DepartmentChart>
    </div>
    <div class="bar-charts-container">
      <ProductionYearChart></ProductionYearChart>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.country-charts-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.bar-charts-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
