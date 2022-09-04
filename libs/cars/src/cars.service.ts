import { Injectable } from '@nestjs/common';
import { DBService } from '@app/db/db.service';
import { Car } from '@app/entities';

@Injectable()
export class CarsService {
  constructor(private readonly dbService: DBService) {}

  async getById(id: string): Promise<Car | null> {
    const car = await this.dbService.executeQuery(
      `SELECT id from cars where id = $1`,
      [id],
    );
    return car.length > 0 ? car[0] : null;
  }

  async getAllCars(): Promise<Car[]> {
    return await this.dbService.executeQuery(`SELECT id, number FROM cars`);
  }
}
