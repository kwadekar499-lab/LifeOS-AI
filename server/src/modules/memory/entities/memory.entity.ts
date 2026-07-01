export class MemoryEntity {
  id!: string;
  userId!: string;
  title!: string;
  content!: string;
  category!: string;
  importance!: number;
  tags!: string[];
  source!: string;
  metadata!: Record<string, unknown> | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
