import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateProductDto {
    @IsString()
    readonly description: string;

    @IsString()
    imageUrl: string;

    @IsNumber()
    price: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating: number;

    creator = null;
}
