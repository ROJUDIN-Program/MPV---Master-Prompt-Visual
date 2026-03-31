import type { FormData } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  formData: Partial<FormData>;
  visualStyle: string;
  aspectRatio: string;
  thumbnail: string;
}

export const TEMPLATES: Template[] = [];
