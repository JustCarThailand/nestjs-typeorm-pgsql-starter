import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtCollection } from 'src/entities/debt-collection.entity';
import { FileUpload } from 'src/entities/file-upload.entity';
import { Repository } from 'typeorm';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
    @InjectRepository(DebtCollection)
    private readonly debtCollectionRepository: Repository<DebtCollection>
  ) {}

  async uploadFile(
    fileName: string,
    fileType: string,
    debtCollectionId: number
  ): Promise<FileUpload> {
    const filePath = join(__dirname, '..', 'uploads', fileName);

    const debtCollection = await this.debtCollectionRepository.findOne({
      where: { id: debtCollectionId },
    });
    if (!debtCollection) {
      throw new NotFoundException('DebtCollection not found');
    }

    const uploadedFile = this.fileUploadRepository.create({
      fileName: fileName,
      fileType: fileType,
      filePath,
      debtCollection,
    });

    return this.fileUploadRepository.save(uploadedFile);
  }

  async getImage(id: number) {
    return await this.fileUploadRepository.findOne({
      where: { id },
    });
  }

  async deleteImage(id: number) {
    return await this.fileUploadRepository.delete(id);
  }
}
