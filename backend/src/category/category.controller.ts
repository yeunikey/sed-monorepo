import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "./controller.service";
import { DeepPartial } from "typeorm";
import { Category } from "./models/category.entity";

@Controller('categories')
export class CategoryController {

    constructor(
        private categoryService: CategoryService
    ) { }

    @Get()
    async categories() {
        return {
            statusCode: 200,
            data: await this.categoryService.all()
        }
    }

    @Get('test')
    test() {
        const categories: DeepPartial<Category>[] = [
            {
                name: "Электроника",
                subcategories: [
                    {
                        name: "Наушники",
                        vars: [
                            { name: "Громкость" },
                            { name: "Шумоподавление" }
                        ]
                    },
                    {
                        name: "Смартфоны",
                        vars: [
                            { name: "Диагональ экрана" },
                            { name: "Объём памяти" }
                        ]
                    }
                ]
            },
            {
                name: "Бытовая техника",
                subcategories: [
                    {
                        name: "Холодильники",
                        vars: [
                            { name: "Объём" },
                            { name: "Тип разморозки" }
                        ]
                    }
                ]
            },
            {
                name: "Одежда",
                subcategories: [
                    {
                        name: "Футболки",
                        vars: [
                            { name: "Размер" },
                            { name: "Цвет" }
                        ]
                    }
                ]
            },
            {
                name: "Обувь",
                subcategories: [
                    {
                        name: "Кроссовки",
                        vars: [
                            { name: "Размер" },
                            { name: "Материал подошвы" }
                        ]
                    }
                ]
            },
            {
                name: "Аксессуары",
                subcategories: [
                    {
                        name: "Сумки",
                        vars: [
                            { name: "Тип" },
                            { name: "Материал" }
                        ]
                    }
                ]
            },
            {
                name: "Красота и уход",
                subcategories: [
                    {
                        name: "Кремы",
                        vars: [
                            { name: "Тип кожи" },
                            { name: "Объём" }
                        ]
                    }
                ]
            },
            {
                name: "Здоровье",
                subcategories: [
                    {
                        name: "Витамины",
                        vars: [
                            { name: "Тип" },
                            { name: "Форма выпуска" }
                        ]
                    }
                ]
            },
            {
                name: "Товары для дома",
                subcategories: [
                    {
                        name: "Освежители воздуха",
                        vars: [
                            { name: "Аромат" },
                            { name: "Объём" }
                        ]
                    }
                ]
            }
        ];

        {
            categories.map(category => {
                this.categoryService.save(category);
            })
        }

        return {
            message: "Категории успешно добавлены",
        };
    }


}