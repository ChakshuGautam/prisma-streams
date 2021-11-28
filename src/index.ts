import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';
import { FindManyArgs } from './types/prisma';

interface Filter {
  where?: any;
  orderBy?: any;
}

interface StreamOptions {
  client: PrismaClient;
  batchSize: number;
  schema: any;
  filter: Filter;
}

export const PrismaStream = (options: StreamOptions): Readable => {
  const prisma = options.client;
  let cursorId: number;

  return new Readable({
    objectMode: true,
    highWaterMark: options.batchSize,
    async read() {
      const findManyArgs: FindManyArgs = {
        ...options.filter,
        take: options.batchSize,
        skip: cursorId ? 1 : 0,
        cursor: cursorId ? { id: cursorId } : undefined,
      };

      const items = await prisma[options.schema].findMany(findManyArgs);
      for (const item of items) {
        this.push(item);
      }
      if (items.length < options.batchSize) {
        this.push(null);
        return;
      }
      cursorId = items[items.length - 1].id;
    },
  });
};
