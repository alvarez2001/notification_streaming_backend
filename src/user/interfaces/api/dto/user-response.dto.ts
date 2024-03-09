import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty()
    @Expose()
    public id: number;

    @ApiProperty()
    @Expose()
    public email: string;

    @ApiProperty()
    @Expose()
    public username: string;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    public createdAt: Date;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    public updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
