import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

import { UserScore, UserScoreDocument } from './schemas/userScore.schema';

@Injectable()
export class ScoreSeeder implements OnModuleInit {
  private readonly batchSize = 1000;
  constructor(
    @InjectModel('UserScore')
    private userScoreModel: Model<UserScoreDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.userScoreModel.countDocuments();
    if (count > 0) {
      return;
    }

    const csvPath = path.join(process.cwd(), 'rawData/diem_thi_thpt_2024.csv');
    let scores: UserScore[] = [];
    let inserted = 0;
    await this.userScoreModel.deleteMany({});

    console.log('Seeding scores from CSV...');
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row: UserScore) => {
          scores.push(row);
          if (scores.length >= this.batchSize) {
            this.userScoreModel.insertMany(scores, { ordered: false });
            inserted += scores.length;
            scores = [];
            console.log(`Inserted ${inserted} scores`);
          }
        })
        .on('end', async () => {
          if (scores.length > 0) {
            await this.userScoreModel.insertMany(scores, { ordered: false });
            inserted += scores.length;
          }
          resolve();
          console.log(`Inserted ${inserted} scores`);
        })
        .on('error', (err) => reject(err));
    });
  }
}
