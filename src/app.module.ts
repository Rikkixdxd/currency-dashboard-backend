import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [RatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
