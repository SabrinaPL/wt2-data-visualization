interface GenderData {
  gender: string;
  value: number;
}

export interface GenderStatistics {
  country: string;
  genderData: GenderData[];
}