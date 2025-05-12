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
        console.log("Fetching country data...");

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

      async fetchGenreGenderStatistics() {
        // Check if the data is already cached
        if (this.genreGenderStatistics.length > 0) {
          console.log("Genre statistics have already been fetched and cached");
          return;
        }

        this.isLoading = true;
        this.error = null;

        try {
          const genderStatisticsByGenre =
            await genderStatisticsService.fetchGenreGenderStatistics();

          this.genreGenderStatistics = genderStatisticsByGenre;
        } catch (error) {
          this.error =
            "Failed to fetch gender statistics for movie genres";
          console.error("Error fetching genre statistics:", error);
        } finally {
          this.isLoading = false;
        }
      },

      getStatisticsByGenre(genre: string) {
        console.log("Fetching genre data...");

        // Check if the genre data is already cached
        const genreData = this.genreGenderStatistics.find(
          (stat: any) => stat.genre === genre
        );

        console.log("Genre data:", genreData);

        if (genreData) {
          return genreData;
        } else {
          console.error(
            "Failed to fetch genre statistics for the specified genre"
          );
          throw new Error(
            "Failed to fetch genre statistics for the specified genre"
          );
        }
      },

      async fetchDepartmentGenderStatistics() {
        // Check if the data is already cached
        if (this.departmentGenderStatistics.length > 0) {
          console.log(
            "Department statistics have already been fetched and cached"
          );
          return;
        }

        this.isLoading = true;
        this.error = null;

        try {
          const genderStatisticsByDepartment =
            await genderStatisticsService.fetchDepartmentGenderStatistics();

          this.departmentGenderStatistics = genderStatisticsByDepartment;
        } catch (error) {
          this.error =
          "Failed to fetch gender statistics for movie departments";
          console.error("Error fetching department statistics:", error);
        } finally {
          this.isLoading = false;
        }
      },

      getStatisticsByDepartment(department: string) {
        console.log("Fetching department data...");

        // Check if the department data is already cached
        const departmentData = this.departmentGenderStatistics.find(
          (stat: any) => stat.department === department
        );

        console.log("Department data:", departmentData);

        if (departmentData) {
          return departmentData;
        } else {
          console.error(
            "Failed to fetch department statistics for the specified department"
          );
          throw new Error(
            "Failed to fetch department statistics for the specified department"
          );
        }
      }
    },
  });
