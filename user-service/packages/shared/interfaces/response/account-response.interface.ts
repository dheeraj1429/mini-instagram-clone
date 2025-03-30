import { GenericException } from '../../exceptions/base-exception';

export type CreateAccountResponseInterface = GenericException<{
  readonly userId: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly accessToken: string;
  readonly refreshToken: string;
}>;
