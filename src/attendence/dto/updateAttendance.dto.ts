export class UpdateAttendanceDto {
    userIds: string[];
    lessonNumberId: string;
    attendanceStatuses: boolean[]; // Массив статусов для каждого пользователя
}
