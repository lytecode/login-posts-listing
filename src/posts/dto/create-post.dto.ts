import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsNumber()
    userId: number;
}
