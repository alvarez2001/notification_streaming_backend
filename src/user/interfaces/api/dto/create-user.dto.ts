import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    public name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    public lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1)
    public nationality: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    public identification: string;

    @ApiProperty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    public username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public password: string;
}
