import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { ScoreSeeder } from './score.seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScore, UserScoreSchema } from './schemas/userScore.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserScore.name, schema: UserScoreSchema },
    ]),
  ],
  controllers: [ScoreController],
  providers: [ScoreService, ScoreSeeder],
})
export class ScoreModule {}
