/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const entityPath = process.argv[2];
if (!entityPath) {
  console.error(
    'Por favor, especifica el nombre de la entidad o la ruta (ejemplo: book/page)',
  );
  process.exit(1);
}

// Divide la ruta en segmentos y prepara los nombres de archivo
const segments = entityPath.split('/');
const entityName = segments.pop();

// Construye la ruta de la carpeta basada en los segmentos
const entityDir = path.join(
  __dirname,
  'src',
  ...segments,
  entityName.toLowerCase(),
);

if (!fs.existsSync(entityDir)) {
  fs.mkdirSync(entityDir, { recursive: true });
}

// Función para escribir los archivos
function writeFile(filePath, content) {
  // Obtiene el directorio del archivo
  const dirPath = path.dirname(filePath);

  // Verifica si el directorio existe, si no, lo crea
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directorio creado: ${dirPath}`);
  }

  // Escribe el archivo
  fs.writeFileSync(filePath, content);
  console.log(`Archivo creado: ${filePath}`);
}

const entityNameLowerCase = entityName.toLowerCase();
const entityNameCamelCase =
  entityNameLowerCase.charAt(0).toUpperCase() +
  entityNameLowerCase.slice(1).toLowerCase();

// Crear y escribir los archivos

// INICIO MODULO
writeFile(
  path.join(entityDir, `${entityNameLowerCase}.module.ts`),
  require('./templates/template.module')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN MODULO

// INICIO DTO
writeFile(
  path.join(
    entityDir,
    `interfaces/api/dto/create-${entityNameLowerCase}.dto.ts`,
  ),
  require('./templates/interfaces/api/dto/create-template.dto')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
writeFile(
  path.join(
    entityDir,
    `interfaces/api/dto/update-${entityNameLowerCase}.dto.ts`,
  ),
  require('./templates/interfaces/api/dto/update-template.dto')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
writeFile(
  path.join(
    entityDir,
    `interfaces/api/dto/${entityNameLowerCase}-response.dto.ts`,
  ),
  require('./templates/interfaces/api/dto/template-response.dto')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN DTO

// INICIO CONTROLLER
writeFile(
  path.join(entityDir, `interfaces/api/${entityNameLowerCase}.controller.ts`),
  require('./templates/interfaces/api/template.controller')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN CONTROLLER

// INICIO ENTITIES
writeFile(
  path.join(entityDir, `domain/entity/${entityNameLowerCase}.entity.ts`),
  require('./templates/domain/entity/template.entity')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN ENTITIES

// INICIO INTERFACES
writeFile(
  path.join(
    entityDir,
    `domain/interfaces/${entityNameLowerCase}Repository.interface.ts`,
  ),
  require('./templates/domain/interfaces/templateRepository.interface')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN INTERFACES

// INICIO REPOSITORY
writeFile(
  path.join(
    entityDir,
    `infrastructure/repository/${entityNameLowerCase}.repository.ts`,
  ),
  require('./templates/infrastructure/repository/template.repository')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN REPOSITORY

// INICIO SERVICE
writeFile(
  path.join(entityDir, `application/${entityNameLowerCase}.service.ts`),
  require('./templates/application/template.service')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN SERVICE

// INICIO SUBSCRIBER
writeFile(
  path.join(
    entityDir,
    `application/subscriber/${entityNameLowerCase}.subscriber.ts`,
  ),
  require('./templates/application/subscriber/template.subscriber')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN SUBSCRIBER

// INICIO PUBLISHERS
writeFile(
  path.join(
    entityDir,
    `application/publishers/${entityNameLowerCase}Created.publisher.ts`,
  ),
  require('./templates/application/publishers/templateCreated.publisher')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
writeFile(
  path.join(
    entityDir,
    `application/publishers/${entityNameLowerCase}Updated.publisher.ts`,
  ),
  require('./templates/application/publishers/templateUpdated.publisher')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN PUBLISHERS

// INICIO CONSUMERS
writeFile(
  path.join(
    entityDir,
    `application/consumers/${entityNameLowerCase}Created.consumer.ts`,
  ),
  require('./templates/application/consumers/templateCreated.consumer')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
writeFile(
  path.join(
    entityDir,
    `application/consumers/${entityNameLowerCase}Updated.consumer.ts`,
  ),
  require('./templates/application/consumers/templateUpdated.consumer')(
    entityNameLowerCase,
    entityNameCamelCase,
  ),
);
// FIN CONSUMERS

process.exit(1);
