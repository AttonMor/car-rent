import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  PG_USER: Joi.string().required(),
  PG_PASS: Joi.string().required(),
  PG_HOST: Joi.string().default('localhost'),
  PG_PORT: Joi.number().default(5432),
  PG_DB: Joi.string().required(),
  MAINTENANCE: Joi.number().default(3),
  MAX_RENT: Joi.number().default(30),
});
