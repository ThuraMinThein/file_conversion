import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as stream from 'stream';

@Injectable()
export class GoogleDocsService {
  private driveService;

  constructor() {
    const credentials = JSON.parse(
      fs.readFileSync('credentials.json', 'utf-8'),
    );
    const client_id = credentials.web.client_id;
    const redirect_uris = credentials.web.redirect_uris;
    const client_secret = credentials.web.client_secret;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[1],
    );
    // const token = JSON.parse(fs.readFileSync('token.json', 'utf-8'));
    oAuth2Client.setCredentials({
      access_token:
        'ya29.a0AcM612x0bJ1_Z4061Ager_zwQ9IHOTCMkj3WDzdzyT7dCJNOGNlBjRTq8XzEph23vJKN8sPPQgQDmeyXuqIfRUJY-J3Yr5_O7FbRZX15gRFIAOK6ZfcUj8t7vYhvx4XAViPd7dl3RuNYSuKrH3vbPo4kJb9kJf6fZtAiUYIraCgYKAZgSARASFQHGX2Mi554gLZIQX8ms8Xit5H9Zqg0175',
      refresh_token:
        '1//0gjExda-OH9WmCgYIARAAGBASNwF-L9Ir4kFmrJT8IWmYGkspvw1bDyDeP4kgBNS6QMOJQuyZ7uEJ9T_Vg-4FAHOV68P8jSCHBkA',
      scope:
        'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
      token_type: 'Bearer',
    });

    this.driveService = google.drive({ version: 'v3', auth: oAuth2Client });
  }

  async convertDocToPdf(fileBufferr: Buffer): Promise<Buffer> {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBufferr);
    try {
      // Upload the Word file to Google Drive
      const fileMetadata = {
        name: 'ConvertedDoc',
        mimeType: 'application/vnd.google-apps.document',
      };
      const media = {
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        body: bufferStream,
      };

      const file = await this.driveService.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
      });
      const fileId = file.data.id;

      // Export the file as PDF
      const pdfExport = await this.driveService.files.export(
        { fileId, mimeType: 'application/pdf' },
        { responseType: 'arraybuffer' },
      );

      // Clean up by deleting the file
      await this.driveService.files.delete({ fileId });

      return Buffer.from(pdfExport.data);
    } catch (error) {
      console.error('Error converting document to PDF:', error);
      throw new Error('Failed to convert document to PDF');
    }
  }
}
