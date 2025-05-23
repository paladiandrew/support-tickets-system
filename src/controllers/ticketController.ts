import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import Ticket from '../models/Ticket';
import {
  CreateTicketBody,
  CompleteTicketRequest,
  CancelTicketRequest,
  GetTicketsQuery,
} from '../schemas/ticket.schema';

export const createTicket: RequestHandler = async (req, res, next) => {
  try {
    const { body } = req as unknown as { body: CreateTicketBody };
    const ticket = await Ticket.create(body);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

export const takeTicket: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    ticket.status = 'В работе';
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

export const completeTicket: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = req as unknown as CompleteTicketRequest;
    const { id } = params;
    const { resolutionText } = body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    ticket.status = 'Завершено';
    ticket.resolutionText = resolutionText;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

export const cancelTicket: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = req as unknown as CancelTicketRequest;
    const { id } = params;
    const { cancellationReason } = body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    ticket.status = 'Отменено';
    ticket.cancellationReason = cancellationReason;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

export const getTickets: RequestHandler = async (req, res, next) => {
  try {
    const { query } = req as unknown as { query: GetTicketsQuery };
    const { startDate, endDate } = query;

    const tickets = await Ticket.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

export const cancelAllInProgress: RequestHandler = async (req, res, next) => {
  try {
    const [affectedCount] = await Ticket.update(
      { status: 'Отменено' },
      { where: { status: 'В работе' } },
    );
    res.json({
      message: 'All in-progress tickets have been canceled',
      affectedCount,
    });
  } catch (err) {
    next(err);
  }
};
