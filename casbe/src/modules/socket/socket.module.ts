import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketController } from './socket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SocketController],
  providers: [SocketService],
})
export class SocketModule {}
