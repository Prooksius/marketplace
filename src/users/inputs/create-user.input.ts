import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsIn, Length, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'Username' })
  @Length(7, 50)
  username: string;

  @Field({ description: 'Password' })
  @MinLength(7)
  password: string;

  @Field({ description: 'User email' })
  @IsEmail()
  email: string;

  @Field({ description: 'User role' })
  @IsIn([10, 50, 90, 100])
  role: number;
}
