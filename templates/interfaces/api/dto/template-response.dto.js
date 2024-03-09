module.exports = (
  entityNameLowerCase,
  entityNameCamelCase,
) => `export class ${entityNameCamelCase}ResponseDto {

  constructor(partial: Partial<${entityNameCamelCase}ResponseDto>) {
    Object.assign(this, partial);
  }
}
`;
