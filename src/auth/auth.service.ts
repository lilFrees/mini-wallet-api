import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';

const fakeUsers = [{ id: 1, username: 'miles', password: 'spooderman123' }];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser({ password, username }: AuthPayloadDto) {
    const findUser = fakeUsers.find((user) => user.username === username);

    if (!findUser) {
      return null;
    }

    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }

    return null;
  }

  getUser() {}
}
