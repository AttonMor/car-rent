import { ApiProperty } from '@nestjs/swagger';
import { ICar } from './cars.interface';

export class Car implements ICar {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  id: string;

  @ApiProperty({
    type: String,
    format: 'string',
    description: 'Номер машины',
  })
  number: string;
}
