export type Education = {
  id: number;
  personId: number;
  schoolName: string;
  major: string;
  createdAt: string; 
  updatedAt: string;
};

export type EducationResponse = {
  education: Education[];
};
