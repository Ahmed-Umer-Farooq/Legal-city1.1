// SEO utility functions
export const updatePageMeta = (title, description, keywords = '', canonical = '', image = '', type = 'website') => {
  // Update title
  document.title = title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description;
  
  // Update meta keywords
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
  }
  
  // Update canonical URL
  if (canonical) {
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonical;
  }
  
  // Update Open Graph and Twitter tags
  updateOpenGraph(title, description, image, type, canonical);
  updateTwitterCards(title, description, image);
};

const updateOpenGraph = (title, description, image = '', type = 'website', url = '') => {
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: 'LegalCity' },
    { property: 'og:locale', content: 'en_US' }
  ];
  
  if (url) ogTags.push({ property: 'og:url', content: url });
  if (image) ogTags.push({ property: 'og:image', content: image });
  
  ogTags.forEach(tag => {
    let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
    if (!ogTag) {
      ogTag = document.createElement('meta');
      ogTag.setAttribute('property', tag.property);
      document.head.appendChild(ogTag);
    }
    ogTag.content = tag.content;
  });
};

const updateTwitterCards = (title, description, image = '') => {
  const twitterTags = [
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: title },
    { property: 'twitter:description', content: description }
  ];
  
  if (image) twitterTags.push({ property: 'twitter:image', content: image });
  
  twitterTags.forEach(tag => {
    let twitterTag = document.querySelector(`meta[property="${tag.property}"]`);
    if (!twitterTag) {
      twitterTag = document.createElement('meta');
      twitterTag.setAttribute('property', tag.property);
      document.head.appendChild(twitterTag);
    }
    twitterTag.content = tag.content;
  });
};

// Generate SEO-friendly slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Add structured data to page
export const addStructuredData = (data) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Generate lawyer structured data
export const generateLawyerStructuredData = (lawyer) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": lawyer.name,
    "jobTitle": "Attorney",
    "description": lawyer.bio || `Experienced ${lawyer.practiceAreas} attorney`,
    "image": lawyer.image,
    "url": `https://legalcity.com/lawyer/${lawyer.id}`,
    "worksFor": {
      "@type": "Organization",
      "name": lawyer.firmName || "Independent Practice"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": lawyer.city,
      "addressRegion": lawyer.state,
      "addressCountry": "US"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": lawyer.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": lawyer.reviewCount || 1
    },
    "knowsAbout": lawyer.practiceAreas?.split(', ') || []
  };
};

// Generate blog article structured data
export const generateArticleStructuredData = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "LegalCity",
      "logo": {
        "@type": "ImageObject",
        "url": "https://legalcity.com/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://legalcity.com/legal-blog/${article.id}`
    },
    "articleSection": "Legal",
    "keywords": article.tags?.join(', ') || 'legal advice, law'
  };
};

// Page-specific SEO configurations
export const seoConfigs = {
  home: {
    title: "LegalCity - Find Qualified Lawyers & Legal Services Near You",
    description: "Connect with experienced lawyers and legal professionals in your area. Find attorneys specializing in family law, criminal defense, personal injury, corporate law, and more. Get expert legal help today.",
    keywords: "lawyers, attorneys, legal services, find lawyer, legal help, law firm, legal advice, family law, criminal defense, personal injury, corporate law, legal consultation",
    canonical: "https://legalcity.com/"
  },
  lawyerDirectory: {
    title: "Lawyer Directory - Find Attorneys by Location & Practice Area | LegalCity",
    description: "Browse our comprehensive directory of qualified lawyers and attorneys. Search by location, practice area, and specialization to find the right legal professional for your needs.",
    keywords: "lawyer directory, attorney directory, find lawyers, legal professionals, law firms, attorney search, legal directory",
    canonical: "https://legalcity.com/lawyers"
  },
  legalBlog: {
    title: "Legal Blog - Expert Legal Advice & Insights | LegalCity",
    description: "Stay informed with expert legal advice, insights, and updates from qualified attorneys. Read about family law, criminal defense, personal injury, and more legal topics.",
    keywords: "legal blog, legal advice, law articles, attorney insights, legal news, legal tips, law updates",
    canonical: "https://legalcity.com/legal-blog"
  },
  findLawyer: {
    title: "Find a Lawyer - Search Attorneys by Practice Area | LegalCity",
    description: "Find the right lawyer for your legal needs. Search attorneys by practice area, location, and specialization. Get matched with qualified legal professionals today.",
    keywords: "find lawyer, search attorneys, legal help, attorney matching, legal consultation, hire lawyer",
    canonical: "https://legalcity.com/find-a-lawyer"
  },
  legalForms: {
    title: "Legal Forms & Documents - Free Legal Templates | LegalCity",
    description: "Access free legal forms and document templates. Download contracts, agreements, and legal documents for personal and business use.",
    keywords: "legal forms, legal documents, legal templates, contracts, agreements, legal paperwork",
    canonical: "https://legalcity.com/legal-forms"
  },
  qa: {
    title: "Legal Q&A - Ask Legal Questions & Get Answers | LegalCity",
    description: "Get answers to your legal questions from qualified attorneys. Browse common legal Q&A or ask your own question to get expert legal advice.",
    keywords: "legal questions, legal answers, legal Q&A, ask lawyer, legal advice, attorney consultation",
    canonical: "https://legalcity.com/qa"
  },
  contact: {
    title: "Contact Us - Get in Touch with LegalCity",
    description: "Contact LegalCity for support, questions, or feedback. We're here to help you connect with the right legal professionals for your needs.",
    keywords: "contact LegalCity, legal support, customer service, legal help",
    canonical: "https://legalcity.com/contact-us"
  }
};