export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CUSTOMER';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}