interface PostImage {
  url: string;
  altText: string;
  _id: string;
}

export interface PostId {
  _id: string;
  title: string;
  images: PostImage[];
}
export interface requstId{
  _id: string;
  chefId: string;
  userId: string;
  description:string;
  amount:number;
  status:string;
  isAddressAdd:boolean
  district:string|null
  location: {
    lat: Number| null 
    lng: Number| null 
  },
   date: string|null
   time: string|null
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  postId:PostId;
  requstId:requstId;
  isRead:boolean;
  
}
