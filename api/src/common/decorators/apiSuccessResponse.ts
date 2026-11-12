import { applyDecorators, Type } from '@nestjs/common';
import { ResponseMessage } from './responseMessage';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponse(dataDto: Type<unknown>, message: string) {
  return applyDecorators(
    ResponseMessage(message),
    ApiExtraModels(dataDto),
    ApiOkResponse({
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
