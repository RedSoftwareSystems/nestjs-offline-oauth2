// import { SetMetadata } from '@nestjs/common';

// export const Roles = (...args: string[]) => SetMetadata('roles', args);
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
