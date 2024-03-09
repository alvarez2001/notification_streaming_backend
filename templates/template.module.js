module.exports = (
  entityNameLowerCase,
  entityNameCamelCase,
) => `import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { ${entityNameCamelCase}CreatedConsumer } from './application/consumers/${entityNameLowerCase}Created.consumer';
import { ${entityNameCamelCase}CreatedPublisher } from './application/publishers/${entityNameLowerCase}Created.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${entityNameCamelCase} } from './domain/entity/${entityNameLowerCase}.entity';
import { ${entityNameCamelCase}Repository } from './infrastructure/repository/${entityNameLowerCase}.repository';
import { ${entityNameCamelCase}Controller } from './interfaces/api/${entityNameLowerCase}.controller';
import { ${entityNameCamelCase}Service } from './application/${entityNameLowerCase}.service';
import { ${entityNameCamelCase.toUpperCase()}_REPOSITORY_INTERFACE } from './domain/interfaces/${entityNameLowerCase}Repository.interface';
import { ${entityNameCamelCase}Subscriber } from './application/subscriber/${entityNameLowerCase}.subscriber';
import { ${entityNameCamelCase}UpdatedConsumer } from './application/consumers/${entityNameLowerCase}Updated.consumer';
import { ${entityNameCamelCase}UpdatedPublisher } from './application/publishers/${entityNameLowerCase}Updated.publisher';

@Module({
    controllers: [${entityNameCamelCase}Controller],
    exports: [${entityNameCamelCase}Service],
    imports: [RabbitmqModule, TypeOrmModule.forFeature([${entityNameCamelCase}])],
    providers: [
        {
            provide: ${entityNameCamelCase.toUpperCase()}_REPOSITORY_INTERFACE,
            useClass: ${entityNameCamelCase}Repository,
        },
        ${entityNameCamelCase}CreatedConsumer,
        ${entityNameCamelCase}CreatedPublisher,
        ${entityNameCamelCase}UpdatedConsumer,
        ${entityNameCamelCase}UpdatedPublisher,
        ${entityNameCamelCase}Service,
        ${entityNameCamelCase}Subscriber,
    ],
})
export class ${entityNameCamelCase}Module {}
`;
