export interface Review {
  review_content: string;
  review_images: [string];
  createdAt: Date;
  review_user: {
    avatar: string;
    fullName: string;
  };
  review_rating: number;
  _id: string;
}
