import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateOauth2credentialDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public platform: string;

    // @ApiProperty()
    // @IsInt()
    // @IsNotEmpty()
    // public userId: number;
}
