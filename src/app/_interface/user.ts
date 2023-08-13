import { Give } from './give';

export interface User {
  id: number;
  username: string;
  email: string;
  imageUrl?: string;
  enabled: boolean;
  isNotLocked: boolean;
  createdAt?: Date;
  roleName: string;
  permission: string;
  give?: Give[];
}
