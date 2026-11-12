import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from './common/interceptors/response';
import { ProvinceModule } from './modules/province/province.module';
import { AuthModule } from './modules/auth/auth.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { CompanyModule } from './modules/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      // Disable automatic database schema synchronization with entities
      synchronize: false,
    }),
    CategoryModule,
    ProvinceModule,
    AuthModule,
    CandidateModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [AppService, ResponseInterceptor],
})
export class AppModule {}
