import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'certificate_number' })
  certificateNumber: string;

  @Column({ name: 'course_id', nullable: true })
  courseId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'jsonb', name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
