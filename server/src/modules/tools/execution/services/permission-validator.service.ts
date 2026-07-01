import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PermissionValidatorService {
  private readonly logger = new Logger(PermissionValidatorService.name);

  async validate(userId: string, toolName: string, _params: Record<string, unknown>): Promise<boolean> {
    this.logger.log({ userId, toolName, action: 'validate' });
    return true;
  }
}
