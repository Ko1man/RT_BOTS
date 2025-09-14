import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateNewsDto } from "./create-news.dto";

export class UpdateNewsDto extends PartialType(CreateNewsDto){}