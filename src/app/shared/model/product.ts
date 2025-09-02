export interface Products {
  id: number;
  name: string;
  price: number;
  category: string;
  material: string;
  image: string;
  clientid?: string;
  description: string;
}
export interface CartItem extends Products {
  quantity: number;
}
