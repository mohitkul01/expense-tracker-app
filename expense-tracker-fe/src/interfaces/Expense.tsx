import { Category } from "./Category";
import { User } from "./User";

export interface Expense {
    id?: string; //uuid
    title: string;
    amount: number;
    date: string;
    categoryId?: string;
    category?: Category;
    userId?: number;
    user?: User;
  }