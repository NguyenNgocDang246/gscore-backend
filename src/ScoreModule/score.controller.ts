import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreSubject, UserScoreDto } from './dtos/userScore.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('count/all')
  async countAll(): Promise<number> {
    return await this.scoreService.countAll();
  }

  @Get('groupA/top10')
  async getTop10GroupA() {
    const data = await this.scoreService.getTop10GroupA();
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }

  @Get('analyze/:subject')
  async analyzeScores(@Param('subject') subject: string) {
    try {
      if (!ScoreSubject.isValid(subject)) {
        throw new NotFoundException('Invalid subject for analysis');
      }

      const data = await this.scoreService.analyzeScores(
        subject,
      );
      return data;
    } catch (error) {
      throw new NotFoundException('Invalid subject for analysis');
    }
  }

  @Get(':sbd')
  async getScoreBySbd(@Param('sbd') sbd: string) {
    const data = await this.scoreService.getScoreBySbd(sbd);
    if (!data) {
      throw new NotFoundException('Registration number not found');
    }
    return data;
  }
}
