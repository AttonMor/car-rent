import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import {
  RentCar,
  CarAvailability,
  CalculateResponse,
  LoadingCarView,
} from '@app/entities';

import { CarsRentService } from './cars-rent.service';
import { DATE_FORMAT, TARIFFS } from './constants';
import { CalculateDto } from './dto/calculate.dto';
import { CarAvailabilityDto } from './dto/car-availability.dto';
import { LoadingReportDto } from './dto/loading-report.dto';
import { DefaultException } from '../../entities/src/base.entity';

const MAX_RENT = parseInt(process.env.MAX_RENT) || 30;

@Controller('rent')
export class CarRentController {
  constructor(private readonly carsRentService: CarsRentService) {}

  @Get('all')
  @ApiTags('car-rent')
  @ApiOperation({ summary: 'Все аренды' })
  @ApiResponse({
    status: 200,
    type: [RentCar],
  })
  getAll() {
    return this.carsRentService.getAll();
  }

  @Post('/calculate')
  @ApiTags('car-rent')
  @ApiOperation({ summary: 'Посчитать сумму аренды' })
  @ApiResponse({
    status: 200,
    description: 'Результат расчета',
    type: CalculateResponse,
  })
  @ApiResponse({
    status: 400,
    type: DefaultException,
  })
  @ApiBody({
    type: CalculateDto,
    description: 'Данные для расчета стоимести аренды',
  })
  async calculate(@Body() calculateDto: CalculateDto) {
    const { id, periodFrom, periodTo } = calculateDto;
    await this.carsRentService.getCarById(id);

    // Перерыв между арендой
    const maintenance = await this.carsRentService.checkCarForService(
      id,
      periodFrom,
    );
    if (maintenance.status) {
      const from = moment(maintenance.from).format(DATE_FORMAT),
        to = moment(maintenance.to).format(DATE_FORMAT);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            `Автомобиль ${id} находится на техническом обслуживание с ${from} до ${to}`,
          ],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Пересечения с текущими арендами
    const overlap = await this.carsRentService.getOverlaps(calculateDto);
    if (overlap) {
      const from = moment(overlap.from).format(DATE_FORMAT),
        to = moment(overlap.to).format(DATE_FORMAT);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            `Автомобиль ${overlap.carId} забронирован с ${from} до ${to}`,
          ],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const from = moment(periodFrom),
      to = moment(periodTo);

    const numberDays = this.carsRentService.calculateNumberOfRentalDays(
      from,
      to,
    );

    // Максимальное количество дней аренды
    const IsNotMore = this.carsRentService.checkMaxRentalPeriod(
      numberDays,
      MAX_RENT,
    );
    if (!IsNotMore) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Превышено максимальное количество дней аренды'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const costRent = this.carsRentService.calculateCostRent(
      numberDays,
      TARIFFS,
    );

    return {
      carId: id,
      cost: costRent,
      days: numberDays,
      from: from.format(DATE_FORMAT),
      to: to.format(DATE_FORMAT),
    };
  }

  @Post('/create-rent-car')
  @ApiOperation({ summary: 'Создать сессию аренды автомобиля' })
  @ApiTags('car-rent')
  @ApiResponse({
    status: 201,
    type: RentCar,
  })
  @ApiResponse({
    status: 400,
    type: DefaultException,
  })
  @HttpCode(201)
  async createRentCar(@Body() calculateDto: CalculateDto): Promise<RentCar[]> {
    const resultCarRentalPrice = await this.calculate(calculateDto);

    const result = await this.carsRentService.create(resultCarRentalPrice);

    return result;
  }

  @Post('car-availability')
  @ApiTags('car-rent')
  @ApiOperation({ summary: 'Проверить автомобиль' })
  @ApiBody({
    type: CarAvailabilityDto,
    description: 'Данные для проверки',
  })
  @ApiResponse({
    status: 200,
    description: 'Состояние автомобиля',
    type: CarAvailability,
  })
  @ApiResponse({
    status: 404,
    description: 'Автомобиль не найден',
    type: DefaultException,
  })
  @HttpCode(200)
  async getCarAvailability(
    @Body() data: CarAvailabilityDto,
  ): Promise<CarAvailability> {
    const { carId, date } = data;

    await this.carsRentService.getCarById(carId);

    const checkDate = date || moment(date).format(DATE_FORMAT);

    const status = await this.carsRentService.getCarAvailability(
      carId,
      checkDate,
    );

    return {
      carId,
      date: checkDate,
      status: status ? 'vacanted' : 'occupated',
    };
  }

  @Post('loading-report')
  @ApiTags('car-rent')
  @ApiOperation({ summary: 'отчёт средней загрузки автомобилей за месяц' })
  @ApiResponse({
    status: 200,
    description: 'отчёт средней загрузки автомобилей за месяц',
    type: [LoadingCarView],
  })
  @ApiBody({
    type: LoadingReportDto,
    description: 'Фильтр',
  })
  @HttpCode(200)
  loadingReport(@Body() data: LoadingReportDto) {
    const carId = data?.carId ?? null;
    return this.carsRentService.getAvgLoadCars(carId);
  }
}
