import { CreateOauth2credentialDto } from './create-oauth2credential.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOauth2credentialDto extends PartialType(CreateOauth2credentialDto) {}
