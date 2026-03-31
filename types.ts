
export interface Section {
  id: number;
  title: string;
  text: string;
  visual_hint: string;
}

export interface FormData {
  purpose: string;
  architecture_type: string;
  layout_flow: string;
  visual_element: string;
  color_palette: string;
  title: string;
  subtitle: string;
  main_subject: string;
  main_attribute: string;
  sections: Section[];
  enable_timeline: boolean;
  enable_map: boolean;
  enable_factbox: boolean;
  enable_statistics: boolean;
  enable_quote: boolean;
  enable_qr_code: boolean;
  enable_carousel: boolean;
  enable_face_fix: boolean;
  enable_veo: boolean;
  sources: string;
  brand_url: string;
  instagram: string;
  whatsapp: string;
  facebook: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  name: string;
  data: FormData;
  visualStyle: string;
  aspectRatio: string;
}

export interface Preset {
  id: string;
  label: string;
  description: string;
  data?: Partial<FormData>;
  visualStyle?: string;
  aspectRatio?: string;
}
