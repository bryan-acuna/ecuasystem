export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}