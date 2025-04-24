// Use leaflet for map visualization?

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { initMap } from '../services/mapService'

  onMounted(() => {
    initMap('map')
    })
</script>

<template>
  <div class="map-chart">
    <h1>Map Chart</h1>
    <div id="map">
      <!-- Map will be rendered here -->
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#map {
    width: 100%;
    height: 400px;
}
</style>