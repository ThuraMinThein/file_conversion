import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './typeorm.config';
import { GoogleDocsService } from './services/google-drive.service';
import { CloudinaryService } from './services/cloudinary.service';
import { Certificate } from './entities/certificate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleDocsService, CloudinaryService],
})
export class AppModule {}
