import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ScoreService } from './score.service';
import { UserScoreDto } from './dtos/userScore.dto';

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
      throw new NotFoundException('Khong tim thay du lieu');
    }
    return data;
  }

  @Get('analyze/:subject')
  async analyzeScores(@Param('subject') subject: string) {
    try {
      const validSubjects: (keyof UserScoreDto)[] = [
        'toan',
        'ngu_van',
        'ngoai_ngu',
        'vat_li',
        'hoa_hoc',
        'sinh_hoc',
        'lich_su',
        'dia_li',
        'gdcd',
      ];
      if (!validSubjects.includes(subject as keyof UserScoreDto)) {
        throw new NotFoundException('Subject khong hop le cho viec phan tich');
      }

      const data = await this.scoreService.analyzeScores(
        subject as keyof UserScoreDto,
      );
      return data;
    } catch (error) {
      throw new NotFoundException('Subject khong hop le cho viec phan tich');
    }
  }

  @Get(':sbd')
  async getScoreBySbd(@Param('sbd') sbd: string) {
    const data = await this.scoreService.getScoreBySbd(sbd);
    if (!data) {
      throw new NotFoundException('Khong tim thay so bao danh');
    }
    return data;
  }
}
