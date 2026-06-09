import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BlogPostDto } from '../dto';

@Injectable()
export class TagsValidationPipe implements PipeTransform {
  transform(blogPostDto: BlogPostDto) {
    const { tags } = blogPostDto;

    if (!tags) return blogPostDto;

    // Step 1: Filter out tags that start with a number or contain special symbols
    tags.forEach((tag) => {
      if (/^[0-9!@#$%^&*()_+={}\[\]|\\;:'",.<>?]/.test(tag)) {
        throw new BadRequestException(
          `Tag "${tag}" starts with a number or contains special symbols.`
        );
      }
    });

    // Step 2: Reject tags that contain spaces
    tags.forEach((tag) => {
      if (/\s/.test(tag)) {
        throw new BadRequestException(`Tag "${tag}" contains spaces.`);
      }
    });

    // Step 3: Remove duplicates and Step 4: Transform tags to lowercase
    const uniqueLowerCaseTags = Array.from(
      new Set(tags.map((tag) => tag.toLowerCase()))
    );

    // Update the tags array in the DTO
    blogPostDto.tags = uniqueLowerCaseTags;

    return blogPostDto;
  }
}
