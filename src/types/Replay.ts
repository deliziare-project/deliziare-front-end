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
  createdAt?: string;
}