import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';
import { CarsRentService } from './cars-rent.service';
import { TARIFFS } from './constants';

describe('CarsRentService', () => {
  let service: CarsRentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsRentService],
    }).compile();

    service = module.get<CarsRentService>(CarsRentService);
  });

  describe('calculate cost rent', () => {
    it('Must have a rental amount of 4950 for 5 days', async () => {
      const result = await service.calculateCostRent(5, TARIFFS);
      expect(result).toBe(4950);
    });
    it('Must have a rental amount of 9650 for 10 days', async () => {
      const result = await service.calculateCostRent(10, TARIFFS);
      expect(result).toBe(9650);
    });
    it('Must have a rental amount of 14150 for 15 days', async () => {
      const result = await service.calculateCostRent(15, TARIFFS);
      expect(result).toBe(14150);
    });

    it('Must have a rental amount of 18500 for 20 days', async () => {
      const result = await service.calculateCostRent(20, TARIFFS);
      expect(result).toBe(18500);
    });

    it('Must have a rental amount of 26150 for 29 days', async () => {
      const result = await service.calculateCostRent(29, TARIFFS);
      expect(result).toBe(26150);
    });
  });

  describe('calculate number of rental days', () => {
    it('should be 8 days', () => {
      const from = moment('2022-09-01 12:00:00');
      const to = moment('2022-09-10 11:00:00');
      const result = service.calculateNumberOfRentalDays(from, to);
      expect(result).toBe(8);
    });

    it('should be 10 days', () => {
      const from = moment('2022-09-01 00:00:00');
      const to = moment('2022-09-11 00:00:00');
      const resut = service.calculateNumberOfRentalDays(from, to);
      expect(resut).toBe(10);
    });

    it('should be 29 days', () => {
      const from = moment('2022-09-01 00:00:00');
      const to = moment('2022-09-30 00:00:00');
      const resut = service.calculateNumberOfRentalDays(from, to);
      expect(resut).toBe(29);
    });

    it('should be 30 days', () => {
      const from = moment('2022-09-01 00:00:00');
      const to = moment('2022-10-01 00:00:00');
      const resut = service.calculateNumberOfRentalDays(from, to);
      expect(resut).toBe(30);
    });
  });

  describe('check maximum rental period', () => {
    it('should be true, NumberOfRentalDays: 15', () => {
      const result = service.checkMaxRentalPeriod(15, 30);
      expect(result).toBe(true);
    });
    it('should be true, NumberOfRentalDays: 28', () => {
      const result = service.checkMaxRentalPeriod(28, 30);
      expect(result).toBe(true);
    });
    it('should be true, , NumberOfRentalDays: 29', () => {
      const result = service.checkMaxRentalPeriod(29, 30);
      expect(result).toBe(false);
    });
  });

  describe('check day off', () => {
    it('should be true, is Monday', () => {
      const day = moment('2022-09-05 00:00:00');
      const result = service.checkDayOff(day);
      expect(result).toBe(true);
    });
    it('should be true, is Friday', () => {
      const day = moment('2022-09-02 00:00:00');
      const result = service.checkDayOff(day);
      expect(result).toBe(true);
    });
    it('should be false, is Saturday', () => {
      const day = moment('2022-09-03 00:00:00');
      const result = service.checkDayOff(day);
      expect(result).toBe(false);
    });
    it('should be false, is Sunday', () => {
      const day = moment('2022-09-04 00:00:00');
      const result = service.checkDayOff(day);
      expect(result).toBe(false);
    });
  });
});
