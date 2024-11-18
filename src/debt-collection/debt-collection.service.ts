import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtCollection } from 'src/entities/debt-collection.entity';
import { FollowStatus } from 'src/entities/follow-status.entity';
import { Between, ILike, In, Repository } from 'typeorm';
import { CreateDebtCollectionDto } from './dto/create-debt-collection.dto';
import { FileUpload } from 'src/entities/file-upload.entity';
import { GetDebtCollectionDto } from './dto/get-collection.dto';
import { UpdateDebtCollectionDto } from './dto/update-debt-collection.dto';
import { GetDashboardDto } from './dto/get-dashboard.dto';

@Injectable()
export class DebtCollectionService {
  constructor(
    @InjectRepository(DebtCollection)
    private readonly debtCollectionRepo: Repository<DebtCollection>,
    @InjectRepository(FollowStatus)
    private readonly followStatusRepo: Repository<FollowStatus>,
    @InjectRepository(FileUpload)
    private readonly fileUploadRepo: Repository<FileUpload>
  ) {}

  async create(data: CreateDebtCollectionDto): Promise<DebtCollection> {
    // Get Debt Follow Status
    const getFollowStatus = await this.followStatusRepo.findOne({
      where: {
        id: data.followStatusId,
      },
    });

    if (!getFollowStatus) {
      throw new BadRequestException();
    }

    // const getFileUpload = await this.fileUploadRepo.findBy({ id: In(data.fileId) });

    const debtCollection = this.debtCollectionRepo.create({
      caseId: `${Date.now()}`,
      jobCode: data.jobCode,
      followerName: data.followerName,
      followDate: data.followDate,
      borrowerFullName: data.borrowerFullName,
      followChannel: data.followChannel,
      latestPhoneNumber: data.latestPhoneNumber,
      followDescription: data.followDescription,
      // fileUpload: getFileUpload,
      statuses: getFollowStatus,
      lat: data.lat,
      lng: data.lng,
    });
    return this.debtCollectionRepo.save(debtCollection);
  }

  async findAll(filter: GetDebtCollectionDto) {
    const [collection, count] = await this.debtCollectionRepo.findAndCount({
      where: {
        borrowerFullName: filter.borrowerFullName
          ? ILike(`%${filter.borrowerFullName}%`)
          : undefined,
        followerName: filter.followerName ? ILike(`%${filter.followerName}%`) : undefined,
        jobCode: filter.jobCode ? ILike(`%${filter.jobCode}%`) : undefined,
        caseId: filter.caseId ? ILike(`%${filter.caseId}%`) : undefined,
        statuses: {
          id: filter.statuses && filter.statuses.length > 0 ? In(filter.statuses) : undefined,
        },
        followDate:
          filter.fromFollowDate && filter.toFollowDate
            ? Between(filter.fromFollowDate, filter.toFollowDate)
            : undefined,
      },
      relations: { fileUpload: true, statuses: true },
      order: { createdAt: filter.sort_order },
      skip: (filter.page - 1) * filter.page_size,
      take: filter.page_size,
    });
    return {
      items: collection,
      page: filter.page,
      take: filter.page_size,
      item_count: count,
      page_count: Math.ceil(count / filter.page_size),
      has_previous: filter.page > 1,
      has_next: filter.page < Math.ceil(count / filter.page_size),
    };
  }

  async findOne(id: number, jobCode?: string): Promise<DebtCollection> {
    const whereClause = jobCode ? { id, jobCode } : { id };

    const debtCollection = await this.debtCollectionRepo.findOne({
      where: whereClause,
      relations: { fileUpload: true, statuses: true },
    });

    if (!debtCollection) {
      throw new NotFoundException('DebtCollection not found');
    }

    return debtCollection;
  }

  async findFollowStatus() {
    return await this.followStatusRepo.find({});
  }

  async update(id: number, data: UpdateDebtCollectionDto): Promise<DebtCollection> {
    // Get Debt Follow Status
    const getFollowStatus = await this.followStatusRepo.findOne({
      where: {
        id: data.followStatusId,
      },
    });

    if (!getFollowStatus) {
      throw new BadRequestException();
    }

    const update = await this.debtCollectionRepo.update(id, {
      followerName: data.followerName,
      followDate: data.followDate,
      borrowerFullName: data.borrowerFullName,
      followChannel: data.followChannel,
      latestPhoneNumber: data.latestPhoneNumber,
      followDescription: data.followDescription,
      statuses: getFollowStatus,
    });

    return this.debtCollectionRepo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    const result = await this.debtCollectionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('DebtCollection not found');
    }
  }

  async getFollowerDashboard(getDashboardDto: GetDashboardDto) {
    const fromDate = getDashboardDto.from_date;
    const toDate = getDashboardDto.to_date;

    const debtCollection = await this.debtCollectionRepo
      .createQueryBuilder('debt_collection')
      .select('follower_name')
      .addSelect('COUNT(follower_name)', 'count')
      .where('statuses_id = :statusId', { statusId: 1 })
      .andWhere('follow_date BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .orderBy('follower_name')
      .groupBy('follower_name')
      .getRawMany();

    const followerName = [];
    const count = [];

    for (let item of debtCollection) {
      followerName.push(item.follower_name);
      count.push(item.count);
    }

    const response = {
      labels: followerName,
      datasets: [
        {
          data: count,
          label: 'จำนวน',
          backgroundColor: '#4086F4',
          stack: 'Total',
        },
      ],
    };
    return response;
  }
}
