export interface ICarRent {
  /**
   * ID
   */
  id: string;

  /**
   * ID машины
   */
  carId: string;

  /**
   * Начало аренды
   */
  from: Date;

  /**
   * Окончание аренды
   */
  to: Date;

  /**
   * Количество дней аренды
   */
  days: number;

  /**
   * Сумма аренды
   */
  cost: number;
}

export interface ICalculateResponse {
  /**
   * ID машины
   */
  carId: string;
  /**
   * Сумма аренда
   */
  cost: number;
  /**
   * Количество дней
   */
  days: number;
  /**
   * Начало аренды
   */
  from: string;
  /**
   * Окончания аренды
   */
  to: string;
}
