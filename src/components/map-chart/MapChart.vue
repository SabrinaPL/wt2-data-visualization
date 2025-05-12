<script lang="ts" setup>
import * as echarts from 'echarts';
import worldJson from '../../public/map/world.json';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 
// Reference to the map container
const mapRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();

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
onMounted(async () => {
  // Fetch the gender statistics data via the service class
  await genderStatisticsStore.fetchCountryGenderStatistics();

  // TODO: remove later
  // Log the cached data from the store
  console.log('Cached country gender data: ', genderStatisticsStore.countryGenderStatistics);

  if (mapRef.value) {
    chartInstance = echarts.init(mapRef.value);

    // Register the world map
    echarts.registerMap('world', worldJson as any);

    // Map country codes to coordinates
    const countryCoordinates: Record<string, [number, number]> = {
      BE: [4.469936, 50.503887], // Belgium
      ES: [-3.70379, 40.416775], // Spain
      IR: [53.688046, 32.427908], // Iran
      DE: [10.451526, 51.165691], // Germany
      CA: [-106.346771, 56.130366], // Canada
      CH: [8.227512, 46.818188], // Switzerland
      IT: [12.56738, 41.87194], // Italy
      CN: [104.195397, 35.86166], // China
      FR: [2.213749, 46.227638], // France
      JP: [138.252924, 36.204824], // Japan
      ZA: [22.937506, -30.559482], // South Africa
      NL: [5.291266, 52.132633], // Netherlands
      US: [-95.712891, 37.09024], // United States
      AU: [133.775136, -25.274398], // Australia
      GB: [-3.435973, 55.378051], // United Kingdom
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