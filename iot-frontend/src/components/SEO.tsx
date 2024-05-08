import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  deviceId: string | number;
}

const SEO: React.FC<SEOProps> = ({ title, description, deviceId }) => {
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = `${currentDomain}/devices/${deviceId}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="device info, device management, adroit" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="icon" href="/assets/img/favicon.png" />
    </Head>
  );
};

export default SEO;
