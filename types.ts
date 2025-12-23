export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
}

export type ViewState = 'list' | 'detail';

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}