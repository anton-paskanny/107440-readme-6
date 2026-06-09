import { Transform } from 'class-transformer';
import {
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { SortDirection, SortBy } from '@project/core';

import {
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_PAGE_COUNT,
  DEFAULT_SORT_BY,
} from './posts.constant';

export class BlogPostQuery {
  // `|| DEFAULT` would pass negative numbers through (truthy), so we check > 0 explicitly
  @Transform(({ value }) => +value > 0 ? +value : DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @IsString()
  @IsOptional()
  public type: string;

  @IsString()
  @IsOptional()
  public tagName: string;

  @IsMongoId()
  @IsOptional()
  public userId: string;

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @IsIn(Object.values(SortBy))
  @IsOptional()
  public sortBy: SortBy = DEFAULT_SORT_BY;

  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}
