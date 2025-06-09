export interface Location {
  lat: number;
  lng: number;
  _id: string;
}

export interface Post {
  _id: string;
  userId: string;
  eventName: string;
  location: Location;
  date: string;
  time: string;
  district: string;
  quantity: number;
  menu: string[];
  description: string;
  createdAt: string;
}

export interface PostsResponse {
  posts: Post[];
}