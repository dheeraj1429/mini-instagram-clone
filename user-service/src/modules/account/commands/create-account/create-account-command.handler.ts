import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { AccountCommandService } from '../../services';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(private readonly accountCommandService: AccountCommandService) {}

  async execute(command: CreateAccountCommand) {
    return this.accountCommandService.createAccount(command.createAccountDto);
  }
}
