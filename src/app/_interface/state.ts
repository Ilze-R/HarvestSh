import { DataState } from '../_enum/datastate.enum';

export interface State<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
