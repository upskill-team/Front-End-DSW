import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = '/img/og-default.png',
  canonical,
}: SEOProps) {
  const fullTitle = `${title} | UpSkill`;
  const siteUrl = 'https://up-skill.app';
  const canonicalUrl = canonical || typeof window !== 'undefined' ? window.location.href : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="UpSkill" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      <meta name="robots" content="index, follow" />
      <meta name="language" content="es" />
      <meta name="author" content="UpSkill" />
    </Helmet>
  );
}
