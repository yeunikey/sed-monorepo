import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./models/category.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    async findById(id: number) {
        return await this.categoryRepository.findOneBy({
            id: id
        });
    }

    async save(category: DeepPartial<Category>) {
        return await this.categoryRepository.save(category);
    }

    async delete(id: number) {
        return await this.categoryRepository.delete(id);
    }

    async all() {
        return await this.categoryRepository.find();
    }

}