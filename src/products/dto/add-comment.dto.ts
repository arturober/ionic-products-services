import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class AddCommentDto {
    @IsString()
    readonly text: string;

    product = null;
    user = null;
}
