import { Post, CategoryType } from '../types';

/**
 * Ensures a post has a valid CategoryType and repairs any malformed or fee-table strings.
 */
export function normalizePostCategory(post: Post): Post {
  if (!post) return post;
  
  let cat = post.category ? String(post.category).toLowerCase().trim() : '';

  const validCategories: CategoryType[] = [
    'latest-jobs',
    'admit-card',
    'results',
    'answer-key',
    'admissions',
    'scholarships',
    'current-affairs',
    'quiz',
    'government-schemes',
    'syllabus',
    'blog'
  ];

  if (validCategories.includes(cat as CategoryType)) {
    return { ...post, category: cat as CategoryType };
  }

  // Infer from title / content if category is invalid
  const titleLower = (post.title || '').toLowerCase();
  
  if (
    titleLower.includes('admit card') ||
    titleLower.includes('hall ticket') ||
    titleLower.includes('call letter') ||
    titleLower.includes('e-admit') ||
    titleLower.includes('permission letter')
  ) {
    cat = 'admit-card';
  } else if (
    titleLower.includes('result') ||
    titleLower.includes('scorecard') ||
    titleLower.includes('merit list') ||
    titleLower.includes('marksheet') ||
    titleLower.includes('cutoff') ||
    titleLower.includes('selection list')
  ) {
    cat = 'results';
  } else if (
    titleLower.includes('answer key') ||
    titleLower.includes('response sheet') ||
    titleLower.includes('objection key') ||
    titleLower.includes('key paper')
  ) {
    cat = 'answer-key';
  } else if (
    titleLower.includes('admission') ||
    titleLower.includes('counseling') ||
    titleLower.includes('counselling') ||
    titleLower.includes('seat allotment') ||
    titleLower.includes('entrance test') ||
    titleLower.includes('cuet') ||
    titleLower.includes('b.ed') ||
    titleLower.includes('bstc')
  ) {
    cat = 'admissions';
  } else if (
    titleLower.includes('scholarship') ||
    titleLower.includes('fellowship') ||
    titleLower.includes('stipend') ||
    titleLower.includes('nsp ') ||
    titleLower.includes('fee reimbursement')
  ) {
    cat = 'scholarships';
  } else if (
    titleLower.includes('syllabu') ||
    titleLower.includes('exam pattern') ||
    titleLower.includes('curriculum')
  ) {
    cat = 'syllabus';
  } else if (
    titleLower.includes('yojana') ||
    titleLower.includes('scheme') ||
    titleLower.includes('pension') ||
    titleLower.includes('samman nidhi')
  ) {
    cat = 'government-schemes';
  } else if (
    titleLower.includes('blog') ||
    titleLower.includes('guide') ||
    titleLower.includes('strategy')
  ) {
    cat = 'blog';
  } else {
    cat = 'latest-jobs';
  }

  return { ...post, category: cat as CategoryType };
}

export function normalizePostsList(posts: Post[]): Post[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(normalizePostCategory);
}
