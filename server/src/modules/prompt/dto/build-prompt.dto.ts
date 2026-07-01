import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class BuildPromptDto {
  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsString()
  assistantIdentity?: string;

  @IsOptional()
  @IsString()
  userProfile?: string;

  @IsOptional()
  @IsString()
  conversationSummary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conversationHistory?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantMemories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantTasks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantKnowledge?: string[];

  @IsOptional()
  @IsString()
  activeProject?: string;

  @IsOptional()
  @IsString()
  userPrompt?: string;

  @IsOptional()
  @IsString()
  outputInstructions?: string;

  @IsOptional()
  @IsUUID()
  requestId?: string;

  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
