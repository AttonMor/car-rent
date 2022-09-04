import { ApiProperty } from '@nestjs/swagger';

export class LoadingReportDto {
  /**
   * ID машины
   */
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
    required: false,
  })
  carId: string;
}
