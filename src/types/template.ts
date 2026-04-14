export interface TemplateSchema {
  category: string;
  templateId: string;
  prompt?: string;
  styleMode?: string;
  editableData: Record<string, any>;
  metadata?: Record<string, any>;
}