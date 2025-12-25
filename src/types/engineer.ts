export interface Engineer {
  id: string;
  user_id: string;
  user: {
    email: string;
    role: string;
  };
  name?: string;
  phone?: string;
  status?: string;
  full_name?: string;
  contact_number?: string;
  skill_category?: string;
  specializations?: string[];
  preferred_city?: string;
}

export interface EngineerDetails {
  user: {
    id: string;
    email: string;
    role: string;
  };
  profile: {
    id: string;
    name: string;
    phone: string;
    status: string;
  } | null;
  kyc: {
    id: string;
    status: string;
    remarks: string | null;
    photo_file: string | null;
    address_proof_file: string | null;
  } | null;
  bank: {
    id: string;
    status: string;
    remarks: string | null;
    proof_file: string | null;
  } | null;
}

export type StatusType = 'approved' | 'rejected' | 'pending' | 'verified';
