import { Model, DataTypes, BuildOptions } from 'sequelize';
import { sequelize } from '../database';

interface TicketAttributes {
  id?: string;
  topic: string;
  text: string;
  status?: 'Новое' | 'В работе' | 'Завершено' | 'Отменено';
  resolutionText?: string;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TicketInstance extends Model<TicketAttributes>, TicketAttributes {}

type TicketModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TicketInstance;
};

const Ticket = sequelize.define<TicketInstance>(
  'Ticket',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Новое',
      allowNull: false,
      validate: {
        isIn: [['Новое', 'В работе', 'Завершено', 'Отменено']],
      },
    },
    resolutionText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'Tickets',
  },
) as TicketModelStatic;

export default Ticket;
