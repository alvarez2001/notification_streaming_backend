import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Oauth2credentialResponseDto } from 'src/oauth2credential/interfaces/api/dto/oauth2credential-response.dto';

export class StreamingNotificationResponseDto {
    @ApiProperty()
    @Expose()
    public id: number;

    @ApiProperty()
    @Expose()
    public name: string;

    @ApiProperty()
    @Expose()
    public platformStreaming: string;

    @ApiProperty({ type: Oauth2credentialResponseDto })
    @Type(() => Oauth2credentialResponseDto)
    @Expose()
    public platformNotifications: Oauth2credentialResponseDto[];

    @ApiProperty()
    @Expose()
    public message: string;

    @ApiProperty()
    @Expose()
    public status: string;

    @ApiProperty()
    @Expose()
    public profileImageUrl: string;
    
    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public createdAt: Date;

    @ApiProperty()
    @Type(() => Date)
    @Expose()
    public updatedAt: Date;

    constructor(partial: Partial<StreamingNotificationResponseDto>) {
        Object.assign(this, partial);
    }
}
