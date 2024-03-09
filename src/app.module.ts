import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/application/guards/jwt-auth.guard';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        RabbitmqModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, EventEmitterModule.forRoot()],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('WRITE_DB_HOST', 'localhost'),
                port: configService.get<number>('WRITE_DB_PORT', 5432),
                username: configService.get<string>('WRITE_DB_USERNAME', 'root'),
                password: configService.get<string>('WRITE_DB_PASSWORD', 'root'),
                database: configService.get<string>('WRITE_DB_DATABASE', 'pgsql'),
                autoLoadEntities: true,
                synchronize: configService.get<boolean>('WRITE_DB_SYNCHRONIZE', true),
                subscribers: ['dist/**/*.subscriber{.ts,.js}'],
            }),
        }),
        UserModule,
        AuthenticationModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
