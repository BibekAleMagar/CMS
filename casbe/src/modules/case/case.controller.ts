import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { CaseService } from './case.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('case')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.LAWYER)
  create(@Body() createCaseDto: CreateCaseDto, @CurrentUser() user:User) {
    return this.caseService.create(createCaseDto, user as any)
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.caseService.findAll(user)
  }

  @Get(":id")
  findOne(@Param("id") id:string) {
    return this.caseService.findOne(+id)
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.caseService.remove(+id, user);
  }


 
}
