import axios from 'axios'

/**
 * Service class to fetch gender statistics data from the Restful Movies API.
 */
export class GenderStatisticsService {
  async fetchCountryGenderStatistics() {
    const response = await axios.get(`${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/country`)
    return response.data
  }

  // TODO: Add more methods to fetch other gender statistics data
}

