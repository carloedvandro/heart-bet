import { AuthTypes } from './auth';
import { ProfileTypes } from './profiles';
import { BetTypes } from './bets';
import { PaymentTypes } from './payments';

export type Database = {
  public: ProfileTypes & BetTypes & PaymentTypes;
  auth: AuthTypes;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];