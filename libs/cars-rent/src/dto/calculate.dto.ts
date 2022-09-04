import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsUUID,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'RentPeriod', async: true })
@Injectable()
class RentPeriod implements ValidatorConstraintInterface {
  validate(value: string) {
    const workingDay = [1, 2, 3, 4, 5];
    const dayOfWeek = moment(value).day();
    return workingDay.includes(dayOfWeek);
  }

  defaultMessage(args: ValidationArguments) {
    if (args.property === 'periodTo') {
      return 'Аренда заканчивается в выходной день';
    }
    if (args.property === 'periodFrom') {
      return 'Аренда начинается с выходного дня';
    }
    return `Bad date ${args.property}`;
  }
}

export class CalculateDto {
  /**
   * ID машины
   */
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID машины',
  })
  id: string;

  /**
   * Начало периода
   */
  @IsNotEmpty()
  @IsDateString()
  @Validate(RentPeriod)
  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Начало периода',
  })
  periodFrom: string;

  /**
   * Окончание периода
   */
  @IsNotEmpty()
  @IsDateString()
  @Validate(RentPeriod)
  @ApiProperty({
    type: String,
    description: 'Окончание периода',
    format: 'date-time',
  })
  periodTo: string;
}
