import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAuthenticationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public password: string;
}
