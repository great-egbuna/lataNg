export interface ICreateProduct {
  name: string;
  price: number;
  state: string;
  city: string;
  file: Blob;
  discount: string;
  productType?: string;
  description: string;
}
