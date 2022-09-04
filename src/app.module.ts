import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from '@app/db/db.module';

import { configuration } from './configuration';
import { validationSchema } from './validation';
import { CarsModule } from 'libs/cars/src';
import { CarsRentModule } from '@app/cars-rent';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    DbModule,
    CarsModule,
    CarsRentModule,
  ],
})
export class AppModule {}
