export interface Product {
  id: number;
  errorDescription: string;
  name: string;
  sku: string;
  image: string;
  color: number;
}

export interface DisplayingProduct {
  id: number;
  errorDescription: string;
  name: string;
  sku: string;
  image: string;
  color: number;
  nameError?: string;
  skuError?: string;
}