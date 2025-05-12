<script lang="ts" setup>
import * as echarts from 'echarts';
import worldJson from '../../public/map/world.json';
import countryCoordinates from '../../../countryCoordinates.json';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';
import type { GenderStatistics } from '../../data/types';
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Reference to the map container
const mapRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();

const isLoading = ref(true);

// Function to create pie series for each country (inspired by example code from: https://echarts.apache.org/examples/en/editor.html?c=map-usa-pie&lang=ts)
function createPieSeries(center: [number, number], radius: number, data: any[]): echarts.PieSeriesOption {
  const genderColors: Record<string, string> = {
    men: '#2471A3',
    women: '#2ECC71',
    undefined: '#F4D03F', 
  }

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
      itemStyle: {
        color: genderColors[item.gender],
      }
    })),
  };
}

// Initialize the map chart
onMounted(async () => {
  isLoading.value = true; 

  // Fetch the gender statistics data via the service class
  await genderStatisticsStore.fetchCountryGenderStatistics();

  // TODO:
  // Log the cached data from the store
  console.log('Cached country gender data: ', genderStatisticsStore.countryGenderStatistics);

  // Transform the data to match the genderStatistics format (as suggested by copilot)
  const genderStatistics: GenderStatistics[] = genderStatisticsStore.countryGenderStatistics
  .filter((stat: { country: string }) => countryCoordinates[stat.country as keyof typeof countryCoordinates]) // Ensure the country code exists in the coordinates
  .map((stat: { country: string; breakdown: { gender: number; percentage: number }[] }) => ({
    country: stat.country,
    genderData: stat.breakdown.map((item) => ({
      gender: item.gender === 0 ? 'men' : item.gender === 1 ? 'women' : 'undefined', // Map gender codes to labels
      value: item.percentage,
    })),
  }));

console.log('Mapped Gender Statistics:', genderStatistics);

  if (mapRef.value) {
    chartInstance = echarts.init(mapRef.value);

    // Register the world map
    echarts.registerMap('world', worldJson as any);

    // Create pie series for each country
    const series = genderStatistics
      .map((stat) => {
        const coordinates = countryCoordinates[stat.country as keyof typeof countryCoordinates];
        if (Array.isArray(coordinates) && coordinates.length == 2) {
          return createPieSeries(coordinates as [number, number], 10, stat.genderData);
        }
        return null;
      })
      .filter((item): item is echarts.PieSeriesOption => item !== null); // Type assertion to filter out null values

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
            areaColor: '#DAF7A6',
          },
        },
      },
      tooltip: {},
      series,
    };

    chartInstance.setOption(option);
  }

  // Event listener for click events on the map
  chartInstance?.on('click', (params) => {
    if (params.componentType === 'geo') {
      const countryName = params.name;
      // TODO: map country name to country code - chart modal to pop up with country statistics when country is clicked?
      console.log('Clicked country:', countryName);
    }
  })

  isLoading.value = false; // Set loading to false after the chart is initialized
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
    <h1 id="country-title">Map of Gender Equality by Production Country</h1>

    <!-- Show "Loading..." while map is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading...</p>
    </div>

    <!-- Map container -->
    <div id="map" ref="mapRef" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<style scoped>
.map-chart {
  width: 100%;
  height: 100%;
}

.loading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0098d9;
  margin-top: 20px;
  text-align: center;
}

#country-title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}
</style>