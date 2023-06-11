import { IsEmail, IsNotEmpty, IsString } from "class-validator";

//Le class-validator permet de valider les données envoyées par l'utilisateur
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

