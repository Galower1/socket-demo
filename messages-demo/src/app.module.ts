import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageGateway } from './messages/messages.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MessageGateway],
})
export class AppModule {}
