import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';

class RelationId {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    public id: number;
}

export class CreateStreamingNotificationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public platformStreaming: string;

    @ApiProperty({ type: [RelationId], example: [{ id: 1 }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RelationId)
    public platformNotifications: RelationId[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public message: string;
}
