import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';

import { CommentEntity } from './comment.entity';
import { CommentFactory } from './comment.factory';

@Injectable()
export class CommentRepository extends BaseMemoryRepository<CommentEntity> {
  constructor(entityFactory: CommentFactory) {
    super(entityFactory);
  }
}
