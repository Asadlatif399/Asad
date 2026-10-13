// Generates plausible fake jobs so the app can be tried without any external feed.
const TITLES = ['React dashboard developer', 'Python scraping script', 'WordPress speed optimisation', 'Node.js API integration', 'Data entry specialist', 'Logo and brand design'];
const SKILLS = [['react', 'typescript'], ['python', 'scrapy'], ['wordpress', 'php'], ['node.js', 'express'], ['excel'], ['illustrator']];
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia'];

export async function fetchJobs() {
  const now = Date.now();
  return Array.from({ length: 3 }, (_, i) => {
    const t = Math.floor(Math.random() * TITLES.length);
    const stamp = now + i;
    return {
      externalId: `demo-${stamp}-${Math.random().toString(36).slice(2, 8)}`,
      title: TITLES[t],
      content: `We are looking for a freelancer for: ${TITLES[t]}. Please include relevant samples and your availability.`,
      url: 'https://example.com/jobs/' + stamp,
      budget: `$${(Math.floor(Math.random() * 20) + 1) * 50} fixed`,
      skills: SKILLS[t],
      postedAt: new Date(now - i * 60000).toISOString(),
      client: {
        country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
        rating: +(3.5 + Math.random() * 1.5).toFixed(2),
        reviews: Math.floor(Math.random() * 80),
        totalSpent: Math.floor(Math.random() * 100000),
        hireRate: Math.floor(Math.random() * 100),
        jobsPosted: Math.floor(Math.random() * 120),
        paymentVerified: Math.random() > 0.2,
      },
    };
  });
}
