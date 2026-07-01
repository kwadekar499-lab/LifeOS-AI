import { Module } from '@nestjs/common';
import { ToolExecutionController } from './controllers/tool-execution.controller';
import { ToolExecutionService } from './services/tool-execution.service';
import { ToolExecutorService } from './executor/tool-executor.service';
import { ToolDispatcherService } from './dispatcher/tool-dispatcher.service';
import { PermissionValidatorService } from './services/permission-validator.service';
import { ExecutionLoggerService } from './services/execution-logger.service';
import { ToolExecutionHistoryService } from './services/tool-execution-history.service';
import { ToolRegistry } from '../registry/tool-registry';

@Module({
  controllers: [ToolExecutionController],
  providers: [
    ToolExecutionService,
    ToolExecutorService,
    ToolDispatcherService,
    PermissionValidatorService,
    ExecutionLoggerService,
    ToolExecutionHistoryService,
    ToolRegistry,
  ],
  exports: [ToolExecutionService, ToolExecutorService, ToolDispatcherService],
})
export class ToolExecutionModule {}
