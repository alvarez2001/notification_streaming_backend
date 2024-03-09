import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateAuthenticationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public token: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public expireIn: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    public userId: number;
}
