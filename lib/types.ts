// lib/types.ts
export interface Voter {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  nominees: Nominee[];
  order: number;
  isSpecial?: boolean;     // Categoría Especial — premiación directa sin votación pública
  directWinner?: string;  // Nombre del ganador asignado por el admin
}

export interface Nominee {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Vote {
  id: string;
  voterId: string;
  categoryId: string;
  nomineeId: string;
  createdAt: Date;
}

export interface VoterSession {
  voter: Voter;
  votes: Vote[];
  hasVotedForCategory: (categoryId: string) => boolean;
}