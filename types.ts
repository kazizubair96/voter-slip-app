
export interface Voter {
  id: string;
  full_name: string;
  father_name?: string;
  mother_name?: string;
  date_of_birth: string;
  ward: string;
  center_name: string;
  voter_number: string;
  created_at: string;
}

export interface SearchParams {
  fullName: string;
  dob: string;
  ward: string;
  voterNumber?: string;
}
