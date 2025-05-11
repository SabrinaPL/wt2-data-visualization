<script lang="ts" setup>
import * as echarts from 'echarts';
import worldJson from '../../public/map/world.json';
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 
// Reference to the map container
const mapRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Example data for gender statistics by country
const genderStatistics = [
  { country: 'US', genderData: [{ gender: 'male', value: 60 }, { gender: 'female', value: 40 }] },
  { country: 'FR', genderData: [{ gender: 'male', value: 55 }, { gender: 'female', value: 45 }] },
  { country: 'JP', genderData: [{ gender: 'male', value: 70 }, { gender: 'female', value: 30 }] },
];

// Function to create pie series for each country (inspired by example code from: https://echarts.apache.org/examples/en/editor.html?c=map-usa-pie&lang=ts)
function createPieSeries(center: [number, number], radius: number, data: any[]): echarts.PieSeriesOption {
  return {
    type: 'pie',
    coordinateSystem: 'geo',
    tooltip: {
      formatter: '{b}: {c} ({d}%)',
    },
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    radius,
    center,
    data: data.map((item) => ({
      value: item.value,
      name: item.gender,
    })),
  };
}

// Initialize the map chart
onMounted(() => {
  if (mapRef.value) {
    chartInstance = echarts.init(mapRef.value);

    // Register the world map
    echarts.registerMap('world', worldJson);

    // Map country codes to coordinates (example coordinates for simplicity)
    const countryCoordinates: Record<string, [number, number]> = {
      US: [-100, 38], // USA
      FR: [2.2137, 46.2276], // France
      JP: [138.2529, 36.2048], // Japan
    };

    // Create pie series for each country
    const series = genderStatistics
      .map((stat) => {
        const coordinates = countryCoordinates[stat.country];
        if (coordinates) {
          return createPieSeries(coordinates, 10, stat.genderData);
        }
        return null;
      })
      .filter((item): item is echarts.PieSeriesOption => item !== null); // Type assertion

    // Set the chart options
    const option: echarts.EChartsOption = {
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#e7e8ea',
          borderColor: '#111',
        },
        emphasis: {
          itemStyle: {
            areaColor: '#a1d3f5',
          },
        },
      },
      tooltip: {},
      series,
    };

    chartInstance.setOption(option);
  }
});

// Dispose of the chart instance on unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<template>
  <div class="map-chart">
    <h1>World Map - Movie Gender Data</h1>
    <div id="map" ref="mapRef" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<style scoped>
.map-chart {
  width: 100%;
  height: 100%;
}
</style>