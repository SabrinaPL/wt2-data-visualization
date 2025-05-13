import axios from "axios";

/**
 * Service class to fetch gender statistics data from the Restful Movies API.
 */
export class GenderStatisticsService {
  async fetchCountryGenderStatistics() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/country`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching country data:", error);
      throw new Error("Failed to fetch country gender statistics");
    }
  }

  async fetchGenreGenderStatistics() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/genre`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching genre data: ", error);
      throw new Error("Failed to fetch genre gender statistics");
    }
  }

  async fetchDepartmentGenderStatistics() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/department`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching department data: ", error);
      throw new Error("Failed to fetch department gender statistics");
    }
  }

  async fetchYearGenderStatistics() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/year`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching year data: ", error);
      throw new Error("Failed to fetch gender statistics by year");
    }
  }

  async fetchCompanyGenderStatistics() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GENDER_STATISTICS_API_BASE_URL}/company`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company data: ", error);
      throw new Error("Failed to fetch gender statistics by company");
    }
  }
}
