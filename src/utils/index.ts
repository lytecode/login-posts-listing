import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string) => hash(password, 12);

export const comparePassword = async (password: string, dbPassword: string) => await compare(password, dbPassword);