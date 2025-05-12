import axios from 'axios'

/**
 * Service class to fetch gender statistics data from the Restful Movies API.
 */
export class GenderStatisticsService {
  async fetchCountryGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/country`)
    return response.data
  }

  async fetchGenreGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/genre`)
    return response.data
  }

  async fetchDepartmentGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/department`)
    return response.data
  }

  async fetchYearGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/year`)
    return response.data
  }

  async fetchCompanyGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/company`)
    return response.data
  }
}

