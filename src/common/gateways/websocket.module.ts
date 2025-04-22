import { Module } from '@nestjs/common';
import { RealTimeGateway } from './websocket.gateway';

@Module({
  providers: [RealTimeGateway],
  exports: [RealTimeGateway],
})
export class RealTimeGatewayModule {}
