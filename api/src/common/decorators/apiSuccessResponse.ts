import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ResponseMessage } from './responseMessage';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponse(
  dataDto: Type<unknown>,
  message: string,
  status: number = HttpStatus.OK,
) {
  return applyDecorators(
    ResponseMessage(message),
    ApiExtraModels(dataDto),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        required: ['success', 'message', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: message },
          data: { $ref: getSchemaPath(dataDto) },
        },
      },
    }),
  );
}
