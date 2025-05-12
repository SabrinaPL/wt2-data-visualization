<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';

// Reference the bar chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Access the store
const genderStatisticsStore = useGenderStatisticsStore();

// Reactive variables
const selectedDepartment = ref<string>('Acting'); // Default selected department
const selectedViewMode = ref<string>('count'); // Default view mode (count or percentage)

const departmentData = ref<{ men: number; women: number; undefined: number }>({
  men: 0,
  women: 0,
  undefined: 0,
});

const isLoading = ref(true);


