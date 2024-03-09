import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { Public } from '@shared/infrastructure/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Public()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(createUserDto);
    }

    @Get(':id')
    @ApiBearerAuth()
    async findOne(@Param('id') id: number): Promise<UserResponseDto> {
        return this.userService.findUserById(id);
    }

    @Get()
    @ApiBearerAuth()
    async pagination(@Query() query: object): Promise<PaginateResponseDto<UserResponseDto>> {
        return this.userService.pagination(query);
    }

    @Get('/data/list')
    @ApiBearerAuth()
    async findAll(): Promise<UserResponseDto[]> {
        return this.userService.findAllUsers();
    }

    @Put(':id')
    @ApiBearerAuth()
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    async remove(@Param('id') id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }
}
