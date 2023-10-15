import { DataState } from '../_enum/datastate.enum';
import { Events } from './event';
import { Role } from './role';
import { User } from './user';

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
}

export interface CustomHttpResponse<T> {
  timestamp: Date;
  statusCode: number;
  status: string;
  message: string;
  reason?: string;
  developerMessage?: string;
  data?: T;
}

export interface Profile {
  user: User;
  events?: Events[];
  likedGardeningPosts: [];
  likedRecipePosts: [];
  likedIMadePosts: [];
  likedOtherPosts: [];
  roles?: Role[];
  access_token?: string;
  refresh_token?: string;
}
export interface Pagination<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface RegisterAndResetState {
  dataState: DataState;
  registerSuccess?: boolean;
  error?: string;
  message?: string;
}

export type AccountType = 'account' | 'password';

export interface VerifyState {
  dataState: DataState;
  verifySuccess?: boolean;
  error?: string;
  message?: string;
  title?: string;
  type?: AccountType;
}
