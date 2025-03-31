import { AbstractRepository } from 'mini-instagram-packages';
import { Account } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class AccountCommandRepository extends AbstractRepository<Account> {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
  ) {
    super(accountModel);
  }
}
