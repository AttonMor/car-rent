import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { Car } from '@app/entities';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarsService) {}

  @Get('/getAll')
  @ApiTags('cars')
  @ApiOperation({ summary: 'Список автомобилей' })
  @ApiResponse({
    status: 200,
    description: 'Получить список всех машин',
    type: [Car],
  })
  getAllCars(): Promise<Car[]> {
    return this.carService.getAllCars();
  }
}
