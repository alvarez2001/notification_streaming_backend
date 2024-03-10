import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Redirect,
    Req,
} from '@nestjs/common';
import { Oauth2credentialService } from '../../application/oauth2credential.service';
import { CreateOauth2credentialDto } from './dto/create-oauth2credential.dto';
import { Oauth2credentialResponseDto } from './dto/oauth2credential-response.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@shared/infrastructure/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('oauth2_credentials')
@Controller('oauth2credentials')
export class Oauth2credentialController {
    constructor(
        private readonly oauth2credentialService: Oauth2credentialService,
        private readonly configService: ConfigService,
    ) {}

    @Get('')
    @ApiBearerAuth()
    async findAll(
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<Oauth2credentialResponseDto[]> {
        const userId = req.user.id;
        return this.oauth2credentialService.findAllOauth2credentials(userId);
    }

    @Delete(':platform')
    @ApiBearerAuth()
    async deleteOAuthByPlatform(
        @Param('platform') platform: string,
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<void> {
        const userId = req.user.id;
        return this.oauth2credentialService.deleteOauth2credential(userId, platform);
    }

    @Post()
    @ApiBearerAuth()
    async create(
        @Body() createOauth2credentialDto: CreateOauth2credentialDto,
        @Req() req: any,
    ): Promise<any> {
        return this.oauth2credentialService.getUriOAuth2(createOauth2credentialDto, req);
    }

    @Get('callback/:platform')
    @Redirect()
    @Public()
    async callbackOAuth(
        @Param('platform') platform: string,
        @Query('code') code: string,
        @Query('state') state: string,
    ): Promise<any> {
        await this.oauth2credentialService.callbackOAuth(platform, code, state);
        const url = `${this.configService.get('REDIRECT_FRONTEND')}/oauth2?authentication=success`;
        return { statusCode: HttpStatus.FOUND, url };
    }
}
