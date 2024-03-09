module.exports = (
  entityNameLowerCase,
  entityNameCamelCase,
) => `import { Create${entityNameCamelCase}Dto } from './create-${entityNameLowerCase}.dto';
import { PartialType } from '@nestjs/swagger';

export class Update${entityNameCamelCase}Dto extends PartialType(Create${entityNameCamelCase}Dto) {}
`;
