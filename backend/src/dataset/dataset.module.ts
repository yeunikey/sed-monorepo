import { DataController } from "./dataset.controller";
import { DataSet } from "./models/dataset";
import { DatasetService } from "./dataset.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([DataSet])],
    providers: [DatasetService],
    controllers: [DataController],
})
export class DatasetModule { }
