import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { DebtCollectionService } from './debt-collection.service';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DebtCollection } from 'src/entities/debt-collection.entity';
import { CreateDebtCollectionDto } from './dto/create-debt-collection.dto';
import { UpdateDebtCollectionDto } from './dto/update-debt-collection.dto';
import { GetDebtCollectionDto } from './dto/get-collection.dto';
import { FollowStatus } from 'src/entities/follow-status.entity';
import { GetDashboardDto } from './dto/get-dashboard.dto';

@Controller('debt-collection')
export class DebtCollectionController {
  constructor(private readonly debtCollectionService: DebtCollectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debt collection entry' })
  async create(@Body() data: CreateDebtCollectionDto): Promise<DebtCollection> {
    return this.debtCollectionService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debt collection entries' })
  async findAll(@Query() getCollectionDto: GetDebtCollectionDto) {
    return this.debtCollectionService.findAll(getCollectionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a debt collection entry by ID and optional job code' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiQuery({ name: 'jobCode', required: false, type: String })
  async findOne(
    @Param('id') id: number,
    @Query('jobCode') jobCode?: string
  ): Promise<DebtCollection> {
    return this.debtCollectionService.findOne(id, jobCode);
  }

  @Get('dropdown/follow-status')
  @ApiOperation({ summary: 'Get all follow status' })
  async findFollowStatus(): Promise<FollowStatus[]> {
    return this.debtCollectionService.findFollowStatus();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a debt collection entry by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id') id: number,
    @Body() data: UpdateDebtCollectionDto
  ): Promise<DebtCollection> {
    return this.debtCollectionService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a debt collection entry by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  async delete(@Param('id') id: number): Promise<void> {
    return this.debtCollectionService.delete(id);
  }

  @Get('/dashboard/follower')
  @ApiOperation({ summary: 'Get follower dashboard' })
  async getFollowerDashboard(@Query() getDashboardDto: GetDashboardDto) {
    return await this.debtCollectionService.getFollowerDashboard(getDashboardDto);
  }
}
