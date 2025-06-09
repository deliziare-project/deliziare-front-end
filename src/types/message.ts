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


export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  postId?:PostId
}
