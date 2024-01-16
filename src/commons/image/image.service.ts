import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  public saveImage(photo: string): Promise<string> {
    const data = photo.split(',')[1] || photo;
    return new Promise((resolve, reject) => {
      const filePath = path.join('img', `${Date.now()}.png`);
      fs.writeFile(filePath, data, { encoding: 'base64' }, err => {
        if (err) { reject(err); }
        resolve(filePath);
      });
    });
  }
}
