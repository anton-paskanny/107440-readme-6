import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import {
  BlogPostDto,
  BlogPostQuery,
  PostTypeFieldsUpdateValidationPipe,
  PostTypeFieldsValidationPipe,
  PostsResponseMessage,
  TagsValidationPipe,
  UpdatePostDto,
} from '@project/posts';
import { InjectUserIdInterceptor } from '@project/interceptors';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ApplicationServiceURL } from './app.config';
import { RequestWithTokenPayload } from '@project/authentication';
import { buildReqHeaders } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(private readonly httpService: HttpService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: PostsResponseMessage.PostCreated,
  })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post()
  @UsePipes(new TagsValidationPipe(), new PostTypeFieldsValidationPipe())
  public async create(@Body() dto: BlogPostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: PostsResponseMessage.PostUpdated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Patch('/:postId')
  @UsePipes(new TagsValidationPipe(), new PostTypeFieldsUpdateValidationPipe())
  public async updatePost(
    @Param('postId') postId: string,
    @Body() blogPostDto: UpdatePostDto,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${postId}?userId=${userId}`,
      blogPostDto
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: PostsResponseMessage.PostDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Delete('/:postId')
  public async deletePost(
    @Param('postId') postId: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${postId}?userId=${userId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostsNotFound,
  })
  @Get()
  public async getPosts(@Query() query: BlogPostQuery) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}`,
      {
        params: query,
      }
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostsNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Get('drafts')
  public async getDrafts(@Req() req: RequestWithTokenPayload) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/drafts?userId=${userId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostLiked,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Post(':postId/like')
  public async addLike(
    @Param('postId') postId: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/like/${userId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostUnliked,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Delete(':postId/like')
  public async removeLike(
    @Param('postId') postId: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${postId}/like/${userId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostsNotFound,
  })
  @UseGuards(CheckAuthGuard)
  @Post(':postId/repost')
  public async repost(
    @Param('postId') postId: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/repost?userId=${userId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostNotFound,
  })
  @Get(':postId')
  public async getById(@Param('postId') postId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${postId}`
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: PostsResponseMessage.PostsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostsResponseMessage.PostsNotFound,
  })
  @Get('/search')
  public async searchByTitle(@Query('title') title: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/search?title=${title}`
    );

    return data;
  }
}
