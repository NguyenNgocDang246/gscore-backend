import { Injectable } from '@nestjs/common';

@Injectable()
export class ScoreService {
  getHello(): string {
    return 'Hello World!';
  }
}
