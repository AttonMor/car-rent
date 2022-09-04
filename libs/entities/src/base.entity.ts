import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultException {
  @ApiProperty({
    type: Number,
    format: 'int',
    description: 'Код ошибки',
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: String,
    description: 'Тест ошибки',
  })
  message: any;

  @ApiProperty({
    type: String,
    description: 'Ошибка',
  })
  error: string;
}
