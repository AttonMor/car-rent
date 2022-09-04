import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DBService } from './db.service';

const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    user: configService.get('PG_USER'),
    host: configService.get('PG_HOST'),
    database: configService.get('PG_DB'),
    password: configService.get('PG_PASS'),
    port: configService.get('PG_PORT'),
  });
};

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: databasePoolFactory,
    },
    DBService,
  ],
  exports: [DBService],
})
export class DbModule {}
