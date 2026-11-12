import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReggisterDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {

    }

    @Post('register')
    register (@Body() registerPayload: ReggisterDto) {
        return this.authService.register(registerPayload);

    }

    @Post("login")
    login (@Body() loginPayload: LoginUserDto) {
        return this.authService.login(loginPayload);
    }
}
