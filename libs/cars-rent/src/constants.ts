import { ITariff } from './return.interface';

export const TARIFFS: ITariff[] = [
  {
    id: 1,
    days: 4,
    discount: 0,
  },
  {
    id: 2,
    days: 5,
    discount: 5,
  },
  {
    id: 3,
    days: 8,
    discount: 10,
  },
  {
    id: 4,
    days: 12,
    discount: 15,
  },
];

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
