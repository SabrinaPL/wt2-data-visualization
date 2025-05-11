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
  async fetchGenderStatisticsByCountry(country: string) {
    console.log('hello from fetchGenderStatisticsByCountry')
    // Check if the data is already cached
    if (this.countryGenderStatistics[country]) {
      console.log('Data already cached for country:', country)
      return
    }

    this.isLoading = true
    this.error = null

    try {
      const response = await axios.get(import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL + '/country', {
        params: { country },
      })
      this.countryGenderStatistics[country] = response.data

      console.log(response.data)
    } catch (error) {
      this.error = 'Failed to fetch statistics by country'
      console.error('Error fetching statistics by country:', error)
    } finally {
      this.isLoading = false
    }
  },
}
})
