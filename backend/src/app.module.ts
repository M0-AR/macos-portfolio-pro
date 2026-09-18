import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { SharedModule } from './modules/shared/shared.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PostsModule } from './modules/posts/posts.module';
import { ContactModule } from './modules/contact/contact.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Spike protection: 30 r/s API, 5/min auth (mirrors nginx, defense in depth)
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    SharedModule,
    HealthModule,
    ProjectsModule,
    PostsModule,
    ContactModule,
    QueueModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
