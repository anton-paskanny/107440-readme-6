import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  PostLink,
  PostPhoto,
  PostQuote,
  PostText,
  PostTypeEnum,
  PostVideo,
} from '@project/core';

import { PostTextEntity } from '../entities/post.text.entity';
import { PostVideoEntity } from '../entities/post.video.entity';
import { PostPhotoEntity } from '../entities/post.photo.entity';
import { PostLinkEntity } from '../entities/post.link.entity';
import { PostQuoteEntity } from '../entities/post.quote.entity';
import { FACTORIES_MAP } from './post.factories.constant';

type BlogPostEntities =
  | PostLinkEntity
  | PostTextEntity
  | PostVideoEntity
  | PostQuoteEntity
  | PostPhotoEntity;

type BlogPostInterfaces =
  | PostLink
  | PostVideo
  | PostText
  | PostQuote
  | PostPhoto;

@Injectable()
export class PostTypesFactory {
  public getFactoryInstance(postType: PostTypeEnum) {
    const PostFactory = FACTORIES_MAP[postType];

    if (!PostFactory) {
      return null;
    }

    return new PostFactory();
  }

  public createPostByType(
    entityPlainData: BlogPostInterfaces,
    postType: PostTypeEnum
  ): BlogPostEntities {
    const postFactoryInstance = this.getFactoryInstance(postType);

    if (!postFactoryInstance) {
      throw new Error(`Factory not found for post type: ${postType}`);
    }

    const postEntity = postFactoryInstance.create(
      //@ts-expect-error have no idea how to type create method
      entityPlainData
    ) as BlogPostEntities;

    return postEntity;
  }
}
