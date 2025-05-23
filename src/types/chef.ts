export interface Chef {
  _id: String;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  experience: string;
  specialize: string[];
  // certificate: string;
  createdAt: string;
}
