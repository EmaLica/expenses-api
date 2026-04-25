import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
//usa dotenv library

@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}), AuthModule, UserModule, ExpenseModule, PrismaModule],
})
export class AppModule {}
