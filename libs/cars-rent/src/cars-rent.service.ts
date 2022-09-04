import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Moment } from 'moment';

import { CarsService } from '@app/cars';
import { DBService } from '@app/db';
import { ITariff } from './return.interface';
import { CalculateDto } from './dto/calculate.dto';
import {
  RentCar,
  TRentCarShort,
  ICalculateResponse,
  LoadingCarView,
} from '@app/entities';

const BASE_TARIFF = 1000;

@Injectable()
export class CarsRentService {
  constructor(
    private readonly dbService: DBService,
    private readonly carService: CarsService,
  ) {}

  /**
   * Получитиь все аренды
   */
  getAll() {
    try {
      const rows = this.dbService.executeQuery(
        `SELECT id, "carId", cost, days, "from", "to" from "cars-rent"`,
      );
      return rows;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * Создать запись аренды
   * @param data Данные для создания записи
   * @returns ID записи
   */
  async create(data: ICalculateResponse): Promise<RentCar[] | null> {
    try {
      const result = await this.dbService.executeQuery(
        `INSERT INTO public."cars-rent" ("carId", cost, days, "from", "to") VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [data.carId, data.cost, data.days, data.from, data.to],
      );
      return result;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [error.message],
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Проверить статус машины
   * @param carId ID машины
   * @param date Дата проверики
   * @returns False - Занята, true - свободна
   */
  async getCarAvailability(carId: string, date: string) {
    const rows = await this.dbService.executeQuery(
      `SELECT id FROM "cars-rent" WHERE "carId" = $1 AND "from" <= $2 AND "to" >= $2`,
      [carId, date],
    );

    return rows.length ? false : true;
  }

  async getOverlaps(data: CalculateDto): Promise<TRentCarShort | null> {
    const rows = await this.dbService.executeQuery(
      `SELECT id, "carId", "from", "to" FROM "cars-rent"
      WHERE "carId" = $1
      AND ("from", "to") overlaps ($2, $3)`,
      [data.id, data.periodFrom, data.periodTo],
    );

    return rows.length ? rows[0] : null;
  }

  async getCurrentRental(carId: string) {
    const rows = await this.dbService.executeQuery(
      `SELECT id, "carId", cost, days, "from", "to", "to" + interval '3' day as "serviceUpTo" FROM "cars-rent" 
      WHERE "carId" = $1`,
      [carId],
    );

    return rows;
  }

  async getLastRent(
    carId: string,
    date: string,
  ): Promise<TRentCarShort | null> {
    try {
      const rows = await this.dbService.executeQuery(
        `select id, "carId", "from", "to" from "cars-rent"
        where  "carId" = $1
        AND "to" < $2
        ORDER By created DESC
        limit 1`,
        [carId, date],
      );

      return rows.length ? rows[0] : null;
    } catch (error) {
      throw Error(error);
    }
  }

  async getAvgLoadCars(carId: string): Promise<LoadingCarView[] | Error> {
    try {
      let queryText = `SELECT "carId", "carNumber", month, average FROM rent_report_view`;
      const values = [];
      if (carId) {
        queryText += ` WHERE "carId" = $1`;
        values.push(carId);
      }
      const rows = await this.dbService.executeQuery(queryText, values);
      return rows;
    } catch (error) {
      throw Error(error);
    }
  }

  async getCarById(carId: string) {
    const car = await this.carService.getById(carId);
    if (!car) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Машина не найдена'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return car;
  }

  /**
   * Расчитать сумму аренды
   * @param numberRentalDays Количество дней аренды
   * @param tariffs тарифы
   * @returns Сумма аренды
   */
  calculateCostRent(numberRentalDays: number, tariffs: ITariff[]): number {
    let cost = 0;
    let amountOfDays = numberRentalDays;
    let tariffId = 0;

    while (amountOfDays > 0) {
      const { days, discount } = tariffs[tariffId];
      amountOfDays = amountOfDays - days;
      let numberDays = days;
      if (amountOfDays < 0) {
        numberDays = days + amountOfDays;
      }

      cost += numberDays * BASE_TARIFF * (1 - discount / 100);

      tariffId += 1;
    }

    return cost;
  }

  /**
   * Получить колиество дней аренды
   * @param from Начало аренды
   * @param to Окончания аренды
   * @returns Количество дней
   */
  calculateNumberOfRentalDays(from: Moment, to: Moment) {
    const days = moment.duration(to.diff(from)).asDays();
    return Math.floor(days);
  }

  /**
   * Проверить максимальное колиество дней аренды
   * @param NumberOfRentalDays Количество дней аренды
   * @param maxRentalPeriod Максимальное колиество дней аренды
   * @returns
   */
  checkMaxRentalPeriod(NumberOfRentalDays: number, maxRentalPeriod: number) {
    return NumberOfRentalDays < maxRentalPeriod - 1;
  }

  /**
   * Проверить день на выходной
   * @param date Дата
   * @returns
   */
  checkDayOff(date: Moment) {
    const workingDay = [1, 2, 3, 4, 5];
    const dayOfWeek = moment(date).day();
    return workingDay.includes(dayOfWeek);
  }

  /**
   * Проверить машину на обслуживание (перерыв между обслуживанем)
   * @param carId ID машины
   * @param date Начало аренды
   * @returns
   */
  async checkCarForService(carId: string, date: string) {
    const from = moment(date);

    const lastRent = await this.getLastRent(carId, date);
    if (!lastRent) {
      return {
        from: null,
        to: null,
        status: false,
      };
    }
    const serviceTime = moment(lastRent.to).add(3, 'days');
    const status = serviceTime.isAfter(from);

    return {
      from: lastRent.to,
      to: serviceTime,
      status,
    };
  }
}
