# NewsChallenge Frontend

Frontend de la aplicación de noticias desarrollada con Angular y Tailwind CSS.

## Descripción

Esta aplicación implementa las siguientes funcionalidades:
1. Mostrar un listado de noticias.
2. Mostrar el detalle de una noticia.
3. Gestionar noticias (CRUD: Crear, Leer, Actualizar, Eliminar).

El frontend consume una API REST para la gestión de datos (ver repositorio backend del challenge) y sigue una arquitectura cliente-servidor.

## Tecnologías y herramientas

- Angular 20
- TypeScript
- Tailwind CSS
- HTML5 y CSS3
- Karma & Jasmine para pruebas unitarias
- Docker & Docker Compose

## Prerrequisitos

- Node.js ≥ 20
- npm ≥ 9
- Angular CLI (opcional)

## Instalación

```bash
npm install
```

## Modo desarrollo

Inicia el servidor de desarrollo en `http://localhost:4200` y habilita recarga en caliente:

```bash
npm run start
# o con Angular CLI:
ng serve
```

## Construcción para producción

Genera los artefactos optimizados en la carpeta `dist/`:

```bash
npm run build
```

## Docker

El proyecto incluye Dockerfile y docker-compose.yml, con scripts disponibles en `package.json`:

```bash
# Construir la imagen Docker
npm run docker:build

# Ejecutar el contenedor en el puerto 80
npm run docker:run

# Levantar en modo desarrollo con Docker Compose
npm run docker:dev

# Levantar en modo producción con Docker Compose
npm run docker:prod

# Detener y eliminar contenedores
npm run docker:down
```

## Arquitectura de la aplicación

- `src/app/core`: Servicios y modelos compartidos.
- `src/app/shared`: Componentes reutilizables (spinner, notificaciones, modales).
- `src/app/features/news`: Módulo específico de noticias con componentes y páginas:
  - Listado (`news-list`)
  - Detalle (`news-detail`)
  - Formulario y modales para creación y edición
- `app.routes.ts`: Configuración de rutas.
- Estilos basados en Tailwind CSS.

## Pruebas

Ejecuta las pruebas unitarias con Karma y Jasmine:

```bash
npm run test
```

## Autor

Desarrollado por **Tomás Ribes**.
Repositorio Front: https://github.com/TomasRibesB/news-challenge-frontend
Repositorio Back: https://github.com/TomasRibesB/news-challenge-backend
