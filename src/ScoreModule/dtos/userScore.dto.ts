export class UserScoreDto {
  sbd: string;
  toan?: number;
  ngu_van?: number;
  ngoai_ngu?: number;
  vat_li?: number;
  hoa_hoc?: number;
  sinh_hoc?: number;
  lich_su?: number;
  dia_li?: number;
  gdcd?: number;
  ma_ngoai_ngu?: string;

  static parse(data: any): UserScoreDto {
    const dto = new UserScoreDto();

    dto.sbd = data.sbd;
    dto.toan = data.toan;
    dto.ngu_van = data.ngu_van;
    dto.ngoai_ngu = data.ngoai_ngu;
    dto.vat_li = data.vat_li;
    dto.hoa_hoc = data.hoa_hoc;
    dto.sinh_hoc = data.sinh_hoc;
    dto.lich_su = data.lich_su;
    dto.dia_li = data.dia_li;
    dto.gdcd = data.gdcd;
    dto.ma_ngoai_ngu = data.ma_ngoai_ngu;

    return dto;
  }
}

export class ScoreSubject {
  static readonly validSubjects: (keyof UserScoreDto)[] = [
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

  static isValid(subject: string): subject is keyof UserScoreDto {
    return this.validSubjects.includes(subject as keyof UserScoreDto);
  }
}
