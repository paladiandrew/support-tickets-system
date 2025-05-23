import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './database';
import ticketRoutes from './routes/ticketRoutes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    info: {
      title: 'Ticket API',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            topic: { type: 'string', example: 'Проблема с доступом' },
            text: { type: 'string', example: 'Не могу войти в систему' },
            status: {
              type: 'string',
              enum: ['Новое', 'В работе', 'Завершено', 'Отменено'],
              example: 'Новое',
            },
            resolutionText: {
              type: 'string',
              nullable: true,
              example: 'Исправлено в v2.0',
            },
            cancellationReason: {
              type: 'string',
              nullable: true,
              example: 'Дубликат',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTicketInput: {
          type: 'object',
          required: ['topic', 'text'],
          properties: {
            topic: { type: 'string', example: 'Ошибка 404' },
            text: { type: 'string', example: 'Страница не найдена' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(bodyParser.json());
app.use('/api', ticketRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
});
