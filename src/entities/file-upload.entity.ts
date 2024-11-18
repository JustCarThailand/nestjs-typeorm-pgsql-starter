import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DebtCollection } from './debt-collection.entity';
import { AbstractEntity } from '@app/common';

@Entity({ name: 'image_upload_entity' })
export class FileUpload extends AbstractEntity<FileUpload> {
  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  filePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DebtCollection, debtCollection => debtCollection.fileUpload, {
    onDelete: 'CASCADE',
  })
  debtCollection: DebtCollection;
}
