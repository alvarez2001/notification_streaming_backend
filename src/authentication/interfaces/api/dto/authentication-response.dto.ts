import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../../../user/interfaces/api/dto/user-response.dto';

export class AuthenticationResponseDto {
    @ApiProperty()
    @Expose()
    public id: number;

    @ApiProperty()
    @Expose()
    public token: string;

    @ApiProperty()
    @Expose()
    public expireIn: string;

    @ApiProperty()
    @Expose()
    public userId: number;

    @ApiProperty({ type: UserResponseDto })
    @Type(() => UserResponseDto)
    @Expose()
    public user: UserResponseDto;

    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public createdAt: Date;

    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public updatedAt: Date;

    constructor(partial: Partial<AuthenticationResponseDto>) {
        Object.assign(this, partial);
    }
}
