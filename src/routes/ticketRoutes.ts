import { Router } from 'express';
import {
  createTicket,
  takeTicket,
  completeTicket,
  cancelTicket,
  getTickets,
  cancelAllInProgress,
} from '../controllers/ticketController';
import {
  createTicketSchema,
  completeTicketSchema,
  cancelTicketSchema,
  getTicketsSchema,
} from '../schemas/ticket.schema';
import { validate } from '../middleware/validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API для управления тикетами (заявками)
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Создать новый тикет
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketInput'
 *     responses:
 *       201:
 *         description: Тикет успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Ошибка валидации
 */
router.post('/tickets', validate(createTicketSchema), createTicket);

/**
 * @swagger
 * /api/tickets/{id}/take:
 *   put:
 *     summary: Взять тикет в работу
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: UUID тикета
 *     responses:
 *       200:
 *         description: Тикет взят в работу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Тикет не найден
 *       409:
 *         description: Тикет уже в работе
 */
router.put('/tickets/:id/take', takeTicket);

/**
 * @swagger
 * /api/tickets/{id}/complete:
 *   put:
 *     summary: Завершить тикет
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: UUID тикета
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolutionText
 *             properties:
 *               resolutionText:
 *                 type: string
 *                 description: Текст решения по тикету
 *                 example: "Проблема решена путём перезагрузки системы"
 *     responses:
 *       200:
 *         description: Тикет успешно завершён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Тикет не найден
 *       400:
 *         description: Неверный формат UUID или ошибка валидации
 */
router.put('/tickets/:id/complete', validate(completeTicketSchema), completeTicket);

/**
 * @swagger
 * /api/tickets/{id}/cancel:
 *   put:
 *     summary: Отменить тикет
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: UUID тикета
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 description: Причина отмены тикета
 *                 example: "Тикет дублирует существующую проблему"
 *     responses:
 *       200:
 *         description: Тикет успешно отменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Тикет не найден
 *       400:
 *         description: Неверный формат UUID или ошибка валидации
 *       409:
 *         description: Невозможно отменить уже завершённый тикет
 */
router.put('/tickets/:id/cancel', validate(cancelTicketSchema), cancelTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Получить список тикетов (с фильтрацией)
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         description: Начальная дата и время диапазона (используется вместе с endDate)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31T23:59:59Z"
 *         description: Конечная дата и время диапазона (используется вместе с startDate)
 *     responses:
 *       200:
 *         description: Список тикетов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/tickets', validate(getTicketsSchema), getTickets);

/**
 * @swagger
 * /api/tickets/cancel-in-progress:
 *   delete:
 *     summary: Отменить все тикеты "в работе" (in_progress)
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Все in_progress тикеты отменены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/tickets/cancel-in-progress', cancelAllInProgress);

export default router;
