export interface User {
    id: number; // django default user model
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    last_login?: string;
  }
  