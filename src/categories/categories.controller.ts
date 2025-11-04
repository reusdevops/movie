import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category with the provided information. Slug must be unique.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Category data to create',
    examples: {
      example1: {
        summary: 'Example category',
        value: {
          name: 'Action',
          slug: 'action',
          description: 'Action-packed movies and shows',
          active: true,
          thumbnail_url: 'https://example.com/action-thumbnail.jpg',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Category successfully created',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Action',
        slug: 'action',
        description: 'Action-packed movies and shows',
        active: true,
        thumbnail_url: 'https://example.com/action-thumbnail.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Category with this slug already exists' })
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Returns a list of all categories in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Action',
          slug: 'action',
          description: 'Action-packed movies and shows',
          active: true,
          thumbnail_url: 'https://example.com/action-thumbnail.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Returns detailed information about a specific category.',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category details retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Action',
        slug: 'action',
        description: 'Action-packed movies and shows',
        active: true,
        thumbnail_url: 'https://example.com/action-thumbnail.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates category information. Slug must be unique if being changed.',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Category data to update (all fields are optional)',
    examples: {
      example1: {
        summary: 'Update category name',
        value: {
          name: 'Updated Action',
        },
      },
      example2: {
        summary: 'Update multiple fields',
        value: {
          name: 'Sci-Fi',
          slug: 'sci-fi',
          description: 'Science fiction movies and shows',
          active: true,
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category successfully updated',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Action',
        slug: 'action',
        description: 'Action-packed movies and shows',
        active: true,
        thumbnail_url: 'https://example.com/action-thumbnail.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Category with this slug already exists' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Permanently deletes a category from the system.',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category successfully deleted',
    schema: {
      example: {
        message: 'Category deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
