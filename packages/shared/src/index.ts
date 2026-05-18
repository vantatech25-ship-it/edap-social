export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

// Additional shared types will go here
