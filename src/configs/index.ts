import { registerAs } from '@nestjs/config';

export const TriggerConfig = registerAs('trigger', () => ({
  secret: process.env.TRIGGER_SECRET_KEY,
}));
