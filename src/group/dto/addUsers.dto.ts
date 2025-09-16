import { IsArray, IsString } from "class-validator";

export class AddUsersToGroupDto {
    @IsString()
    groupID: string;

    @IsArray()
    userIDs: string[];
}
