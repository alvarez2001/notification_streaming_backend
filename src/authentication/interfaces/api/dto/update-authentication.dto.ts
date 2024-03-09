import { CreateAuthenticationDto } from './create-authentication.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAuthenticationDto extends PartialType(CreateAuthenticationDto) {}
