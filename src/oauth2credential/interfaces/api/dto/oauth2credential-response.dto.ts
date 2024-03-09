import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class Oauth2credentialResponseDto {
    @ApiProperty()
    @Expose()
    public id: number;

    @ApiProperty()
    @Expose()
    public platform: string;

    @ApiProperty()
    @Expose()
    public authTimestamp: Date;

    @ApiProperty()
    @Expose()
    public status: string;

    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public createdAt: Date;

    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public updatedAt: Date;

    constructor(partial: Partial<Oauth2credentialResponseDto>) {
        Object.assign(this, partial);
    }
}
