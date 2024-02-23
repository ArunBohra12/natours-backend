/**
 * Schema for origins table
 */
export interface Origin {
  id: number;
  origin: string;
  type: 'public' | 'admin';
}
