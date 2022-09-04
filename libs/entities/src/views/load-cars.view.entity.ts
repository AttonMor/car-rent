import { ApiProperty } from '@nestjs/swagger';

export class LoadingCarView {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  carId: string;

  @ApiProperty({
    type: String,
    format: 'string',
    description: 'Номер машины',
  })
  carNumber: string;

  @ApiProperty({
    type: Number,
    format: 'int',
    description: 'Месяц',
  })
  month: number;

  @ApiProperty({
    type: Number,
    format: 'float',
    description: 'Среднее значение',
  })
  average: number;
}
