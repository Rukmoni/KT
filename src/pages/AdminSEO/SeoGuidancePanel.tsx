import { ExternalLink } from 'lucide-react';

interface ActionStep {
  title: string;
  detail: string;
  url?: string;
  tag: string;
}

const ONE_TIME: ActionStep[] = [
  { title: 'Fix SSR — migrate to Next.js', detail: 'Your React SPA returns a blank page to Google. This is the #1 SEO blocker. Migrate to Next.js (SSR) or Astro (static). Nothing else matters until this is fixed.', tag: 'Critical' },
  { title: 'Replace GA4 placeholder ID', detail: 'Open index.html and replace G-XXXXXXXXXX with your real Google Analytics Measurement ID from analytics.google.com.', tag: 'Critical' },
  { title: 'Verify in Google Search Console', detail: 'Go to search.google.com/search-console → Add property → Enter kuvanta.tech → Verify via DNS TXT record → Submit sitemap.xml.', url: 'https://search.google.com/search-console', tag: 'Critical' },
  { title: 'Set up Bing Webmaster Tools', detail: 'Go to bing.com/webmasters → Add site → Verify → Submit sitemap. Bing powers Microsoft Copilot AI search results.', url: 'https://www.bing.com/webmasters', tag: 'Critical' },
  { title: 'Create Google Business Profile', detail: 'Go to business.google.com → Create profile → Set category: "Software Company" + "Mobile App Developer" → Add KL address, phone, photos, and service list.', url: 'https://business.google.com', tag: 'Critical' },
  { title: 'Test structured data', detail: 'Visit the Rich Results Test tool → Enter https://kuvanta.tech → Confirm Organisation, FAQ, and Service schemas are valid.', url: 'https://search.google.com/test/rich-results', tag: 'High' },
  { title: 'Check Core Web Vitals', detail: 'Run PageSpeed Insights for kuvanta.tech. Target: LCP <2.5s, CLS <0.1, INP <200ms. Use WebP images and lazy loading.', url: 'https://pagespeed.web.dev', tag: 'High' },
  { title: 'Submit to Clutch.co', detail: 'Create a free vendor profile on Clutch. This is the #1 tech company directory and is heavily cited by AI search engines (ChatGPT, Perplexity, Copilot).', url: 'https://clutch.co/get-listed', tag: 'High' },
  { title: 'Submit to Crunchbase', detail: 'Free company profile at crunchbase.com. AI tools like ChatGPT and Gemini frequently cite Crunchbase when answering "which tech companies are in Malaysia".', url: 'https://www.crunchbase.com/add-new-company', tag: 'High' },
  { title: 'Submit to GoodFirms', detail: 'Another high-authority developer directory with strong AI citation value.', url: 'https://www.goodfirms.co/directory/get-listed', tag: 'Medium' },
  { title: 'Verify llms.txt is live', detail: 'Navigate to https://kuvanta.tech/llms.txt — this file tells AI crawlers (GPTBot, ClaudeBot, Perplexity) how to describe and cite your company.', tag: 'Medium' },
];

