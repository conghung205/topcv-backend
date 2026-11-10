import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response';
import { HttpExceptionFilter } from './common/filters/http-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation with Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // when the client sends incorrect fields
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: () => {
        return new BadRequestException('invalid data');
      },
    }),
  );

  // swager
  const config = new DocumentBuilder()
    .setTitle('TopCV API')
    .setDescription(
      'API cho hệ thống tuyển dụng: công ty, tin tuyển dụng, ứng viên, CV',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    jsonDocumentUrl: '/openapi.json',
  });

  // interceptor to transform response when Success
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  // Exception Filter to transform response when Error
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
