import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { ResponseMessage } from '../../common/decorators/responseMessage';
import { ProvinceApiResponseDto, WardApiResponseDto } from './province.dto';

@ApiTags('province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @ApiOkResponse({
    type: ProvinceApiResponseDto,
  })
  @ResponseMessage('Get province successfully')
  @Get()
  getProvince(@Query() query: { search?: string }) {
    return this.provinceService.getProvince({ search: query.search ?? '' });
  }

  @ApiOkResponse({
    type: WardApiResponseDto,
  })
  @ResponseMessage('Get ward with provinceId successfully')
  @Get(':id/ward')
  getWardWithProvince(@Param('id') provinceId: string) {
    return this.provinceService.getWardWithProvinceId(provinceId);
  }
}
