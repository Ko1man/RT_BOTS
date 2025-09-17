import { applyDecorators, UseGuards } from "@nestjs/common";
import { CheckStatusGuard } from "src/auth/guards/checkStatus.guard";

export function OnCheck(){
    return applyDecorators(UseGuards(CheckStatusGuard))
}