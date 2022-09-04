import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { CarController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [DbModule],
  controllers: [CarController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
