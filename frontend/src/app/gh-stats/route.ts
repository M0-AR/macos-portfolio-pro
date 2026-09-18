import { SITE } from "@/lib/site";
import { fetchGitHubStats } from "@/lib/github";

export async function GET() {
  const stats = await fetchGitHubStats(SITE.githubUsername);
  // 200 + null when unconfigured/degraded (204 cannot carry a JSON body).
  if (!stats) return Response.json(null, { status: 200 });
  return Response.json(stats, { status: 200, headers: { "Cache-Control": "public, max-age=3600" } });
}
