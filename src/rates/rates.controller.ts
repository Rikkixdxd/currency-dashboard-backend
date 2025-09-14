import { Controller, Get, Param } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller()
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get('/rates/:code')
  async getRateByCode(@Param('code') code: string) {
    return this.ratesService.getRateByCode(code);
  }

  @Get('/rates')
  async getPopularRates() {
    return this.ratesService.getPopularRates();
  }
}
