export interface PromptSection {
  readonly name: string;
  readonly content: string;
  readonly order: number;
  readonly tokenEstimate: number;
  readonly characterCount: number;
}
