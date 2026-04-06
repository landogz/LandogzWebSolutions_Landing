/**
 * JSON-LD Organization + WebSite for Google rich results eligibility.
 */
export default function OrganizationJsonLd({ site, canonicalOrigin }) {
    if (!canonicalOrigin || !site) {
        return null;
    }

    const sameAs = [];
    const sl = site.social_links || {};
    for (const k of ['linkedin', 'twitter', 'github', 'facebook', 'instagram']) {
        const u = sl[k];
        if (u && String(u).trim()) {
            sameAs.push(String(u).trim());
        }
    }

    const org = {
        '@type': 'Organization',
        '@id': `${canonicalOrigin}/#organization`,
        name: site.company_name || 'Landogz Web Solutions',
        url: canonicalOrigin,
        ...(site.logo_url ? { logo: { '@type': 'ImageObject', url: site.logo_url } } : {}),
        ...(site.email ? { email: site.email } : {}),
        ...(site.phone ? { telephone: site.phone } : {}),
        ...(site.address
            ? {
                  address: {
                      '@type': 'PostalAddress',
                      streetAddress: site.address,
                  },
              }
            : {}),
        ...(sameAs.length ? { sameAs } : {}),
    };

    const desc = site.seo_default_description || '';
    const web = {
        '@type': 'WebSite',
        '@id': `${canonicalOrigin}/#website`,
        url: canonicalOrigin,
        name: site.company_name || 'Landogz Web Solutions',
        ...(desc ? { description: desc } : {}),
        publisher: { '@id': `${canonicalOrigin}/#organization` },
    };

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [org, web],
    };

    return <script type="application/ld+json">{JSON.stringify(graph)}</script>;
}
