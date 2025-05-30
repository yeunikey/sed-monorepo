
interface ApiResponse<T> {
  statusCode: number,
  message?: string,
  data: T
}

interface User {

  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  rating: number;
  city: string;
  password: string;
  shopinfo: ShopInfo;
  image: string;
  role: "USER" | "ADMIN";

}

interface ShopInfo {

  id: number;
  name: string;
  address: string;

}

interface Category {

  id: number;
  name: string;
  subcategories: SubCategory[];
}

interface SubCategory {

  id: number;
  name: string;
  vars: VariableCategory[];
}

export class VariableCategory {

  id: number;
  name: string;

}

export class SavedImage {

  id: string;
  filename: string;

}

export class Product {

  id: string;
  category: Category;
  subCategory: SubCategory;
  user: User;
  price: number;
  title: string;
  description: string;
  variables: ProductVariable[];
  banner: string;
  images: string[];
  rating: number;
  city: string;
  minCount: number;
  delivery: string;

}

export class ProductVariable {

  id: number;
  name: string;
  value: string;

}

interface SearchParams {
  text?: string;
  categoryId?: number;
  subcategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  text?: string;
}

export {
  ApiResponse,
  User,
  ShopInfo,
  Category,
  SubCategory,
  VariableCategory,
  SavedImage,
  Product,
  ProductVariable,
  SearchParams
}
