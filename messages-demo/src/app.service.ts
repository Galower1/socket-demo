import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getContacts() {
    return ['1234567890', '1234567891', '1234567892'];
  }
}
