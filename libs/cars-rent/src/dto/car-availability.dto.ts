import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CarAvailabilityDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  /**
   * ID машины
   */
  carId: string;

  /**
   * Дата проверки
   */
  @ApiProperty({
    type: String,
    format: 'Date',
    description: 'Дата проверки',
    required: false,
  })
  date: string;
}
