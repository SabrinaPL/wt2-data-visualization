import { defineStore } from "pinia";
import { GenderStatisticsService } from "../services/genderStatisticsService";
import { getCountryCodeByName } from '../utils/mapCountryCodes';

const genderStatisticsService = new GenderStatisticsService();

export const useGenderStatisticsStore = defineStore("genderStatistics", {
    state: () => ({
      // Cache the api response to avoid multiple requests
      countryGenderStatistics: {} as Record<string, any>,
      departmentGenderStatistics: {} as Record<string, any>,
      yearGenderStatistics: {} as Record<string, any>,
      genreGenderStatistics: {} as Record<string, any>,
      companyGenderStatistics: {} as Record<string, any>,
      selectedCountry: 'US', // Default country
      isLoading: false,
      error: null as string | null,
    }),

    actions: {
      async fetchCountryGenderStatistics() {
        // Check if the data is already cached
        if (this.countryGenderStatistics.length > 0) {
          console.log(
            "Gender statistics for movie production countries have already been fetched and cached"
          );
          return;
        }

        this.isLoading = true;
        this.error = null;

        try {
          const genderStatisticsByCountry =
            await genderStatisticsService.fetchCountryGenderStatistics();

          this.countryGenderStatistics = genderStatisticsByCountry;
        } catch (error) {
          this.error =
            "Failed to fetch gender statistics for movie production countries";
          console.error(
            "Error fetching gender statistics for movie production countries:",
            error
          );
        } finally {
          this.isLoading = false;
        }
      },

      getStatisticsByCountry(country: string) {
        console.log("Fetching cached country data...");

        // Check if the country data is already cached
        const countryData = this.countryGenderStatistics.find(
          (stat: any) => stat.country === country
        );

        console.log("Country data:", countryData);

        if (countryData) {
          return countryData;
        } else {
          console.error(
            "Gender statistics for the specified country are not available"
          );
          throw new Error(
            "Gender statistics for the specified country are not available"
          );
        }
      },

      setSelectedCountry(country: string) {
        const countryCode = getCountryCodeByName(country) || '';
        console.log("Country code:", countryCode);
        this.selectedCountry = countryCode;
        console.log("Selected country code:", this.selectedCountry);
      },
    },
  });
