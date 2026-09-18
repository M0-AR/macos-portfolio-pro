-- Portfolio CMS tables (replaces prototype cached_markets).
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tech" TEXT[] NOT NULL,
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug");
CREATE INDEX IF NOT EXISTS "Project_featured_sort_idx" ON "Project"("featured", "sort");

CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_published_createdAt_idx" ON "Post"("published", "createdAt");

CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT 'Portfolio contact',
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Message_read_createdAt_idx" ON "Message"("read", "createdAt");

-- Seed 3 demo projects + 2 posts so a fresh clone looks sellable, not empty.
INSERT INTO "Project" ("id","slug","title","tagline","description","tech","liveUrl","repoUrl","imageUrl","featured","sort","createdAt","updatedAt") VALUES
('seed-nike','nike-store','Nike Store','Headless commerce demo','Full storefront with cart, search and checkout flow. Demonstrates SSR product pages + ISR catalog + server-action cart.','{Next.js,TypeScript,Tailwind}','https://example.com/nike','https://github.com/example/nike',NULL,true,1,NOW(),NOW()),
('seed-food','food-delivery','Food Delivery','Realtime ordering demo','Restaurant listing, live order tracking via WebSocket, BullMQ kitchen queue with retries + DLQ.','{NestJS,Redis,BullMQ}',NULL,'https://github.com/example/food',NULL,true,2,NOW(),NOW()),
('seed-resume-ai','resume-ai','Resume AI','RAG resume reviewer','Upload a PDF, get structured feedback. Queue-backed inference so uploads return 200 instantly.','{Next.js,NestJS,Postgres}',NULL,'https://github.com/example/resume-ai',NULL,false,3,NOW(),NOW())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Post" ("id","slug","title","excerpt","body","coverUrl","published","createdAt","updatedAt") VALUES
('seed-post-1','shipping-nextjs-16','Shipping Next.js 16 without the FOUC','Dark mode, fonts and Tailwind v4 tokens — the 6 gotchas in one place.','Long-form content lives here. Replace with your CMS body. Key points: @theme inline, @custom-variant dark, next/font variables, next-themes props, tw-animate-css, never hsl(var(--x)) after OKLCH.',NULL,true,NOW(),NOW()),
('seed-post-2','zustand-over-redux','Why Zustand won for client state','1KB vs 13KB, selectors vs providers — and when Redux still wins.','Client state (windows open, focus, location) belongs in Zustand + Immer. Server state (projects, posts) belongs in TanStack Query or RSC fetch. Never mix the two.',NULL,true,NOW(),NOW())
ON CONFLICT ("slug") DO NOTHING;
