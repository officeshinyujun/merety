import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';

// Entities
import {
  User,
  Study,
  StudyOverview,
  StudyMembership,
  Session,
  Attendance,
  TilPost,
  Archive,
  Notice,
  ActivityLog,
} from './entities';

// Modules
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { StudiesModule } from './studies/studies.module';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // TypeORM 데이터베이스 연결
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          User,
          Study,
          StudyOverview,
          StudyMembership,
          Session,
          Attendance,
          TilPost,
          Archive,
          Notice,
          ActivityLog,
        ],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),

    // Feature Modules
    AuthModule,
    AdminUsersModule,
    StudiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

