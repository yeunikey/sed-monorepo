import { Controller, Get, Post, Body, UseGuards, Delete, Query } from '@nestjs/common';
import { DatasetService } from './dataset.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDataDto } from './dto/dataset.dto';
import { DataSet } from './models/dataset';

@Controller('datasets')
@UseGuards(AuthGuard)
export class DataController {

    constructor(private readonly dataService: DatasetService) { }

    @Post('/upload')
    async upload(@Body() body: Partial<DataSet>[]) {
        return {
            statusCode: 200,
            data: await this.dataService.saveAll(body)
        };
    }

    @Get()
    async all() {
        return {
            statusCode: 200,
            data: await this.dataService.findAll()
        }
    }

    @Post()
    async save(@Body() body: CreateDataDto) {
        return {
            statusCode: 200,
            data: await this.dataService.save(body)
        };
    }

    @Delete()
    async delete(@Query('id') id: number) {
        await this.dataService.delete(id);
        return {
            statusCode: 200,
        }
    }

}
