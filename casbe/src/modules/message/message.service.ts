import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Case } from '../case/entities/case.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
  ) {}

  async create(createMessageDto: CreateMessageDto, currentUser: User) {
    const caseEntity = await this.caseRepository.findOne({
      where: { id: createMessageDto.caseId },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.id !== caseEntity.clientId &&
      currentUser.id !== caseEntity.lawyerId
    ) {
      throw new ForbiddenException(
        'You do not have permission to send messages for this case',
      );
    }

    if (
      createMessageDto.receiverId !== caseEntity.lawyerId &&
      createMessageDto.receiverId !== caseEntity.clientId
    ) {
      throw new ForbiddenException('Invalid receiver');
    }

    const message = this.messageRepository.create({
      ...createMessageDto,
      senderId: currentUser.id,
    });

    const savedMessage = await this.messageRepository.save(message);

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'receiver', 'case'],
    });
  }

  async findUnreadCount(userId: number) {
    const count = await this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
    return { unreadCount: count };
  }
}
