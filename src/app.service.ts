import { Injectable } from '@nestjs/common';
import { useTemplate } from './services/template.service';
import { GoogleDocsService } from './services/google-drive.service';
import { CloudinaryService } from './services/cloudinary.service';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly googleDocsService: GoogleDocsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(courseId: number, wordFile: Express.Multer.File) {
    const certificateNumber = '12345';

    const docxFile = await useTemplate(
      'Thura Min Thein',
      'Software Engineering',
      wordFile,
    );

    const pdfFile = await this.googleDocsService.convertDocToPdf(docxFile);
    // const docxToImage = await this.googleDocsService.convertToImage(docxFile);

    const file: Express.Multer.File = {
      fieldname: 'certificate',
      originalname: `certificate_${certificateNumber}.pdf`,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: pdfFile,
      size: pdfFile?.length,
      stream: null,
      destination: '',
      filename: `certificate_${certificateNumber}.pdf`,
      path: '',
    };

    // const image: Express.Multer.File = {
    //   fieldname: 'certificate',
    //   originalname: `certificate_${certificateNumber}.jpg`,
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: docxToImage,
    //   size: docxToImage?.length,
    //   stream: null,
    //   destination: '',
    //   filename: `certificate_${certificateNumber}.jpg`,
    //   path: '',
    // };
    const pdf = await this.cloudinaryService.fileUpload(file, 'certificates');
    const pdfUrl = pdf.url;

    // const { url } = await this.cloudinaryService.imageUpload(
    //   image,
    //   'certificates',
    // );
    const newUserCertificate = this.certificateRepository.create({
      pdfUrl,
      // imageUrl: url,
      userId: 1,
      courseId,
      certificateNumber,
    });
    return this.certificateRepository.save(newUserCertificate);
  }
}
