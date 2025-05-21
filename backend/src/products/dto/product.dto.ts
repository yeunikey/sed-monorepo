export interface Variables {
    [key: string]: string;
}

export interface CreateProductDto {
    title: string;
    price: number;
    description: string;
    category: number;
    subCategory: number;
    mainImage?: Express.Multer.File;
    productImages?: Express.Multer.File[];
    variables: Variables;
    city: string;
    minCount: number;
    delivery: string;
}

export interface UpdateProductDto {
    id: string;
    title: string;
    price: number;
    description: string;
    category: number;
    subCategory: number;
    mainImage?: Express.Multer.File;
    productImages?: Express.Multer.File[];
    variables: Variables;
    mainImageIds?: string,
    productImageIds: string[],
    city: string;
    minCount: number;
    delivery: string;
}

export class SearchDto {
    text?: string;
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}