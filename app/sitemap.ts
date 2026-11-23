import { MetadataRoute } from 'next';
import { STORE_PRODUCTS, STORE_CATEGORIES } from '@/data/storeData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://web-store.vercel.app';
  const lastModified = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cloud-vps`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gio-hang`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Category Routes
  const categoryRoutes: MetadataRoute.Sitemap = STORE_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/san-pham?danh-muc=${cat.slug.replace(/^\//, '').replace(/^danh-muc\//, '')}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic Product Routes
  const productRoutes: MetadataRoute.Sitemap = STORE_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/san-pham/${prod.slug || prod.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
