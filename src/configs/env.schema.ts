import * as Joi from 'joi';

export const envSchema = Joi.object({
  //database setup
  PG_USERNAME: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_HOST: Joi.string().required(),
  PG_DB: Joi.string().required(),
  PG_PORT: Joi.number().required(),

  //trigger key
  TRIGGER_SECRET_KEY: Joi.string().optional().default(''),
});
