import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CacheService, PrismaService } from '../shared/shared.module';
import { isValidSlug, normalizeSlug } from '../common/slug.util';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly prisma: PrismaService, private readonly cache: CacheService) {}

  @Get()
  list() {
    return this.cache.cached('portfolio:posts:v1', 300, () =>
      this.prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    );
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    if (!isValidSlug(slug)) throw new NotFoundException('unknown post');
    const key = normalizeSlug(slug);
    const { data, cached } = await this.cache.cached(`portfolio:post:v1:${key}`, 300, () =>
      this.prisma.post.findUnique({ where: { slug: key } }).catch(() => null),
    );
    if (!data) throw new NotFoundException('unknown post');
    return { data, cached };
  }
}
