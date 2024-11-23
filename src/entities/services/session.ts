import { IRequiredDataDForBooking } from 'entities/rules/user';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    dataRequiredForBooking?: IRequiredDataDForBooking|any
  }
}