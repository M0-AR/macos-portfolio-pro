import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../shared/shared.module';
import { QueueService } from '../queue/queue.service';
import { CreateMessageDto } from './dto';

// Contact form: persist + enqueue worker, respond 200 now.
// Slow work (email notify) NEVER blocks the request.
@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly prisma: PrismaService, private readonly queue: QueueService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateMessageDto) {
    const subject = dto.subject ?? 'Portfolio contact';
    const msg = await this.prisma.message
      .create({ data: { name: dto.name, email: dto.email, subject, body: dto.body } })
      .catch(() => ({ id: `mem-${Date.now()}`, name: dto.name, email: dto.email } as never));
    // Full payload so worker can send email even if DB write degraded.
    await this.queue.enqueue('contact-notify', { messageId: (msg as { id: string }).id, email: dto.email, name: dto.name, subject, body: dto.body });
    return { data: { ok: true }, cached: false };
  }
}
