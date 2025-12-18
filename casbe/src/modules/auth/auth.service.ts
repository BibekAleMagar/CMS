import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({where: {email: registerDto.email}})
    if(existingUser) {
      throw new ConflictException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password,10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword
    });

    await this.userRepository.save(user);
    const {password, ...result} = user;
    return ({
      user: result,
      accessToken: this.generateToken(user)
    })
  }

  async Login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({where: {email: loginDto.email}});
    if(!user || !user?.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if(!isPasswordValid){
      throw new UnauthorizedException("Invalid credentials");
    }

    const {password, ...result} = user;
    return ({
      user: result,
      accessToken: this.generateToken(user)
    })

  }

  private generateToken(user: User) {
    const payload = {sub: user.id, email: user.email, role:user.role};
    return this.jwtService.sign(payload)
  }

  async validateUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({where: {id}});
  }
}
