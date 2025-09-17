import { IsArray } from 'class-validator';

export class DeleteAttendanceDto {
    @IsArray()
    ids: string[];
}
