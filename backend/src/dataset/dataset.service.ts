import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSet } from './models/dataset';

@Injectable()
export class DatasetService {

    constructor(
        @InjectRepository(DataSet)
        private readonly dataRepo: Repository<DataSet>,
    ) { }

    async findAll() {
        return await this.dataRepo.find();
    }

    async findById(id: number) {
        return await this.dataRepo.findOne({
            where: { id },
        });
    }

    async delete(id: number) {
        return await this.dataRepo.delete(id);
    }

    async save(data: Partial<DataSet>) {
        return await this.dataRepo.save(data);
    }

    async saveAll(data: Partial<DataSet>[]) {
        return await this.dataRepo.save(data);
    }

}
