import { ApiProperty } from '@nestjs/swagger';
import { ICalculateResponse, ICarRent } from './cars-rent.interface';

export type TRentCarShort = Pick<ICarRent, 'id' | 'carId' | 'from' | 'to'>;

export class RentCar implements ICarRent {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID',
  })
  id: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  carId: string;

  @ApiProperty({
    type: Number,
    format: 'float',
    description: 'Сумма аренды автомобиля',
  })
  cost: number;

  @ApiProperty({
    type: Number,
    format: 'int',
    description: 'Количество дней',
  })
  days: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Начало аренды',
  })
  from: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Окончания аренды',
  })
  to: Date;
}

export class CarAvailability {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  carId: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Дата проверки',
  })
  date: string;

  @ApiProperty({
    type: String,
    description: 'Состояние автомобиля',
    enum: ['vacanted', 'occupated'],
  })
  status: string;
}

export class CalculateResponse implements ICalculateResponse {
  @ApiProperty({
    type: String,
    description: 'ID машины',
  })
  carId: string;

  @ApiProperty({
    type: Number,
    format: 'float',
    description: 'Сумма аренды автомобиля',
  })
  cost: number;

  @ApiProperty({
    type: Number,
    description: 'Количество дней',
  })
  days: number;

  @ApiProperty({
    type: String,
    description: 'Начало аренды',
  })
  from: string;

  @ApiProperty({
    type: String,
    description: 'Окончания аренды',
  })
  to: string;
}
