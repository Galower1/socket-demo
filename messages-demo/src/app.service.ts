import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private users: string[];
  constructor() {
    this.users = [];
  }

  getContacts() {
    return this.users;
  }

  addContact(userId: string) {
    this.users.push(userId);
    return this.users;
  }

  removeContact(id) {
    this.users = this.users.filter((userId) => userId !== id);
  }
}
