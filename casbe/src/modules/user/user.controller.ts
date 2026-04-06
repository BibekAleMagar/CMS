import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('user')
// @UseGuards(RolesGuard, JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @Roles(UserRole.SUPER_ADMIN)
  Users() {
    return this.userService.Users();
  }

  @Get('lawyers')
  findAllLawyer() {
    return this.userService.findAllLawyer();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
