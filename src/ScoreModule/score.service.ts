import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserScore, UserScoreSchema } from './schemas/userScore.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(UserScore.name) private userScoreModel: Model<UserScore>,
  ) {}
  async countAll(): Promise<number> {
    return await this.userScoreModel.countDocuments();
  }
}
