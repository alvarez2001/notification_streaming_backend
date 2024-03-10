import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { StreamingNotificationService } from '../../application/streamingnotification.service';
import { CreateStreamingNotificationDto } from './dto/create-streamingnotification.dto';
import { UpdateStreamingNotificationDto } from './dto/update-streamingnotification.dto';
import { StreamingNotificationResponseDto } from './dto/streamingnotification-response.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@shared/infrastructure/decorators/public.decorator';
import { Request, Response } from 'express';

@ApiTags('streamingnotifications')
@Controller('streamingnotifications')
export class StreamingNotificationController {
    constructor(private readonly streamingnotificationService: StreamingNotificationService) {}

    @Post()
    @ApiBearerAuth()
    async create(
        @Body() createStreamingNotificationDto: CreateStreamingNotificationDto,
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<StreamingNotificationResponseDto> {
        const userId = req.user.id;
        return this.streamingnotificationService.createStreamingNotification(
            createStreamingNotificationDto,
            userId,
        );
    }

    @Get('/data/list')
    @ApiBearerAuth()
    async findAll(
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<StreamingNotificationResponseDto[]> {
        const userId = req.user.id;
        return this.streamingnotificationService.findAllStreamingNotifications(userId);
    }

    @Put(':id')
    @ApiBearerAuth()
    async update(
        @Param('id') id: number,
        @Body() updateStreamingNotificationDto: UpdateStreamingNotificationDto,
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<StreamingNotificationResponseDto> {
        const userId = req.user.id;
        return this.streamingnotificationService.updateStreamingNotification(
            id,
            updateStreamingNotificationDto,
            userId,
        );
    }

    @Delete(':id')
    @ApiBearerAuth()
    async remove(
        @Param('id') id: number,
        @Req() req: Request & { user: { id: number; username: string } },
    ): Promise<void> {
        const userId = req.user.id;
        return this.streamingnotificationService.deleteStreamingNotification(id, userId);
    }

    @Post('/webhook/twitch')
    @Public()
    async webhoookTwitchNotification(
        @Body() body: any,
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<any> {
        const { code, data } =
            await this.streamingnotificationService.callbackWebhookTwitchNotification(
                request,
                body,
            );

        response.status(code);
        if (data) {
            response.type('text/plain');
            response.send(data);
        } else {
            response.send(null);
        }
    }
}
