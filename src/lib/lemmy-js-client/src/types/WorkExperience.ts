import {Month} from "./Month";

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startMonth: Month;
  startYear: number;
  isCurrent: boolean;
  endMonth: Month | null;
  endYear: number | null;
}