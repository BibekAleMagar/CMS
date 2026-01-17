import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LawyerProfile } from '../user/entities/lawyer-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto, file?: Express.Multer.File) {
    const existingUser = await this.userRepository.findOne({where: {email: registerDto.email}})
    if(existingUser) {
      throw new ConflictException("Email already in use");
    }

    if(registerDto.role === UserRole.LAWYER) {
      if(!registerDto.specializations || !registerDto.experience) {
        throw new BadRequestException("Lawyer registration requires specializations and experience")
      }
    }

    let avatarUrl = "https://imgs.search.brave.com/YKx8-3qRmkv9oeoZmSugrki_AFZEH0qd_t7Qdu649jw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw"
    if(file && file.buffer) {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "avatars",
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file.buffer);
    });
    
    avatarUrl = result.secure_url;
  }
    const hashedPassword = await bcrypt.hash(registerDto.password,10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role,
      avatar: avatarUrl,
      phone: registerDto.phoneNumber,
      isActive: true 
    });

    if(registerDto.role === UserRole.LAWYER) {
      user.lawyerProfile = {
        specializations: registerDto?.specializations!,
        experience: registerDto.experience!,
        successRate: registerDto.successRate ?? 0,
        active: true


      } as LawyerProfile
    }

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
