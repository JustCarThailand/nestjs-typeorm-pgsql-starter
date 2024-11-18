import * as Joi from 'joi';

export const ValidateEnvSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().positive().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_LOGGING: Joi.string().required(),
  APP_PORT: Joi.number().positive().required(),
  APP_BCRYPT_ITER: Joi.number().positive().required(),
  APP_JWT_SECRET: Joi.string().required(),
  APP_JWT_EXPIRATION: Joi.number().positive().required(),
});
