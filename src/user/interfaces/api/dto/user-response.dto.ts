import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty()
    @Expose()
    public id: number;

    @ApiProperty()
    @Expose()
    public name: string;

    @ApiProperty()
    @Expose()
    public lastName: string;

    @ApiProperty()
    @Expose()
    public nationality: string;

    @ApiProperty()
    @Expose()
    public identification: string;

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
