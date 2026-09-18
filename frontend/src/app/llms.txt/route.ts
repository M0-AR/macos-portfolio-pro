import { SITE } from "@/lib/site";

// AI-agent discovery manifest (llmstxt.org). Lets ChatGPT/Claude ingest
// the portfolio without scraping hydrated React trees.
export async function GET() {
  const body = `# ${SITE.name} — Portfolio OS\n\n> ${SITE.description}\n\n## Desktop apps\n\n- [Projects](/): Finder window, live from /api/projects\n- [Blog](/): Safari window, live from /api/posts\n- [Skills](/): Terminal window — type help\n- [Notes](/): editable notepad, persisted locally\n- [Calculator](/): basic + scientific\n- [Code](/): VS Code explorer about.ts, skills.json, contact.ts\n- [Contact](/): POST /api/contact (persist + queue)\n\n## People\n\n- ${SITE.fullName} (${SITE.role}), ${SITE.location}\n- GitHub: ${SITE.github}\n- LinkedIn: ${SITE.linkedin}\n\n## API\n\n- GET /api/projects — { data, cached }\n- GET /api/posts — { data, cached }\n- POST /api/contact — { data: { ok: true } }\n- GET /api/health — { status, checks }\n`;
  return new Response(body, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
