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

  //anilist graphql endpoint
  ANILIST_GRAPHQL_ENDPOINT: Joi.string().default('https://graphql.anilist.co'),
});
