import { defineStore } from 'pinia'
import axios from 'axios'

export const useGenderStatisticsStore = defineStore('genderStatistics', {
  state: () => ({
    // Cache the api response to avoid multiple requests
    countryGenderStatistics: {} as Record<string, any>,
    departmentGenderStatistics: {} as Record<string, any>,
    yearGenderStatistics: {} as Record<string, any>,
    genreGenderStatistics: {} as Record<string, any>,
    companyGenderStatistics: {} as Record<string, any>,
    isLoading: false,
    error: null as string | null,
}),

actions: {
  async fetchCountryGenderStatistics() {
    // Check if the data is already cached
    if (this.countryGenderStatistics.length > 0) {
      console.log('Gender statistics for movie production countries have already been fetched and cached')
      return
    }

    this.isLoading = true
    this.error = null

    try {
      const response = await axios.get(import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL + '/country')
      this.countryGenderStatistics = response.data

      console.log(response.data)
    } catch (error) {
      this.error = 'Failed to fetch gender statistics for movie production countries'
      console.error('Error fetching gender statistics for movie production countries:', error)
    } finally {
      this.isLoading = false
    }
  },
}
})
