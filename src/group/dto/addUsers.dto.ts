import { IsArray, IsString } from 'class-validator';

export class AddUsersToGroupDto {
    @IsString()
    groupId: string;

    @IsString()
    userId: string;
}
