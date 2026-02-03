import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole, UserStatus } from '../entities';
import { Repository } from 'typeorm';
import { hashPassword } from '../common/utils/password.util';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    const email = 'admin@merety.com';
    const password = 'admin123'; // 초기 비밀번호

    // 이미 존재하는지 확인
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        console.log('슈퍼유저가 이미 존재합니다:', email);
        await app.close();
        return;
    }

    // 비밀번호 해시
    const passwordHash = await hashPassword(password);

    // 슈퍼유저 생성
    const superAdmin = userRepository.create({
        email,
        handle: 'admin',
        name: 'Super Admin',
        password_hash: passwordHash,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        must_change_password: true,
    });

    await userRepository.save(superAdmin);

    console.log('✅ 슈퍼유저 생성 완료!');
    console.log('이메일:', email);
    console.log('비밀번호:', password);
    console.log('⚠️  로그인 후 반드시 비밀번호를 변경하세요!');

    await app.close();
}

bootstrap();
