import { PartialType } from "@nestjs/mapped-types";
import { CreateAttendanceDto } from "./createAttendence.dto";

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto){}