const SCHEDULED: ActionStep[] = [
  { title: 'Weekly: Check GSC for errors', detail: 'Review crawl errors, index coverage, and Core Web Vitals in Google Search Console. Fix any 404s or crawl blocks immediately.', tag: 'Weekly' },
  { title: 'Weekly: Update GBP posts', detail: 'Add a Google Business Profile post weekly — showcase a recent project, team update, or tech tip. Posts expire after 7 days.', tag: 'Weekly' },
  { title: 'Weekly: Post on LinkedIn', detail: 'One LinkedIn post per week minimum. Share project highlights, AI/tech insights, or team news. LinkedIn content is indexed by Google.', tag: 'Weekly' },
  { title: 'Monthly: Publish blog article', detail: 'Write 800-1200 words targeting one keyword. Ideas: "How much does app development cost in Malaysia", "AI chatbot ROI for Malaysian SMEs", "Flutter vs React Native 2026".', tag: 'Monthly' },
  { title: 'Monthly: Keyword position check', detail: 'Search target keywords in incognito mode or use the free Ubersuggest tier to record current ranking positions. Update the keyword tracker above.', url: 'https://neilpatel.com/ubersuggest/', tag: 'Monthly' },
  { title: 'Monthly: Backlink outreach', detail: 'Pitch a guest article or press story to Digital News Asia, Vulcan Post, Tech in Asia, or local SME blogs. One new backlink per month from a high-DA site moves rankings fast.', tag: 'Monthly' },
  { title: 'Quarterly: Technical SEO audit', detail: 'Run a full crawl with Screaming Frog (free up to 500 URLs). Check for duplicate content, broken links, slow pages, and mobile usability issues.', url: 'https://www.screamingfrog.co.uk/seo-spider/', tag: 'Quarterly' },
  { title: 'Quarterly: Keyword gap analysis', detail: 'Use Ubersuggest or Ahrefs Webmaster Tools (free) to find keywords your top 3 competitors rank for that you do not. Create new pages to close those gaps.', tag: 'Quarterly' },
];

const PRIORITY_COLOR: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#3b82f6',
  Weekly: '#22c55e',
  Monthly: '#3b82f6',
  Quarterly: '#94a3b8',
};

export const SeoGuidancePanel = () => {
  return (
    <div className="seo-panel">
      <div className="seo-panel__header">
        <div>
          <h3 className="seo-panel__title">Action Guide & Roadmap</h3>
          <p className="seo-panel__sub">Detailed instructions — one-time setup and ongoing schedule</p>
        </div>
      </div>

      <div className="seo-guide-section">
        <h4 className="seo-guide-section__title">One-time Setup (do in this order)</h4>
        <div className="seo-guide-list">
          {ONE_TIME.map((s, i) => (
            <div key={i} className="seo-guide-item">
              <div className="seo-guide-item__top">
                <span className="seo-guide-num">{i + 1}</span>
                <span className="seo-guide-title">{s.title}</span>
                <span className="seo-guide-tag" style={{ background: PRIORITY_COLOR[s.tag] + '22', color: PRIORITY_COLOR[s.tag], border: `1px solid ${PRIORITY_COLOR[s.tag]}44` }}>
                  {s.tag}
                </span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="seo-guide-link">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p className="seo-guide-detail">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="seo-guide-section">
        <h4 className="seo-guide-section__title">Scheduled Recurring Tasks</h4>
        <div className="seo-guide-list">
          {SCHEDULED.map((s, i) => (
            <div key={i} className="seo-guide-item">
              <div className="seo-guide-item__top">
                <span className="seo-guide-title">{s.title}</span>
                <span className="seo-guide-tag" style={{ background: PRIORITY_COLOR[s.tag] + '22', color: PRIORITY_COLOR[s.tag], border: `1px solid ${PRIORITY_COLOR[s.tag]}44` }}>
                  {s.tag}
                </span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="seo-guide-link">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p className="seo-guide-detail">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="seo-ai-note">
        <h4 className="seo-ai-note__title">AI Search (GEO) — What's Already Done</h4>
        <p className="seo-ai-note__body">
          The following have been implemented to ensure Kuvanta Tech appears in AI-generated answers (ChatGPT, Perplexity, Copilot, Gemini):
        </p>
        <ul className="seo-ai-note__list">
          <li>FAQ schema with 4 direct-answer questions about Kuvanta Tech</li>
          <li>Organisation + LocalBusiness JSON-LD schema for consistent AI citation data</li>
          <li>robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Bingbot</li>
          <li>llms.txt file with plain-language company description for LLM crawlers</li>
          <li>Consistent NAP (Name, Address, Phone) meta tags with KL geo coordinates</li>
        </ul>
        <p className="seo-ai-note__body" style={{ marginTop: '10px' }}>
          <strong>Remaining AI SEO action:</strong> Get listed on Crunchbase and Clutch — these are the primary sources AI tools query when answering "which tech companies are in Malaysia".
        </p>
      </div>
    </div>
  );
};
