import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field({ description: 'Username' })
  @MaxLength(50)
  username: string;

  @Field({ description: 'Password' })
  @MinLength(7)
  password: string;
}
