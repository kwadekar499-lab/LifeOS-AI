import { Module } from '@nestjs/common';
import { ToolRegistry } from './registry/tool-registry';
import { ToolValidator } from './validators/tool-validator';
import { ToolLoggerService } from './services/tool-logger.service';
import { BuiltInToolsService } from './services/built-in-tools.service';
import { ToolRegistryController } from './controllers/tool-registry.controller';
import { ToolExecutionController } from './controllers/tool-execution.controller';
import { ToolExecutionModule } from './execution/execution.module';

@Module({
  imports: [ToolExecutionModule],
  controllers: [ToolRegistryController, ToolExecutionController],
  providers: [ToolRegistry, ToolValidator, ToolLoggerService, BuiltInToolsService],
  exports: [ToolRegistry, ToolValidator, ToolLoggerService, ToolExecutionModule],
})
export class ToolsModule {}
