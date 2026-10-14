import { auth } from './firebase';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getUserBadge(role) {
  if (role === 'admin') {
    return `<span class="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Portfolio Owner</span>`;
  }
  return `<span class="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">Scholar / Visitor</span>`;
}

export function formatRelativeTime(dateOrTimestamp) {
  if (!dateOrTimestamp) return 'Recently';
  let date;
  if (dateOrTimestamp.toDate && typeof dateOrTimestamp.toDate === 'function') {
    date = dateOrTimestamp.toDate();
  } else if (dateOrTimestamp instanceof Date) {
    date = dateOrTimestamp;
  } else if (typeof dateOrTimestamp === 'number' || typeof dateOrTimestamp === 'string') {
    date = new Date(dateOrTimestamp);
  } else {
    return 'Recently';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-serif text-ink mt-6 mb-3 font-bold">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-serif text-ink mt-8 mb-4 font-bold">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-serif text-ink mt-10 mb-5 font-bold">$1</h1>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^- (.*?)$/gm, '<li class="list-disc list-inside ml-4 my-1.5">$1</li>');
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-indigo-400 pl-4 py-1 italic my-4 text-stone-700 bg-stone-50 p-3 rounded-r-xl">$1</blockquote>');
  
  const paragraphs = html.split(/\n\s*\n/);
  const formattedParagraphs = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<blockquote')) {
      return trimmed;
    }
    return `<p class="mb-4 leading-relaxed font-sans text-sm md:text-base text-stone-700 font-normal">${trimmed.replace(/\n/g, '<br>')}</p>`;
  });
  
  return formattedParagraphs.filter(Boolean).join('\n');
}
