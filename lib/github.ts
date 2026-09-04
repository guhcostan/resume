export type GitHubStars = {
  stars: Record<string, number>;
  checkedAt: string;
};

export const githubRepositoriesUrl = "https://api.github.com/users/guhcostan/repos?per_page=100&type=owner&sort=updated";

// Only accept complete, valid counts for the repositories shown on the page.
// A rate-limit response or a missing repository must not turn stars into zero.
export function parseRepositoryStars(data: unknown, names: readonly string[]): Record<string, number> {
  if (!Array.isArray(data)) throw new Error("Invalid GitHub response");
  const stars: Record<string, number> = {};
  for (const repo of data) {
    if (!repo || typeof repo !== "object" || typeof repo.name !== "string") continue;
    if (!names.includes(repo.name) || repo.full_name !== `guhcostan/${repo.name}`) continue;
    if (!Number.isSafeInteger(repo.stargazers_count) || repo.stargazers_count < 0) continue;
    stars[repo.name] = repo.stargazers_count;
  }
  if (names.some(name => stars[name] === undefined)) throw new Error("Incomplete GitHub counts");
  return stars;
}

export async function refreshGitHubStars(previous: GitHubStars, signal: AbortSignal): Promise<GitHubStars> {
  try {
    const response = await fetch(githubRepositoriesUrl, {
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
    if (!response.ok) return previous;
    const stars = parseRepositoryStars(await response.json(), Object.keys(previous.stars));
    return { stars, checkedAt: new Date().toISOString() };
  } catch {
    return previous;
  }
}
