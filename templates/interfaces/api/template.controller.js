module.exports = (
    entityNameLowerCase,
    entityNameCamelCase,
) => `import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ${entityNameCamelCase}Service } from '../../application/${entityNameLowerCase}.service';
import { Create${entityNameCamelCase}Dto } from './dto/create-${entityNameLowerCase}.dto';
import { Update${entityNameCamelCase}Dto } from './dto/update-${entityNameLowerCase}.dto';
import { ${entityNameCamelCase}ResponseDto } from './dto/${entityNameLowerCase}-response.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { Public } from '@shared/infrastructure/decorators/public.decorator';

@ApiTags('${entityNameLowerCase}s')
@Controller('${entityNameLowerCase}s')
export class ${entityNameCamelCase}Controller {
    constructor(private readonly ${entityNameLowerCase}Service: ${entityNameCamelCase}Service) {}

    @Post()
    @Public()
    async create(@Body() create${entityNameCamelCase}Dto: Create${entityNameCamelCase}Dto): Promise<${entityNameCamelCase}ResponseDto> {
        return this.${entityNameLowerCase}Service.create${entityNameCamelCase}(create${entityNameCamelCase}Dto);
    }

    @Get(':id')
    @ApiBearerAuth()
    async findOne(@Param('id') id: number): Promise<${entityNameCamelCase}ResponseDto> {
        return this.${entityNameLowerCase}Service.find${entityNameCamelCase}ById(id);
    }

    @Get()
    @ApiBearerAuth()
    async pagination(@Query() query: object): Promise<PaginateResponseDto<${entityNameCamelCase}ResponseDto>> {
        return this.${entityNameLowerCase}Service.pagination(query);
    }

    @Get('/data/list')
    @ApiBearerAuth()
    async findAll(): Promise<${entityNameCamelCase}ResponseDto[]> {
        return this.${entityNameLowerCase}Service.findAll${entityNameCamelCase}s();
    }

    @Put(':id')
    @ApiBearerAuth()
    async update(
        @Param('id') id: number,
        @Body() update${entityNameCamelCase}Dto: Update${entityNameCamelCase}Dto,
    ): Promise<${entityNameCamelCase}ResponseDto> {
        return this.${entityNameLowerCase}Service.update${entityNameCamelCase}(id, update${entityNameCamelCase}Dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    async remove(@Param('id') id: number): Promise<void> {
        return this.${entityNameLowerCase}Service.delete${entityNameCamelCase}(id);
    }
}
`;
