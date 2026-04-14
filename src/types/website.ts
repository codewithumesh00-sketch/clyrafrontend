export type PageSchema = {
  title: string;
  slug: string;
  blocks: any[];
};

export type WebsiteSchema = {
  pages: PageSchema[];
};