import { CarsModule } from '@app/cars';
import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { CarRentController } from './cars-rent.controller';
import { CarsRentService } from './cars-rent.service';

@Module({
  imports: [DbModule, CarsModule],
  controllers: [CarRentController],
  providers: [CarsRentService],
  exports: [CarsRentService],
})
export class CarsRentModule {}
