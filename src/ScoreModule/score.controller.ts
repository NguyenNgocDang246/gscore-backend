import { Controller, Get } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('all')
  getHello(): string {
    return this.scoreService.getHello();
  }
}
