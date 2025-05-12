import axios from 'axios';
import fs from 'fs';

const countryCodes = [
  'MA', 'BT', 'UA', 'GI', 'QA', 'AW', 'VN', 'IQ', 'MQ', 'CY', 'ZW', 'CZ', 'FR', 'SE', 'LK', 'AO', 'HU',
  'PL', 'PA', 'ZA', 'ML', 'SG', 'ES', 'MC', 'MT', 'CD', 'UY', 'AM', 'KP', 'ME', 'TZ', 'AR', 'BG', 'FI', 'MR',
  'MX', 'ET', 'LV', 'CU', 'UM', 'SA', 'TT', 'BE', 'SN', 'MO', 'KW', 'RO', 'KH', 'LR', 'PK', 'GB', 'BB', 'BO', 'AE',
  'LY', 'TF', 'CA', 'RS', 'TJ', 'AZ', 'NI', 'GN', 'AT', 'GT', 'PG', 'CG', 'KR', 'AL', 'IT', 'LU', 'GE',
  'GR', 'KG', 'BM', 'EG', 'UZ', 'IE', 'ID', 'KE', 'TN', 'DK', 'AU', 'VE', 'HK', 'CH', 'RU', 'NL', 'CL', 'MD', 'DE',
  'PS', 'IL', 'NZ', 'LT', 'PR', 'BY', 'KY', 'GH', 'PE', 'BW', 'BR', 'BD', 'CM', 'SO', 'DO', 'CR', 'CO', 'PH', 'NO',
  'RW', 'BF', 'TD', 'BN', 'AQ', 'IN', 'WS', 'LB', 'DZ', 'MM', 'IR', 'MN', 'PY', 'SV', 'SI', 'BS', 'NP', 'IS',
  'EC', 'PF', 'HN', 'KZ', 'BA', 'CI', 'EE', 'US', 'AF', 'MK', 'TR', 'TW', 'LI', 'CN', 'MY', 'PT', 'JM', 'NA', 'NG',
  'UG', 'SK', 'TH', 'MG', 'SY', 'JO', 'LA', 'HR', 'JP'
];

// Function to fetch country coordinates from the rest countries api (as suggested by copilot)
async function fetchCountryCoordinates() {
  const countryCoordinates = {};

  for (const code of countryCodes) {
    try {
      const response = await axios.get(import.meta.env.VITE_REST_COUNTRIES_API_BASE_URL + `${code}`);
      const latlng = response.data[0]?.latlng;
      if (latlng) {
        countryCoordinates[code] = [latlng[1], latlng[0]]; // Store as [longitude, latitude]
      } else {
        console.error(`No coordinates found for country code: ${code}`);
      }
    } catch (error) {
      console.error(`Error fetching coordinates for country code ${code}:`, error.message);
    }
  }

  // Save the coordinates to a JSON file
  fs.writeFileSync(
    './countryCoordinates.json',
    JSON.stringify(countryCoordinates, null, 2)
  );

  console.log('Country coordinates saved to countryCoordinates.json');
}

fetchCountryCoordinates();
