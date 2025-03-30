import { ICommand } from '@nestjs/cqrs';
import { CreateAccountDto } from '../../dto';

export class CreateAccountCommand implements ICommand {
  constructor(public readonly createAccountDto: CreateAccountDto) {}
}
