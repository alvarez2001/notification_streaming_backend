import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from '../../application/authentication.service';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import { SignInAuthenticationDto } from './dto/sign-in-authentication.dto';
import { Public } from '@shared/infrastructure/decorators/public.decorator';

@ApiTags('authentications')
@Controller('authentications')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    @Public()
    @Post('signin')
    async create(
        @Body() signInAuthenticationDto: SignInAuthenticationDto,
    ): Promise<AuthenticationResponseDto> {
        return this.authenticationService.signIn(
            signInAuthenticationDto.username,
            signInAuthenticationDto.password,
        );
    }
}
