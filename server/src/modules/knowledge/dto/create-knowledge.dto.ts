export class CreateKnowledgeDto {
  title!: string;
  content!: string;
  summary?: string;
  category?: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}
