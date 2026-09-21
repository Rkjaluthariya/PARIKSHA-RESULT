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

  // Infer from title / content if category is invalid (support both Hindi & English)
  const titleLower = (post.title || '').toLowerCase();
  const shortInfoLower = (post.shortInfo || '').toLowerCase();
  const combinedText = `${titleLower} ${shortInfoLower}`;
  
  if (
    combinedText.includes('admit card') ||
    combinedText.includes('hall ticket') ||
    combinedText.includes('call letter') ||
    combinedText.includes('e-admit') ||
    combinedText.includes('permission letter') ||
    combinedText.includes('प्रवेश पत्र') ||
    combinedText.includes('एडमिट कार्ड') ||
    combinedText.includes('हॉल टिकट') ||
    combinedText.includes('कॉल लेटर')
  ) {
    cat = 'admit-card';
  } else if (
    combinedText.includes('result') ||
    combinedText.includes('scorecard') ||
    combinedText.includes('score card') ||
    combinedText.includes('merit list') ||
    combinedText.includes('marksheet') ||
    combinedText.includes('cutoff') ||
    combinedText.includes('cut off') ||
    combinedText.includes('selection list') ||
    combinedText.includes('परिणाम') ||
    combinedText.includes('रिजल्ट') ||
    combinedText.includes('स्कोरकार्ड') ||
    combinedText.includes('मेरिट लिस्ट') ||
    combinedText.includes('कट ऑफ') ||
    combinedText.includes('प्राप्तांक')
  ) {
    cat = 'results';
  } else if (
    combinedText.includes('answer key') ||
    combinedText.includes('response sheet') ||
    combinedText.includes('objection key') ||
    combinedText.includes('key paper') ||
    combinedText.includes('उत्तर कुंजी') ||
    combinedText.includes('आंसर की') ||
    combinedText.includes('उत्तर तालिका') ||
    combinedText.includes('उत्तर-कुंजी')
  ) {
    cat = 'answer-key';
  } else if (
    combinedText.includes('scholarship') ||
    combinedText.includes('fellowship') ||
    combinedText.includes('stipend') ||
    combinedText.includes('nsp ') ||
    combinedText.includes('fee reimbursement') ||
    combinedText.includes('छात्रवृत्ति') ||
    combinedText.includes('स्कॉलरशिप') ||
    combinedText.includes('फैलोशिप') ||
    combinedText.includes('वजीफा')
  ) {
    cat = 'scholarships';
  } else if (
    combinedText.includes('admission') ||
    combinedText.includes('counseling') ||
    combinedText.includes('counselling') ||
    combinedText.includes('seat allotment') ||
    combinedText.includes('entrance test') ||
    combinedText.includes('cuet') ||
    combinedText.includes('b.ed') ||
    combinedText.includes('bstc') ||
    combinedText.includes('jnvst') ||
    combinedText.includes('प्रवेश') ||
    combinedText.includes('नामांकन') ||
    combinedText.includes('काउंसलिंग')
  ) {
    cat = 'admissions';
  } else if (
    combinedText.includes('syllabu') ||
    combinedText.includes('exam pattern') ||
    combinedText.includes('curriculum') ||
    combinedText.includes('पाठ्यक्रम') ||
    combinedText.includes('परीक्षा पैटर्न')
  ) {
    cat = 'syllabus';
  } else if (
    combinedText.includes('yojana') ||
    combinedText.includes('scheme') ||
    combinedText.includes('pension') ||
    combinedText.includes('samman nidhi') ||
    combinedText.includes('योजना') ||
    combinedText.includes('पेंशन')
  ) {
    cat = 'government-schemes';
  } else if (
    combinedText.includes('blog') ||
    combinedText.includes('guide') ||
    combinedText.includes('strategy')
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
