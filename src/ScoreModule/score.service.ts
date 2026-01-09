import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserScore } from './schemas/userScore.schema';
import { ScoreSubject, UserScoreDto } from './dtos/userScore.dto';
import { CacheService } from 'src/CacheModule/cache.service';

@Injectable()
export class ScoreService {
  private readonly cacheTimeMs = 300000;
  constructor(
    @InjectModel(UserScore.name)
    private userScoreModel: Model<UserScore>,
    private cacheService: CacheService,
  ) {}
  async countAll(): Promise<number> {
    return await this.userScoreModel.countDocuments();
  }
  async getScoreBySbd(sbd: string): Promise<UserScoreDto | null> {
    try {
      const data = await this.userScoreModel.findOne({ sbd });
      if (!data) {
        return null;
      }
      return UserScoreDto.parse(data);
    } catch (error) {
      return null;
    }
  }

  async getTop10GroupA() {
    try {
      const cachedData = this.cacheService.get<UserScoreDto[]>('top10GroupA');
      if (cachedData) {
        return cachedData;
      }
      const data = await this.userScoreModel.aggregate([
        {
          $addFields: {
            avgA00: {
              $add: ['$toan', '$vat_li', '$hoa_hoc'],
            },
          },
        },
        { $sort: { avgA00: -1 } },
        { $limit: 10 },
      ]);
      if (!data) {
        return null;
      }
      const result = data.map(UserScoreDto.parse);

      this.cacheService.set('top10GroupA', result, this.cacheTimeMs);
      return result;
    } catch (error) {
      return null;
    }
  }

  async analyzeScores(subject: string) {
    if (!ScoreSubject.isValid(subject)) {
      throw new Error('Invalid subject for analysis');
    }
    try {
      const cachedData = this.cacheService.get<UserScoreDto[]>(
        `analyzeScores_${subject}`,
      );
      if (cachedData) {
        return cachedData;
      }
      const data = await this.userScoreModel.aggregate([
        {
          $match: {
            [subject]: { $ne: null },
          },
        },
        {
          $project: {
            level: {
              $switch: {
                branches: [
                  { case: { $gte: [`$${subject}`, 8] }, then: 'lv4' },
                  { case: { $gte: [`$${subject}`, 6] }, then: 'lv3' },
                  { case: { $gte: [`$${subject}`, 4] }, then: 'lv2' },
                  { case: { $gte: [`$${subject}`, 0] }, then: 'lv1' },
                ],
                default: 'lv0',
              },
            },
          },
        },
        {
          $group: {
            _id: '$level',
            count: { $sum: 1 },
          },
        },
      ]);
      const result = data
        .filter((x) => x._id !== 'lv0')
        .sort((a, b) => a._id.localeCompare(b._id))
        .map((item) => ({
          label: item._id,
          count: item.count,
        }));

      this.cacheService.set(
        `analyzeScores_${subject}`,
        result,
        this.cacheTimeMs,
      );
      return result;
    } catch (error) {
      throw new Error('Aggregation failed');
    }
  }
}
