import { CreateStreamingNotificationDto } from './create-streamingnotification.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateStreamingNotificationDto extends PartialType(CreateStreamingNotificationDto) {}
