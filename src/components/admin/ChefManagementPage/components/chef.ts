export type Chef = {
  id: number;
  name: string;
  email: string;
  experience: string;
  location: { lat: number; lng: number };
  state: string;
  district: string;
  isBlocked: boolean;
  specialisations: string[];
  certificate: string;
};

export type FilterStatus = 'all' | 'blocked' | 'unblocked';