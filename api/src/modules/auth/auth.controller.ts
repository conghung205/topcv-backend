import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  RegisterCandidateDto,
  RegisterCandidateResponseDto,
} from './dto/registerCandidate.dto';
import {
  RegisterCompanyDto,
  RegisterCompanyResponseDto,
} from './dto/registerCompany.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/responseMessage';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dto/refreshToken.dto';
import { LogoutResponseDto } from './dto/logout.dto';

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

  // logout
  @ApiOkResponse({ type: LogoutResponseDto })
  @HttpCode(200)
  @Post('logout')
  @ResponseMessage('Logout successfully')
  async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.logout(dto);
  }

  // Refresh Token
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @HttpCode(200)
  @ResponseMessage('Refresh token successfully')
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
