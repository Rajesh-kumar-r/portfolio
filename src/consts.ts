export const SITE_URL: string = 'https://rajesh.fyi';
export const SITE_TITLE: string = 'Rajesh Kumar R';
export const SITE_TAGLINE: string = 'Senior Frontend Engineer · React · Next.js · Full-stack';
export const SITE_DESC: string =
  'Senior Frontend Engineer — React.js / Next.js, 7+ years. Four large-scale applications, one company. Plus a terminal and an arcade.';
export const AUTHOR: string = 'Rajesh Kumar R';
export const RESUME_URL: string =
  'https://drive.google.com/uc?export=download&id=1VpeIoEdmAS35GmrbecjeIYukmQBNvXJG';
export const RESUME_PREVIEW_URL: string =
  'https://drive.google.com/file/d/1VpeIoEdmAS35GmrbecjeIYukmQBNvXJG/preview';

// Open Graph / social card. Path only — absolute-ised in Base.astro via
// `new URL(OG_IMAGE, Astro.site)`. The public/og.png artboard is authored in
// Task 26 and exported by hand at exactly 1200x630; a missing public file that
// is only referenced from a <meta> tag does not break the build.
export const OG_IMAGE: string = '/og.png';
export const OG_IMAGE_ALT: string = 'Rajesh Kumar R — Senior Frontend Engineer';
export const JOB_TITLE: string = 'Senior Frontend Engineer';
