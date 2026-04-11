import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Case } from '../case/entities/case.entity';
import { CaseStatus } from 'src/common/enums/case-status.enum';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
  ) {}

  async Users(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository.find();
  }

    

  async findAllLawyer(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.LAWYER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'avatar',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      relations: ['lawyerProfile'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'avatar',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.LAWYER) {
      const lawyerWithProfile = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'phone',
          'avatar',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
        relations: ['lawyerProfile'],
      });

      if (!lawyerWithProfile) {
        throw new NotFoundException('Lawyer not found');
      }

      return lawyerWithProfile;
    }

    return user;
  }
  async getLawyerDashboard(lawyerId: number) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ── Client Overview ──────────────────────────────────────────
  const allClients = await this.userRepository
    .createQueryBuilder('user')
    .innerJoin('user.casesAsClient', 'case')
    .where('case.lawyerId = :lawyerId', { lawyerId })
    .select(['user.id', 'user.isActive', 'user.createdAt'])
    .distinct(true)
    .getMany();

  const totalClients = allClients.length;
  const activeClients = allClients.filter((u) => u.isActive).length;
  const inactiveClients = totalClients - activeClients;
  const newClientsThisMonth = allClients.filter(
    (u) => new Date(u.createdAt) >= startOfMonth,
  ).length;

  // ── Case Summary ─────────────────────────────────────────────
  const cases = await this.caseRepository.find({
    where: { lawyerId },
    select: ['id', 'status', 'nextHearing'],
  });

  const totalCases = cases.length;

  // 👇 updated to match your actual CaseStatus enum
  const pendingCases   = cases.filter((c) => c.status === CaseStatus.PENDING).length;
  const inProgressCases = cases.filter((c) => c.status === CaseStatus.IN_PROGRESS).length;
  const underReviewCases = cases.filter((c) => c.status === CaseStatus.UNDER_REVIEW).length;
  const resolvedCases  = cases.filter((c) => c.status === CaseStatus.RESOLVED).length;
  const closedCases    = cases.filter((c) => c.status === CaseStatus.CLOSED).length;

  const upcomingDeadlines = cases
    .filter((c) => c.nextHearing && new Date(c.nextHearing) >= now)
    .sort((a, b) => new Date(a.nextHearing).getTime() - new Date(b.nextHearing).getTime())
    .slice(0, 5)
    .map((c) => ({ caseId: c.id, nextHearing: c.nextHearing, status: c.status }));

  return {
    clientOverview: {
      totalClients,
      newClientsThisMonth,
      activeClients,
      inactiveClients,
    },
    caseSummary: {
      totalCases,
      byStatus: {
        pending: pendingCases,
        inProgress: inProgressCases,
        underReview: underReviewCases,
        resolved: resolvedCases,
        closed: closedCases,
      },
      upcomingDeadlines,
    },
  };
}

async getClientDashboard(clientId: number) {
  const now = new Date();

  // ── Cases ─────────────────────────────────────────────────────
  const cases = await this.caseRepository.find({
    where: { clientId },
    select: ['id', 'title', 'status', 'caseType', 'nextHearing', 'createdAt'],
    relations: ['lawyer', 'lawyer.lawyerProfile'],
  });

  const totalCases = cases.length;
  const pendingCases    = cases.filter((c) => c.status === CaseStatus.PENDING).length;
  const inProgressCases = cases.filter((c) => c.status === CaseStatus.IN_PROGRESS).length;
  const underReviewCases = cases.filter((c) => c.status === CaseStatus.UNDER_REVIEW).length;
  const resolvedCases   = cases.filter((c) => c.status === CaseStatus.RESOLVED).length;
  const closedCases     = cases.filter((c) => c.status === CaseStatus.CLOSED).length;

  // ── Assigned Lawyer (from latest case) ───────────────────────
  const latestCaseWithLawyer = cases
    .filter((c) => c.lawyer)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const assignedLawyer = latestCaseWithLawyer
    ? {
        id: latestCaseWithLawyer.lawyer.id,
        firstName: latestCaseWithLawyer.lawyer.firstName,
        lastName: latestCaseWithLawyer.lawyer.lastName,
        email: latestCaseWithLawyer.lawyer.email,
        phone: latestCaseWithLawyer.lawyer.phone,
        avatar: latestCaseWithLawyer.lawyer.avatar,
        specializations: latestCaseWithLawyer.lawyer.lawyerProfile?.specializations ?? [],
        experience: latestCaseWithLawyer.lawyer.lawyerProfile?.experience ?? null,
        successRate: latestCaseWithLawyer.lawyer.lawyerProfile?.successRate ?? null,
      }
    : null;

  // ── Upcoming Hearings ─────────────────────────────────────────
  const upcomingHearings = cases
    .filter((c) => c.nextHearing && new Date(c.nextHearing) >= now)
    .sort((a, b) => new Date(a.nextHearing).getTime() - new Date(b.nextHearing).getTime())
    .slice(0, 5)
    .map((c) => ({
      caseId: c.id,
      title: c.title,
      nextHearing: c.nextHearing,
      status: c.status,
    }));

  // ── Recent Cases ──────────────────────────────────────────────
  const recentCases = cases
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((c) => ({
      caseId: c.id,
      title: c.title,
      caseType: c.caseType,
      status: c.status,
      createdAt: c.createdAt,
    }));

  return {
    caseOverview: {
      totalCases,
      byStatus: {
        pending: pendingCases,
        inProgress: inProgressCases,
        underReview: underReviewCases,
        resolved: resolvedCases,
        closed: closedCases,
      },
    },
    assignedLawyer,
    upcomingHearings,
    recentCases,
  };
}
}
