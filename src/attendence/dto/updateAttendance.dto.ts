import { Type } from 'class-transformer';
import { IsArray, IsString, ArrayNotEmpty, IsBoolean, IsNumber, IsInt } from 'class-validator';

export class UpdateAttendanceDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsInt()
  @Type(() => Number)
  lessonNumber: number;

  @IsArray()
  @IsBoolean({ each: true })
  attendanceStatuses: boolean[];
}