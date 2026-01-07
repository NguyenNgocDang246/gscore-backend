import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserScoreDocument = HydratedDocument<UserScore>;

@Schema({ timestamps: true })
export class UserScore {
  @Prop({ required: true })
  sbd: string;

  @Prop()
  toan: number;

  @Prop()
  ngu_van: number;

  @Prop()
  ngoai_ngu: number;

  @Prop()
  vat_li: number;

  @Prop()
  hoa_hoc: number;

  @Prop()
  sinh_hoc: number;

  @Prop()
  lich_su: number;

  @Prop()
  dia_li: number;

  @Prop()
  gdcd: number;

  @Prop()
  ma_ngoai_ngu: string;
}

export const UserScoreSchema = SchemaFactory.createForClass(UserScore);
