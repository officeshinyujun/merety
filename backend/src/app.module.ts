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
import { SessionsModule } from './sessions/sessions.module';
import { TilModule } from './til/til.module';
import { ArchiveModule } from './archive/archive.module';
import { NoticesModule } from './notices/notices.module';
import { TeamModule } from './team/team.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MetricsModule } from './admin/metrics/metrics.module';

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
    SessionsModule,
    TilModule,
    ArchiveModule,
    NoticesModule,
    TeamModule,
    DashboardModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

