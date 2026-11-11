import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  RegisterCandidateDto,
  RegisterCandidateResponseDto,
  RegisterCompanyDto,
  RegisterCompanyResponseDto,
} from './auth.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/responseMessage';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: RegisterCandidateResponseDto })
  @ResponseMessage('Register successfully')
  @Post('register/candidate')
  registerCandidate(@Body() dto: RegisterCandidateDto) {
    return this.authService.registerCandidate(dto);
  }

  @ApiCreatedResponse({ type: RegisterCompanyResponseDto })
  @ResponseMessage('Register successfully')
  @Post('register/company')
  registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.authService.registerCompany(dto);
  }

  // Login
  @ApiCreatedResponse({ type: LoginResponseDto })
  @HttpCode(200)
  @ResponseMessage('Login successfully')
  @Post('login/candidate')
  loginCandidate(@Body() dto: LoginDto) {
    return this.authService.login(dto, 'CANDIDATE');
  }

  @ApiCreatedResponse({ type: LoginResponseDto })
  @HttpCode(200)
  @ResponseMessage('Login successfully')
  @Post('login/company')
  loginCompany(@Body() dto: LoginDto) {
    return this.authService.login(dto, 'RECRUITER');
  }
}
