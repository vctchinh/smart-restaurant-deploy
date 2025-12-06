import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService } from './category.service';

import HttpResponse from '@shared/utils/http-response';
import {
	CreateCategoryRequestDto,
	GetCategoriesRequestDto,
	UpdateCategoryRequestDto,
	PublishCategoryRequestDto,
	DeleteCategoryRequestDto,
} from 'src/category/dtos/request';

@Controller()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@MessagePattern('categories:create')
	async createCategory(dto: CreateCategoryRequestDto) {
		const category = await this.categoryService.createCategory(dto);
		return new HttpResponse(1000, 'Category created successfully', category);
	}

	@MessagePattern('categories:get-all')
	async getCategories(dto: GetCategoriesRequestDto) {
		const categories = await this.categoryService.getCategories(dto);
		return new HttpResponse(1000, 'Categories retrieved successfully', categories);
	}

	@MessagePattern('categories:update')
	async updateCategory(dto: UpdateCategoryRequestDto) {
		const category = await this.categoryService.updateCategory(dto);
		return new HttpResponse(1000, 'Category updated successfully', category);
	}

	@MessagePattern('categories:publish')
	async publishCategory(dto: PublishCategoryRequestDto) {
		const category = await this.categoryService.publishCategory(dto);
		return new HttpResponse(1000, 'Category publish status updated', category);
	}

	@MessagePattern('categories:delete')
	async deleteCategory(dto: DeleteCategoryRequestDto) {
		await this.categoryService.deleteCategory(dto);
		return new HttpResponse(1000, 'Category deleted successfully');
	}
}
