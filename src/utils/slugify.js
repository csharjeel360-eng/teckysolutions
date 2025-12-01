/**
 * Utility functions for slug generation and parsing
 */

// Convert title/name to URL-friendly slug
export const titleToSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

// Create slug with ID for uniqueness: "title-slug-123abc"
export const createSlug = (id, title) => {
  if (!id || !title) return '';
  const slug = titleToSlug(title);
  return `${slug}-${id}`;
};

// Extract ID from slug: "title-slug-123abc" -> "123abc"
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  const parts = slug.split('-');
  // ID is typically the last part after the last hyphen
  return parts[parts.length - 1];
};

// Set page title with domain
export const setPageTitle = (pageName) => {
  const domain = 'TrendyBreeze'; // Change to your domain/brand name
  if (pageName) {
    document.title = `${pageName} - ${domain}`;
  } else {
    document.title = domain;
  }
};
