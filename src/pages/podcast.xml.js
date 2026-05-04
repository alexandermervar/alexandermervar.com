import { getCollection } from 'astro:content';

// ---------------------------------------------------------------------------
// PODCAST FEED CONFIGURATION — fill these in before publishing
// ---------------------------------------------------------------------------
const PODCAST_TITLE       = 'Alexander Mervar Podcast';         // TODO: your show title
const PODCAST_DESCRIPTION = 'A podcast by Alexander Mervar.';  // TODO: your show description
const PODCAST_AUTHOR      = 'Alexander Mervar';                 // TODO: your name
const PODCAST_EMAIL       = 'hello@alexandermervar.com';        // TODO: your contact email
const PODCAST_IMAGE       = 'https://alexandermervar.com/podcast-cover.jpg'; // TODO: 1400×1400px artwork URL
const PODCAST_CATEGORY    = 'Technology';                       // TODO: iTunes category
const PODCAST_LANGUAGE    = 'en';
const PODCAST_EXPLICIT    = 'false';                            // 'true' | 'false'
// ---------------------------------------------------------------------------

export async function GET(context) {
  const siteUrl = (context.site ?? 'https://alexandermervar.com').toString().replace(/\/$/, '');

  const episodes = (await getCollection('podcast'))
    .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf());

  const items = episodes.map(ep => {
    const pubDate = new Date(ep.data.pubDate).toUTCString();
    return `
    <item>
      <title><![CDATA[${ep.data.title}]]></title>
      <description><![CDATA[${ep.data.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${siteUrl}/podcast/${ep.id}</guid>
      <link>${siteUrl}/podcast/${ep.id}</link>
      <enclosure
        url="${ep.data.audioUrl}"
        length="${ep.data.fileSize}"
        type="audio/mpeg"
      />
      <itunes:title><![CDATA[${ep.data.title}]]></itunes:title>
      <itunes:summary><![CDATA[${ep.data.description}]]></itunes:summary>
      <itunes:duration>${ep.data.duration}</itunes:duration>
      <itunes:explicit>${PODCAST_EXPLICIT}</itunes:explicit>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${PODCAST_TITLE}]]></title>
    <description><![CDATA[${PODCAST_DESCRIPTION}]]></description>
    <link>${siteUrl}</link>
    <language>${PODCAST_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

    <itunes:author>${PODCAST_AUTHOR}</itunes:author>
    <itunes:owner>
      <itunes:name>${PODCAST_AUTHOR}</itunes:name>
      <itunes:email>${PODCAST_EMAIL}</itunes:email>
    </itunes:owner>
    <itunes:image href="${PODCAST_IMAGE}" />
    <itunes:category text="${PODCAST_CATEGORY}" />
    <itunes:explicit>${PODCAST_EXPLICIT}</itunes:explicit>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
