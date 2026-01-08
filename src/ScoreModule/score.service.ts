import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserScore, UserScoreSchema } from './schemas/userScore.schema';
import { UserScoreDto } from './dtos/userScore.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(UserScore.name) private userScoreModel: Model<UserScore>,
  ) {}
  async countAll(): Promise<number> {
    return await this.userScoreModel.countDocuments();
  }
  async getScoreBySbd(sbd: string): Promise<UserScoreDto | null> {
    const data = await this.userScoreModel.findOne({ sbd });
    if (!data) {
      return null;
    }
    return UserScoreDto.parse(data);
  }

  async getTop10GroupA() {
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
    return data.map(UserScoreDto.parse);
  }

  async analyzeScores(subject: keyof UserScoreDto) {
    if (subject === 'sbd' || subject === 'ma_ngoai_ngu') {
      throw new Error('Invalid subject for analysis');
    }
    try {
      const data = await this.userScoreModel.aggregate([
        {
          $project: {
            point: `$${subject}`,
            level: {
              $switch: {
                branches: [
                  { case: { $gte: [`$${subject}`, 8] }, then: 'lv4' },
                  { case: { $gte: [`$${subject}`, 6] }, then: 'lv3' },
                  { case: { $gte: [`$${subject}`, 4] }, then: 'lv2' },
                ],
                default: 'lv1',
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
      return data
        .sort((a, b) => a._id.localeCompare(b._id))
        .map((item) => ({
          label: item._id,
          count: item.count,
        }));
    } catch (error) {
      throw new Error('Aggregation failed');
    }
  }
}
