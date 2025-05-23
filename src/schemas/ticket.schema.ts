import { z } from 'zod';

const baseTicketSchema = {
  params: z.object({
    id: z.string().uuid('Invalid ticket ID format'),
  }),
};

export const createTicketSchema = z.object({
  body: z.object({
    topic: z.string().min(3, 'Topic must be at least 3 characters long'),
    text: z.string().min(10, 'Text must be at least 10 characters long'),
  }),
});

export const completeTicketSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Неверный формат UUID' }),
  }),
  body: z.object({
    resolutionText: z.string().min(1, 'Текст решения обязателен'),
  }),
});

export const cancelTicketSchema = z.object({
  ...baseTicketSchema,
  body: z.object({
    cancellationReason: z.string().min(5, 'Cancellation reason must be at least 5 characters long'),
  }),
});

export const getTicketsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime({ offset: true }),
    endDate: z.string().datetime({ offset: true }),
  }),
});

export type CreateTicketBody = z.infer<typeof createTicketSchema>['body'];
export type CompleteTicketRequest = z.infer<typeof completeTicketSchema>;
export type CancelTicketRequest = z.infer<typeof cancelTicketSchema>;
export type GetTicketsQuery = z.infer<typeof getTicketsSchema>['query'];
