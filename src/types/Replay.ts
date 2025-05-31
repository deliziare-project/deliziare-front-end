export interface Replay {
  _id: string;
  bidAmount: number;
  status: string;
  chefId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  chefProfile?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  postId?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  createdAt?: string;
  description?: string;
  readByUser: boolean;
}
