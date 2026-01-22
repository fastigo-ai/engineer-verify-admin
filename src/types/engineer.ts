export interface Engineer {
  id: string;
  user_id: string;
  name?: string;
  mobile?: string;
  email?: string;
  status?: string;
  is_hold?: boolean;
}

export interface EngineerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  specializations: string[];
  preferred_city: string | null;
  current_location: string | null;
  pincode: string | null;
  isAvailable: boolean;
  status: string;
  is_hold: boolean;
}

export interface EngineerKyc {
  id: string;
  status: string;
  aadhaar_number: string | null;
  pan_number: string | null;
  address_proof_type: string | null;
  remarks: string | null;
  photo_file: string | null;
  address_proof_file: string | null;
}

export interface EngineerBank {
  id: string;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  status: string;
  remarks: string | null;
  proof_file: string | null;
}

export interface EngineerDetails {
  user: {
    id: string;
    email: string;
    role: string;
  };
  profile: EngineerProfile | null;
  kyc: EngineerKyc | null;
  bank: EngineerBank | null;
}

export type StatusType = 'approved' | 'rejected' | 'pending' | 'verified' | 'completed' | 'active';
