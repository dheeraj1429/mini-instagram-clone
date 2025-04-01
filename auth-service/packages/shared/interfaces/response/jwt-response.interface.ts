import { GenericException } from '../../exceptions/base-exception';

export type GenerateTokenResponse = GenericException<{
  token: string;
}>;
