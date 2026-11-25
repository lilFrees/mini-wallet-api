import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signup({ email, name, password }: SignupDto) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      email,
      name,
      passwordHash,
    });

    return { access: this.signToken(newUser) };
  }

  async validateUser({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const [salt, storedHash] = user.passwordHash.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    console.log(hash.toString('hex'), storedHash);
    if (storedHash !== hash.toString('hex')) {
      return null;
    }

    return this.signToken(user);
  }

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  private signToken(user: User) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
