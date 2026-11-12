import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ReggisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerPayload: ReggisterDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: registerPayload.email,
      },
    });
    if (user) throw new Error('User already exist');

    const hashedPassword = await this.hashPassword(registerPayload.password);
    registerPayload.password = hashedPassword;
    this.userRepository.create({
      email: registerPayload.email,
      name: registerPayload.name,
      password: registerPayload.password,
      role: UserRole.USER,
    });
    const saveUser = await this.userRepository.save(registerPayload);
    const { password, ...result } = saveUser;
    return {
      message: 'Registeration successfully ! please login to continue',
      data: result,
    };
  }

  // create admin
  async createAdmin(registerPayload: ReggisterDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: registerPayload.email,
      },
    });
    if (user) throw new Error('User already exist');

    const hashedPassword = await this.hashPassword(registerPayload.password);
    registerPayload.password = hashedPassword;
    this.userRepository.create({
      email: registerPayload.email,
      name: registerPayload.name,
      password: registerPayload.password,
      role: UserRole.ADMIN,
    });
    const saveUser = await this.userRepository.save(registerPayload);
    const { password, ...result } = saveUser;
    return {
      message: 'Registeration successfully ! please login to continue',
      data: result,
    };
  }

  // login

  async login(loginPayload: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginPayload.email,
      },
    });
    if (!user) throw new Error('User does not exist !');
    const isPasswordMatched = await this.comparePasword(
      loginPayload.password,
      user.password,
    );

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid execption!');
    const token = this.generateToken(user);
    const { password, ...result } = user;

    return {
      message: 'Login successfully !',
      data: {
        user: result,
        ...token,
      },
    };
  }
  async refreshToken(refreshToken: string) {
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: 'refresh_secret',
        })
        const user = await this.userRepository.findOne({
            where: {
                id: payload.sub
            }
        })
        if(!user) throw new UnauthorizedException("Invalid token")
        return await this.generateAccessToken(user);
    
      } catch (error) {
        throw new UnauthorizedException("Invalid token")
      }
  }
  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
  private async comparePasword(
    password: string,
    newPassword: string,
  ): Promise<Boolean> {
    const hashedPassword = await bcrypt.compare(password, newPassword);
    return hashedPassword;
  }

  // generate the token

  private async generateToken(user: User): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.generateAccessToken(user),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      role: user.role,
    },
    {
        expiresIn: '15m',
        secret:'jwt_secret'
    }
);
  }
  private generateRefreshToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      role: user.role,
    }, {
        expiresIn: '7d',
        secret:'refresh_secret'
    });
  }
}
