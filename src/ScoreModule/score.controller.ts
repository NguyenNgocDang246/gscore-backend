import { Controller, Get } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('count/all')
  async countAll(): Promise<number> {
    return await this.scoreService.countAll();
  }
}
