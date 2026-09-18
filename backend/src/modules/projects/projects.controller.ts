import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CacheService, PrismaService } from '../shared/shared.module';
import { isValidSlug, normalizeSlug } from '../common/slug.util';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService, private readonly cache: CacheService) {}

  @Get()
  list() {
    return this.cache.cached('portfolio:projects:v1', 90, () =>
      this.prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { sort: 'asc' }] }).catch(() => []),
    );
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    if (!isValidSlug(slug)) throw new NotFoundException('unknown project');
    const key = normalizeSlug(slug);
    const { data, cached } = await this.cache.cached(`portfolio:project:v1:${key}`, 300, () =>
      this.prisma.project.findUnique({ where: { slug: key } }).catch(() => null),
    );
    if (!data) throw new NotFoundException('unknown project');
    return { data, cached };
  }
}
