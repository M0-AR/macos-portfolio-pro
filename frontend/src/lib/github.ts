// Live GitHub metrics (REST API, degraded gracefully).
// Never blocks render; failures hide the card. No secrets, public API only.
export type GitHubStats = { followers: number; publicRepos: number; totalStars: number };

export function summarizeRepos(repos: { stargazers_count?: number }[]): number {
  return repos.reduce((s, r) => s + (r.stargazers_count ?? 0), 0);
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  if (!username || username === "example") return null;
  try {
    const [u, repos] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } } as RequestInit).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { next: { revalidate: 3600 } } as RequestInit).then((r) => (r.ok ? r.json() : [])),
    ]);
    if (!u) return null;
    return {
      followers: u.followers ?? 0,
      publicRepos: u.public_repos ?? 0,
      totalStars: Array.isArray(repos) ? summarizeRepos(repos) : 0,
    };
  } catch {
    return null;
  }
}
