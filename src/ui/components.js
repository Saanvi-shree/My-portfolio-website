import { getUserBadge } from '../lib/utils';

export function renderPostCard(post, currentUser) {
  const isOwner = currentUser && (currentUser.uid === post.authorId || currentUser.role === 'admin');
  const hasImage = !!post.imageUrl;
  const hasDoc = !!post.documentUrl;
  const isFeatured = !!post.isFeatured;

  return `
    <article class="bg-white rounded-[32px] border border-border hover:border-lavender/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group font-sans">
      <div class="p-6 md:p-7 space-y-4">
        
        <!-- Header Badges -->
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="tag bg-lavender/10 text-lavender font-bold text-[9px] uppercase px-3 py-1 rounded-full">${post.category || 'General'}</span>
            ${isFeatured ? `
              <span class="tag bg-amber-50 text-amber-700 border border-amber-200/60 font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i> Featured
              </span>
            ` : ''}
            ${hasDoc ? `
              <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <i data-lucide="file-text" class="w-3 h-3"></i> Document
              </span>
            ` : ''}
          </div>
          <span class="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider font-mono">
            ${post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'Academic Entry'}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-serif font-bold text-ink leading-snug group-hover:text-lavender transition-colors cursor-pointer" onclick="window.viewPost('${post.id}')">
          ${post.title}
        </h3>

        <!-- Abstract / Subtitle -->
        ${post.abstract ? `
          <p class="text-xs font-semibold text-[#8A7DCB] leading-relaxed line-clamp-2">
            ${post.abstract}
          </p>
        ` : ''}

        <!-- Content Excerpt -->
        <p class="text-xs text-charcoal/70 leading-relaxed font-medium line-clamp-3">
          ${(post.content || '').replace(/#|\*|`|\[|\]/g, '').substring(0, 160)}...
        </p>

        <!-- Optional Image Thumbnail -->
        ${hasImage ? `
          <div class="rounded-2xl overflow-hidden aspect-video border border-border/60 bg-cream/20 relative cursor-pointer" onclick="window.viewPost('${post.id}')">
            <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          </div>
        ` : ''}

        <!-- Tech Stack / Tags -->
        ${post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${post.tags.slice(0, 4).map(t => `
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream/40 text-charcoal/60 border border-border/60">#${t}</span>
            `).join('')}
          </div>
        ` : ''}

      </div>

      <!-- Card Footer -->
      <div class="p-6 md:p-7 pt-0 border-t border-border/40 mt-2 flex items-center justify-between gap-3 text-xs">
        <button onclick="window.viewPost('${post.id}')" class="text-lavender hover:text-lavender-dark font-bold flex items-center gap-1.5 cursor-pointer uppercase text-[10px] tracking-wider">
          Explore Entry <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>

        <div class="flex items-center gap-2">
          ${hasDoc ? `
            <a href="${post.documentUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Download Attached Document">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
            </a>
          ` : ''}
          ${isOwner ? `
            <button onclick="window.handleEditPostInline('${post.id}')" class="p-2 rounded-xl bg-cream hover:bg-amber-50 text-gold transition-colors" title="Edit">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="window.handleDeletePost('${post.id}')" class="p-2 rounded-xl bg-rose-50/60 hover:bg-rose-50 text-rose-500 transition-colors" title="Delete">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

export function renderPostDetail(post, currentUser, comments = []) {
  const isOwner = currentUser && (currentUser.uid === post.authorId || currentUser.role === 'admin');
  const hasImage = !!post.imageUrl;
  const hasDoc = !!post.documentUrl;
  const formattedDate = post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'Documented Entry';

  return `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      
      <!-- Back Navigation -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <button onclick="window.navigateTo('home')" class="secondary-btn !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 rounded-full cursor-pointer">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back to Portfolio
        </button>

        <div class="flex items-center gap-2">
          ${isOwner ? `
            <button onclick="window.handleEditPostInline('${post.id}')" class="secondary-btn !py-2 !px-4 text-xs font-bold text-gold border-gold/30 hover:bg-amber-50 flex items-center gap-1.5 rounded-full cursor-pointer">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Entry
            </button>
            <button onclick="window.handleDeletePost('${post.id}')" class="secondary-btn !py-2 !px-4 text-xs font-bold text-rose-500 border-rose-200 hover:bg-rose-50 flex items-center gap-1.5 rounded-full cursor-pointer">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Main Article Container -->
      <article class="bg-white p-8 md:p-12 rounded-[40px] border border-border shadow-xs space-y-8">
        
        <!-- Header Info -->
        <div class="space-y-4 border-b border-border pb-6">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="tag bg-lavender/10 text-lavender font-bold uppercase text-[10px] px-3.5 py-1 rounded-full">${post.category || 'General'}</span>
            ${post.isFeatured ? `
              <span class="tag bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                <i data-lucide="star" class="w-3 h-3 fill-amber-500"></i> Featured Work
              </span>
            ` : ''}
            <span class="text-xs font-bold text-charcoal/40 uppercase font-mono">${formattedDate}</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
            ${post.title}
          </h1>

          ${post.abstract ? `
            <p class="text-base text-charcoal/80 font-medium leading-relaxed italic border-l-2 border-lavender pl-4">
              ${post.abstract}
            </p>
          ` : ''}

          <div class="flex items-center justify-between gap-4 pt-2 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-lavender/10 flex items-center justify-center text-lavender font-bold">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-ink">Saanvishree</p>
                <p class="text-[10px] text-charcoal/50 font-semibold">11th Grade High School Scholar</p>
              </div>
            </div>

            <!-- External Links (GitHub, Demo, Document) -->
            <div class="flex items-center gap-2">
              ${post.githubUrl ? `
                <a href="${post.githubUrl}" target="_blank" rel="noopener noreferrer" class="secondary-btn !py-1.5 !px-3 text-xs font-bold flex items-center gap-1.5 rounded-xl">
                  <i data-lucide="github" class="w-3.5 h-3.5"></i> Code Repo
                </a>
              ` : ''}
              ${post.demoUrl ? `
                <a href="${post.demoUrl}" target="_blank" rel="noopener noreferrer" class="premium-btn !py-1.5 !px-3 text-xs font-bold flex items-center gap-1.5 rounded-xl">
                  <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Live Demo / Link
                </a>
              ` : ''}
              ${hasDoc ? `
                <a href="${post.documentUrl}" target="_blank" rel="noopener noreferrer" class="secondary-btn !py-1.5 !px-3 text-xs font-bold bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 flex items-center gap-1.5 rounded-xl">
                  <i data-lucide="file-text" class="w-3.5 h-3.5"></i> View / Download Document
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Featured Media -->
        ${hasImage ? `
          <div class="rounded-3xl overflow-hidden border border-border shadow-xs bg-cream/20">
            <img src="${post.imageUrl}" alt="${post.title}" class="w-full max-h-[480px] object-cover">
          </div>
        ` : ''}

        <!-- Body Content -->
        <div class="prose max-w-none text-charcoal/80 text-sm sm:text-base leading-relaxed space-y-4 font-medium">
          ${formatContent(post.content)}
        </div>

        <!-- Tags -->
        ${post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? `
          <div class="pt-6 border-t border-border/60">
            <p class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40 mb-2">Relevant Competencies &amp; Topics</p>
            <div class="flex flex-wrap gap-2">
              ${post.tags.map(t => `
                <span class="px-3 py-1 rounded-xl bg-cream border border-border text-xs font-bold text-charcoal/70">#${t}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </article>

      <!-- Academic Peer & Mentor Notes Section -->
      <section class="bg-white p-8 rounded-[36px] border border-border shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-border pb-4">
          <h3 class="text-xl font-serif font-bold text-ink">Academic Notes &amp; Feedback</h3>
          <span class="text-xs font-bold text-charcoal/40 font-mono">${comments.length} Notes</span>
        </div>

        <!-- Comment Input -->
        ${currentUser ? `
          <form onsubmit="event.preventDefault(); window.handleAddComment('${post.id}');" class="space-y-3">
            <textarea id="comment-input-text" rows="3" placeholder="Leave constructive academic feedback, inquiries, or notes..." class="input-field text-xs font-medium resize-none leading-relaxed" required></textarea>
            <div class="flex justify-end">
              <button type="submit" class="premium-btn !py-2 !px-6 text-xs font-bold">Post Note</button>
            </div>
          </form>
        ` : `
          <div class="p-4 rounded-2xl bg-cream/30 border border-border/80 text-center text-xs text-charcoal/60 font-semibold">
            <button onclick="window.navigateTo('login')" class="text-lavender hover:underline font-bold">Sign In</button> to leave academic feedback and peer notes.
          </div>
        `}

        <!-- Comments List -->
        <div class="space-y-4 pt-2">
          ${comments.length > 0 ? comments.map(c => `
            <div class="p-4 rounded-2xl bg-cream/10 border border-border/60 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-ink">${c.authorName || 'Scholar'}</span>
                <span class="text-[10px] text-charcoal/40 font-mono">${c.createdAt?.toDate ? new Date(c.createdAt.toDate()).toLocaleDateString() : 'Recent'}</span>
              </div>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">${c.text || c.content}</p>
            </div>
          `).join('') : '<p class="text-xs text-charcoal/40 italic text-center py-4">No notes recorded yet. Be the first to add academic feedback.</p>'}
        </div>
      </section>

    </div>
  `;
}

function formatContent(text) {
  if (!text) return '';
  // Basic markdown parser for headings, bold, lists, and paragraphs
  return text
    .split('\n\n')
    .map(para => {
      if (para.startsWith('### ')) return `<h4 class="text-lg font-serif font-bold text-ink mt-4 mb-2">${para.replace('### ', '')}</h4>`;
      if (para.startsWith('## ')) return `<h3 class="text-xl font-serif font-bold text-ink mt-6 mb-2">${para.replace('## ', '')}</h3>`;
      if (para.startsWith('# ')) return `<h2 class="text-2xl font-serif font-bold text-ink mt-8 mb-3">${para.replace('# ', '')}</h2>`;
      if (para.startsWith('* ') || para.startsWith('- ')) {
        const items = para.split('\n').map(li => `<li class="flex items-start gap-2"><i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-lavender shrink-0 mt-1"></i><span>${li.replace(/^[-*]\s*/, '')}</span></li>`).join('');
        return `<ul class="space-y-1.5 my-3">${items}</ul>`;
      }
      return `<p class="leading-relaxed">${para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink font-bold">$1</strong>')}</p>`;
    })
    .join('');
}

export function renderPostModal(allCategories = []) {
  return `
    <div id="post-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md hidden animate-in fade-in duration-300 font-sans">
      <div class="bg-white w-full max-w-2xl max-h-[90vh] rounded-[36px] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        <!-- Modal Header -->
        <div class="p-6 border-b border-border/80 flex items-center justify-between bg-cream/10">
          <div>
            <h2 id="post-modal-title" class="text-2xl font-serif text-ink font-bold">Document Academic Entry</h2>
            <p class="text-xs text-charcoal/50 font-medium">Record projects, research, certifications, awards, or coursework.</p>
          </div>
          <button id="close-post-modal" class="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/40 hover:text-ink transition-colors cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="post-form" class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Entry Title</label>
            <input type="text" id="post-title" required placeholder="e.g. Algorithmic Modeling in High-School Physics" class="input-field font-semibold text-xs">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Academic Chapter / Category</label>
              <select id="post-category" class="input-field font-semibold text-xs">
                ${allCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Tags (comma separated)</label>
              <input type="text" id="post-tags" placeholder="Python, Calculus, CS50, Physics" class="input-field font-semibold text-xs">
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Abstract / Summary Statement</label>
            <input type="text" id="post-abstract" placeholder="Brief 1-2 sentence executive overview of this milestone..." class="input-field font-semibold text-xs">
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Detailed Documentation &amp; Learnings</label>
            <textarea id="post-content" required rows="6" placeholder="Describe the background, methodology, implementation, tech stack, and key outcomes..." class="input-field font-medium text-xs leading-relaxed resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">GitHub Repository URL (optional)</label>
              <input type="url" id="post-github-url" placeholder="https://github.com/..." class="input-field font-semibold text-xs">
            </div>
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Live Demo / Verification Link (optional)</label>
              <input type="url" id="post-demo-url" placeholder="https://..." class="input-field font-semibold text-xs">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Document Attachment URL (PDF, DOC, XLS)</label>
              <input type="url" id="post-doc-url" placeholder="https://.../research-paper.pdf" class="input-field font-semibold text-xs">
            </div>
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Visibility</label>
              <select id="post-visibility" class="input-field font-semibold text-xs">
                <option value="public" selected>Public (All Visitors)</option>
                <option value="private">Private (Restricted)</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="post-featured" class="w-4 h-4 rounded text-lavender focus:ring-lavender cursor-pointer">
            <label for="post-featured" class="text-xs font-bold text-ink cursor-pointer">Highlight as Featured Work on Homepage</label>
          </div>

          <!-- Image Dropzone / URL -->
          <div class="space-y-2 pt-2 border-t border-border/60">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Cover Image / Certificate Photo</label>
            <div id="post-dropzone" class="border border-dashed border-border hover:border-lavender rounded-2xl p-4 text-center cursor-pointer bg-cream/10">
              <p id="upload-status" class="text-xs text-charcoal/60 font-semibold">Click to upload photo via Cloudinary, or paste URL below</p>
              <div id="progress-container" class="hidden mt-2 w-full bg-cream rounded-full h-1.5 overflow-hidden">
                <div id="progress-bar" class="bg-lavender h-1.5 w-0 transition-all"></div>
              </div>
            </div>
            <input type="file" id="post-file" class="hidden" accept="image/*">
            <input type="text" id="post-image-url-input" placeholder="Or enter direct image URL..." class="input-field font-semibold text-xs mt-2">
            <input type="hidden" id="post-image-url" value="">
          </div>

        </form>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-border/80 flex justify-end gap-3 bg-cream/10">
          <button id="cancel-post" type="button" class="secondary-btn !py-2.5 !px-6 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
          <button id="save-post" type="button" class="premium-btn !py-2.5 !px-8 text-xs font-bold rounded-xl cursor-pointer">Save to Portfolio</button>
        </div>

      </div>
    </div>
  `;
}

export function renderCategoryModal() {
  return `
    <div id="category-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-ink/70 backdrop-blur-lg hidden animate-in fade-in duration-300 font-sans">
       <div class="bg-white w-full max-w-md rounded-[36px] shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border/50 flex items-center justify-between bg-cream/20">
             <h2 id="cat-modal-title" class="text-xl font-serif text-ink font-bold">Academic Division</h2>
             <button id="close-cat-modal" class="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/40 hover:text-ink transition-all">
                <i data-lucide="x" class="w-4 h-4"></i>
             </button>
          </div>
          <div class="p-6 space-y-4">
             <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Category Name</label>
                <input type="text" id="cat-name" placeholder="e.g. Projects, Research, Certifications" class="input-field text-xs">
             </div>
             <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Lucide Icon Name</label>
                <input type="text" id="cat-icon" placeholder="e.g. code-2, microscope, trophy, award" class="input-field text-xs" value="folder">
             </div>
             <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Display Order</label>
                <input type="number" id="cat-order" placeholder="0" class="input-field text-xs" value="0">
             </div>
             <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Color Theme (CSS Class)</label>
                <input type="text" id="cat-color" placeholder="bg-indigo-50" class="input-field text-xs" value="bg-indigo-50">
             </div>
             <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Brief Description</label>
                <textarea id="cat-desc" placeholder="Scope of this academic section..." class="input-field h-20 resize-none text-xs"></textarea>
             </div>
          </div>
          <div class="p-6 bg-cream/20 border-t border-border/50 flex gap-3">
             <button id="cancel-cat" class="secondary-btn flex-1 text-xs font-bold">Cancel</button>
             <button id="save-cat" class="premium-btn flex-1 text-xs font-bold">Save Category</button>
          </div>
       </div>
    </div>
  `;
}

export function renderUsernameModal() {
  return `
    <div id="username-modal" class="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-ink/70 backdrop-blur-lg animate-in fade-in duration-500 font-sans">
       <div class="bg-white w-full max-w-md rounded-[36px] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-700">
          <div class="w-16 h-16 bg-lavender/10 text-lavender rounded-2xl flex items-center justify-center mx-auto mb-6">
             <i data-lucide="graduation-cap" class="w-8 h-8"></i>
          </div>
          <h2 class="text-2xl font-serif text-ink mb-2 font-bold">Academic Identifier</h2>
          <p class="text-charcoal/60 mb-6 text-xs leading-relaxed font-medium">Please specify your scholar name or title to personalize your experience.</p>
          
          <div class="space-y-4">
             <input type="text" id="new-username" placeholder="e.g. Saanvishree or Scholar Name" class="input-field text-center text-sm font-semibold">
             <button id="save-username" class="premium-btn w-full py-3.5 text-xs font-bold">Enter Academic Portfolio</button>
          </div>
       </div>
    </div>
  `;
}

export function renderUserProfileView(user, userPosts, allCategories, userComments = [], loggedInUser = null) {
  const isOwnProfile = loggedInUser && loggedInUser.uid === user.uid;
  const displayNameValue = user.displayName || user.name || (user.role === 'admin' ? 'Saanvishree' : 'Scholar');
  const usernameValue = user.username || (user.role === 'admin' ? 'saanvishree' : 'scholar');
  const bioValue = user.bio || (user.role === 'admin' ? '11th-grade high school student passionate about computational research, STEM inquiry, and academic excellence.' : '');
  const hobbiesValue = user.hobbies || '';
  const interestsValue = user.interests || '';
  const quoteValue = user.favoriteQuote || '';
  const cityValue = user.city || '';

  return `
    <div class="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700 font-sans">
      
      <!-- Profile Header -->
      <div class="bg-white p-8 md:p-10 rounded-[40px] border border-border shadow-xs mb-8">
         <div class="flex flex-col md:flex-row gap-6 items-center">
            <div class="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-lavender shadow-sm shrink-0 bg-cream flex items-center justify-center">
               ${getUserBadge(displayNameValue, user.photoURL || user.profilePhoto, 'w-full h-full text-3xl')}
            </div>
            
            <div class="space-y-2 text-center md:text-left flex-1">
               <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
                  <h2 class="text-3xl font-serif text-ink font-bold">${displayNameValue}</h2>
                  <span class="tag bg-lavender/10 text-lavender border border-lavender/20 uppercase font-bold text-[9px] px-3 py-1 rounded-full">${user.role === 'admin' ? 'Portfolio Owner / 11th Grade' : 'Academic Visitor'}</span>
               </div>
               <p class="text-xs text-charcoal/50 font-semibold font-mono">@${usernameValue} • ${user.email}</p>
               <p class="text-xs text-charcoal/70 font-medium leading-relaxed mt-2">${bioValue}</p>
            </div>
         </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
         <div class="bg-white p-5 rounded-2xl border border-border text-center">
            <p class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Portfolio Items</p>
            <p class="text-2xl font-serif font-bold text-ink mt-1">${userPosts.length}</p>
         </div>
         <div class="bg-white p-5 rounded-2xl border border-border text-center">
            <p class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Academic Notes</p>
            <p class="text-2xl font-serif font-bold text-ink mt-1">${userComments.length}</p>
         </div>
         <div class="bg-white p-5 rounded-2xl border border-border text-center">
            <p class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Endorsements</p>
            <p class="text-2xl font-serif font-bold text-ink mt-1">${user.likesCount || 0}</p>
         </div>
         <div class="bg-white p-5 rounded-2xl border border-border text-center">
            <p class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Current Standing</p>
            <p class="text-sm font-bold text-lavender mt-2">11th Grade</p>
         </div>
      </div>

      <!-- Edit Form if Own Profile -->
      ${isOwnProfile ? `
        <div class="bg-white p-8 rounded-[40px] border border-border shadow-xs mb-8 space-y-6">
           <h3 class="text-2xl font-serif text-ink font-bold">Edit Academic Profile</h3>
           
           <form id="profile-edit-form" class="space-y-6" onsubmit="event.preventDefault(); window.handleProfileSave();">
              
              <!-- Photo Upload -->
              <div class="space-y-2">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Profile Picture</label>
                <div class="flex items-center gap-4">
                  <div class="relative w-16 h-16 rounded-2xl overflow-hidden border border-lavender shrink-0 bg-cream">
                    <img id="prof-photo-preview" src="${user.photoURL || user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}" class="w-full h-full object-cover">
                  </div>
                  <div class="flex-1">
                    <div id="prof-photo-dropzone" class="border border-dashed border-border rounded-xl p-3 text-center cursor-pointer hover:border-lavender text-xs text-charcoal/60 font-semibold">
                      <span id="prof-upload-status">Click to upload new photo (Cloudinary integrated)</span>
                      <div id="prof-progress-container" class="hidden mt-2 w-full bg-cream rounded-full h-1 overflow-hidden">
                        <div id="prof-progress-bar" class="bg-lavender h-1 w-0 transition-all"></div>
                      </div>
                    </div>
                    <input type="file" id="prof-photo-file" class="hidden" accept="image/*">
                    <input type="hidden" id="prof-photo-url" value="${user.photoURL || user.profilePhoto || ''}">
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Full Name</label>
                    <input type="text" id="prof-display-name" value="${displayNameValue}" class="input-field text-xs font-semibold" required>
                 </div>
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Username</label>
                    <input type="text" id="prof-username" value="${usernameValue}" class="input-field text-xs font-semibold" required>
                 </div>
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Role / Connection</label>
                    <select id="prof-relation" class="input-field text-xs font-semibold">
                       <option value="Student Scholar" selected>Student Scholar / Portfolio Owner</option>
                       <option value="Admissions Officer">University Admissions Officer</option>
                       <option value="Faculty / Mentor">Faculty / Academic Mentor</option>
                       <option value="Collaborator">Research Collaborator</option>
                    </select>
                 </div>
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Current City / Location</label>
                    <input type="text" id="prof-city" value="${cityValue}" placeholder="e.g. Bengaluru, India" class="input-field text-xs font-semibold">
                 </div>
              </div>

              <div class="space-y-1.5">
                 <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Academic Summary &amp; Bio</label>
                 <textarea id="prof-bio" class="input-field h-24 resize-none text-xs leading-relaxed" maxlength="400">${bioValue}</textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Technical Skills &amp; Proficiencies</label>
                    <input type="text" id="prof-hobbies" value="${hobbiesValue}" placeholder="e.g. Python, STEM Research, Quantitative Analysis" class="input-field text-xs font-semibold">
                 </div>
                 <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Academic Interests &amp; Extracurriculars</label>
                    <input type="text" id="prof-interests" value="${interestsValue}" placeholder="e.g. Machine Learning, Passionate dancer, Physics" class="input-field text-xs font-semibold">
                 </div>
              </div>

              <input type="hidden" id="prof-fav-chapter" value="Projects">
              <input type="hidden" id="prof-quote" value="${quoteValue}">
              <input type="hidden" id="prof-memory" value="">

              <div class="flex justify-end pt-2">
                 <button type="submit" id="save-profile-btn" class="premium-btn !px-8 text-xs font-bold">Save Changes</button>
              </div>
           </form>
        </div>
      ` : ''}

      <!-- Published Entries -->
      <div class="space-y-4 mb-8">
         <h3 class="text-2xl font-serif text-ink font-bold">Documented Work &amp; Entries</h3>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${userPosts.length > 0 ? userPosts.map(p => `
              <div class="p-5 bg-white border border-border rounded-2xl flex items-center justify-between hover:border-lavender transition-all cursor-pointer" onclick="window.viewPost('${p.id}')">
                 <div class="overflow-hidden pr-3">
                    <span class="text-[9px] bg-lavender/10 text-lavender px-2 py-0.5 rounded-md uppercase font-bold">${p.category || 'General'}</span>
                    <h4 class="text-base font-serif font-bold text-ink mt-2 truncate">${p.title}</h4>
                 </div>
                 <i data-lucide="chevron-right" class="w-4 h-4 text-lavender shrink-0"></i>
              </div>
            `).join('') : '<p class="text-xs text-charcoal/40 italic py-6">No published entries yet.</p>'}
         </div>
      </div>

    </div>
  `;
}

export function renderAboutView() {
  return `
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 font-sans pb-20">
      
      <!-- Top Title -->
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Profile</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">About Saanvishree</h1>
         <p class="text-sm text-charcoal/70 max-w-xl mx-auto font-medium">11th-Grade High School Student • STEM &amp; Computing Inquirer • Academic Portfolio</p>
      </div>

      <!-- Biography Card -->
      <div class="bg-white p-8 md:p-10 rounded-[36px] border border-border shadow-xs space-y-6">
         <h2 class="text-2xl font-serif font-bold text-ink border-b border-border pb-3">Academic Biography</h2>
         <p class="text-sm text-charcoal/70 leading-relaxed font-medium">
            I am currently an 11th-grade high school student dedicated to rigorous academic exploration across advanced mathematics, computer science, physical sciences, and technical problem-solving. This academic portfolio serves as a central repository documenting my independent research inquiries, computational projects, academic honors, coursework, and co-curricular pursuits.
         </p>
         <p class="text-sm text-charcoal/70 leading-relaxed font-medium">
            My goal is to build strong empirical foundations throughout high school to support upcoming university admissions, research fellowships, and long-term contributions in technology and scientific discovery.
         </p>
      </div>

      <!-- Core Dimensions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div class="bg-white p-7 rounded-[30px] border border-border space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <i data-lucide="compass" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-serif font-bold text-ink">Academic Focus Areas</h3>
            <ul class="text-xs text-charcoal/70 space-y-2 font-medium">
               <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-500"></i> Computer Science &amp; Algorithmic Development</li>
               <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-500"></i> Advanced Mathematics &amp; Quantitative Modeling</li>
               <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-500"></i> Applied Physics &amp; Experimental Sciences</li>
               <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-500"></i> Technical Writing &amp; Literature Review</li>
            </ul>
         </div>

         <div class="bg-white p-7 rounded-[30px] border border-border space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <i data-lucide="target" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-serif font-bold text-ink">University &amp; Career Aspirations</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
               Preparing for competitive undergraduate admissions at leading universities in Computer Science and Engineering. Aiming to participate in undergraduate research opportunities, technical internships, and collaborative scientific initiatives.
            </p>
         </div>

         <div class="bg-white p-7 rounded-[30px] border border-border space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
               <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-serif font-bold text-ink">Creative &amp; Co-Curricular Balance</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
               Beyond pure STEM disciplines, I am a passionate dancer and creative artist. Dance provides a disciplined, structured medium for artistic rhythm, stage poise, mental balance, and physical agility that deeply complements my analytical pursuits.
            </p>
         </div>

         <div class="bg-white p-7 rounded-[30px] border border-border space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
               <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-serif font-bold text-ink">Leadership &amp; Collaboration</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
               Active participant in school academic clubs, peer tutoring in STEM topics, competitive problem-solving challenges, and school science symposia.
            </p>
         </div>
      </div>

    </div>
  `;
}

export function renderEducationView() {
  return `
    <div class="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Timeline</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">Education &amp; Coursework</h1>
         <p class="text-sm text-charcoal/70 max-w-xl mx-auto font-medium">Structured documentation of current academic standing, curriculum, and milestones.</p>
      </div>

      <!-- Current Standing Card -->
      <div class="bg-white p-8 rounded-[36px] border border-border shadow-xs space-y-6">
         <div class="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4">
            <div>
               <span class="text-[10px] uppercase font-bold text-lavender tracking-wider">Current Institution</span>
               <h2 class="text-2xl font-serif font-bold text-ink mt-0.5">High School Scholar (11th Grade)</h2>
               <p class="text-xs text-charcoal/60 font-semibold mt-1">Pre-University / High School Academic Track</p>
            </div>
            <span class="tag bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase text-[10px]">In Progress • Class of 2027</span>
         </div>

         <div class="space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-charcoal/50">Core Academic Coursework</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div class="p-4 bg-cream/20 rounded-2xl border border-border/80">
                  <h4 class="font-bold text-ink text-xs">Mathematics &amp; Calculus</h4>
                  <p class="text-[11px] text-charcoal/60 mt-0.5">Functions, Differential Calculus, Coordinate Geometry, Trigonometry, Statistics</p>
               </div>
               <div class="p-4 bg-cream/20 rounded-2xl border border-border/80">
                  <h4 class="font-bold text-ink text-xs">Computer Science</h4>
                  <p class="text-[11px] text-charcoal/60 mt-0.5">Python Programming, Object-Oriented Principles, Data Structures, Web Foundations</p>
               </div>
               <div class="p-4 bg-cream/20 rounded-2xl border border-border/80">
                  <h4 class="font-bold text-ink text-xs">Physics</h4>
                  <p class="text-[11px] text-charcoal/60 mt-0.5">Mechanics, Kinematics, Thermodynamics, Electromagnetism Fundamentals</p>
               </div>
               <div class="p-4 bg-cream/20 rounded-2xl border border-border/80">
                  <h4 class="font-bold text-ink text-xs">Chemistry &amp; Laboratory Sciences</h4>
                  <p class="text-[11px] text-charcoal/60 mt-0.5">Physical Chemistry, Atomic Structure, Chemical Bonding, Practical Lab Inquiries</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Prior Milestones Card -->
      <div class="bg-white p-8 rounded-[36px] border border-border shadow-xs space-y-6">
         <div class="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4">
            <div>
               <span class="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Secondary School</span>
               <h2 class="text-2xl font-serif font-bold text-ink mt-0.5">10th Standard / Secondary School Board</h2>
               <p class="text-xs text-charcoal/60 font-semibold mt-1">Completed with High Distinction</p>
            </div>
            <span class="tag bg-lavender/10 text-lavender font-bold uppercase text-[10px]">Graduated Distinction</span>
         </div>
         <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
            Graduated 10th grade with outstanding performance across science, mathematics, literature, and social sciences, receiving recognition for academic consistency and active participation in school symposia.
         </p>
      </div>

    </div>
  `;
}

export function renderSkillsView() {
  return `
    <div class="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Competencies</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">Skills &amp; Interests</h1>
         <p class="text-sm text-charcoal/70 max-w-xl mx-auto font-medium">Technical capabilities, research competencies, tools, and creative pursuits.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         <!-- Technical & Programming -->
         <div class="bg-white p-7 rounded-[32px] border border-border shadow-xs space-y-4">
            <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <i data-lucide="code-2" class="w-4 h-4"></i>
               </div>
               <h3 class="text-lg font-serif font-bold text-ink">Technical &amp; Computing</h3>
            </div>
            <div class="space-y-3">
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-ink">Python Programming</span>
                     <span class="text-lavender">Advanced High-School Level</span>
                  </div>
                  <div class="w-full bg-cream h-2 rounded-full overflow-hidden">
                     <div class="bg-indigo-500 h-2 rounded-full w-4/5"></div>
                  </div>
               </div>
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-ink">Web Development (HTML/CSS/JS)</span>
                     <span class="text-lavender">Proficient</span>
                  </div>
                  <div class="w-full bg-cream h-2 rounded-full overflow-hidden">
                     <div class="bg-indigo-500 h-2 rounded-full w-3/4"></div>
                  </div>
               </div>
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-ink">Data Analysis &amp; Visualization</span>
                     <span class="text-lavender">Intermediate</span>
                  </div>
                  <div class="w-full bg-cream h-2 rounded-full overflow-hidden">
                     <div class="bg-indigo-500 h-2 rounded-full w-2/3"></div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Academic & Scientific Research -->
         <div class="bg-white p-7 rounded-[32px] border border-border shadow-xs space-y-4">
            <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <i data-lucide="microscope" class="w-4 h-4"></i>
               </div>
               <h3 class="text-lg font-serif font-bold text-ink">Research &amp; Methodology</h3>
            </div>
            <div class="space-y-2">
               <span class="tag bg-emerald-50 text-emerald-700 font-semibold text-[11px] mr-1.5 mb-1.5">Literature Synthesis</span>
               <span class="tag bg-emerald-50 text-emerald-700 font-semibold text-[11px] mr-1.5 mb-1.5">Empirical Data Gathering</span>
               <span class="tag bg-emerald-50 text-emerald-700 font-semibold text-[11px] mr-1.5 mb-1.5">Hypothesis Testing</span>
               <span class="tag bg-emerald-50 text-emerald-700 font-semibold text-[11px] mr-1.5 mb-1.5">Technical Report Writing</span>
               <span class="tag bg-emerald-50 text-emerald-700 font-semibold text-[11px] mr-1.5 mb-1.5">Scientific Presentation</span>
            </div>
         </div>

         <!-- Tools & Platforms -->
         <div class="bg-white p-7 rounded-[32px] border border-border shadow-xs space-y-4">
            <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <i data-lucide="cpu" class="w-4 h-4"></i>
               </div>
               <h3 class="text-lg font-serif font-bold text-ink">Tools &amp; Environments</h3>
            </div>
            <div class="flex flex-wrap gap-2 text-xs font-bold text-charcoal/70">
               <span class="px-3 py-1.5 rounded-xl bg-cream border border-border">VS Code</span>
               <span class="px-3 py-1.5 rounded-xl bg-cream border border-border">Git &amp; GitHub</span>
               <span class="px-3 py-1.5 rounded-xl bg-cream border border-border">Jupyter Notebooks</span>
               <span class="px-3 py-1.5 rounded-xl bg-cream border border-border">LaTeX &amp; Overleaf</span>
               <span class="px-3 py-1.5 rounded-xl bg-cream border border-border">Firebase &amp; Firestore</span>
            </div>
         </div>

         <!-- Interests & Co-Curriculars -->
         <div class="bg-white p-7 rounded-[32px] border border-border shadow-xs space-y-4">
            <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <i data-lucide="heart" class="w-4 h-4"></i>
               </div>
               <h3 class="text-lg font-serif font-bold text-ink">Interests &amp; Co-Curriculars</h3>
            </div>
            <div class="space-y-2 text-xs text-charcoal/70 font-medium">
               <p><strong class="text-ink">Passionate Dancer:</strong> Stage discipline, performance choreography, rhythm, and artistic poise.</p>
               <p><strong class="text-ink">Creative Arts:</strong> Painting, sketch journaling, and visual design.</p>
               <p><strong class="text-ink">STEM Reading:</strong> Emerging technologies, algorithmic history, and computational physics.</p>
            </div>
         </div>

      </div>

    </div>
  `;
}

export function renderResumeView() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-20" id="resume-container">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-4 select-none print:hidden">
        <div>
          <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Curriculum Vitae</span>
          <h1 class="text-3xl sm:text-4xl font-serif font-bold text-ink mt-1">Resume / CV</h1>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.print()" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-2 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="printer" class="w-4 h-4"></i> Print / Save as PDF
          </button>
          <button onclick="window.copyPortfolioLink()" class="secondary-btn !py-2.5 !px-4 text-xs font-bold flex items-center gap-1.5 rounded-xl cursor-pointer">
            <i data-lucide="share-2" class="w-4 h-4 text-lavender"></i> Share CV
          </button>
        </div>
      </div>

      <!-- Printable Resume Sheet -->
      <div class="bg-white p-8 md:p-12 rounded-[40px] border border-border shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
        
        <!-- Header -->
        <div class="border-b border-border pb-6 text-center space-y-2">
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-ink tracking-tight">SAANVISHREE</h2>
          <p class="text-xs uppercase tracking-widest text-[#8A7DCB] font-bold">11th-Grade High School Scholar • STEM &amp; Computational Research Track</p>
          <div class="flex items-center justify-center gap-4 text-xs text-charcoal/60 font-medium flex-wrap pt-2">
            <span>Portfolio: shreeverse.app</span>
            <span>•</span>
            <span>Contact: contact@shreeverse.academic</span>
            <span>•</span>
            <span>Standing: Class of 2027</span>
          </div>
        </div>

        <!-- Academic Summary -->
        <div class="space-y-2">
          <h3 class="text-xs uppercase font-bold tracking-wider text-[#8A7DCB] border-b border-border/80 pb-1">Academic Summary</h3>
          <p class="text-xs text-charcoal/80 leading-relaxed font-medium">
            Dedicated 11th-grade high school student with strong empirical foundations in advanced mathematics, Python programming, physics, and laboratory sciences. Actively conducting independent inquiry and building software applications to prepare for undergraduate studies in Computer Science and Engineering. Combines analytical rigor with co-curricular discipline as a passionate dancer and student tutor.
          </p>
        </div>

        <!-- Education -->
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-bold tracking-wider text-[#8A7DCB] border-b border-border/80 pb-1">Education</h3>
          
          <div class="space-y-1">
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span class="text-ink">Pre-University High School Scholar (11th Grade)</span>
              <span class="text-charcoal/50">Expected 2027</span>
            </div>
            <p class="text-xs text-charcoal/60">Core Coursework: Functions &amp; Calculus, Computer Science (Python/OOP), Mechanics &amp; Electromagnetism, Chemistry</p>
          </div>

          <div class="space-y-1 pt-2">
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span class="text-ink">Secondary School Board Examination (10th Standard)</span>
              <span class="text-charcoal/50">Completed</span>
            </div>
            <p class="text-xs text-charcoal/60">Graduated with High Distinction across Mathematics, Science, and Social Inquiries.</p>
          </div>
        </div>

        <!-- Technical & Academic Skills -->
        <div class="space-y-2">
          <h3 class="text-xs uppercase font-bold tracking-wider text-[#8A7DCB] border-b border-border/80 pb-1">Technical &amp; Research Competencies</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80">
            <p><strong class="text-ink">Languages &amp; Coding:</strong> Python, JavaScript, HTML5, CSS3, SQL basics</p>
            <p><strong class="text-ink">Tools &amp; Frameworks:</strong> Git/GitHub, VS Code, Jupyter Notebooks, LaTeX, Firebase</p>
            <p><strong class="text-ink">Scientific Methods:</strong> Quantitative Modeling, Data Analysis, Literature Review</p>
            <p><strong class="text-ink">Soft Competencies:</strong> Technical Writing, Scientific Presentation, Peer Mentoring</p>
          </div>
        </div>

        <!-- Projects & Research Highlights -->
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-bold tracking-wider text-[#8A7DCB] border-b border-border/80 pb-1">Selected Projects &amp; Research</h3>
          
          <div class="space-y-1">
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span class="text-ink">ShreeVerse Academic Portfolio &amp; AI Digital Twin</span>
              <span class="text-charcoal/50">2026</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed">
              Engineered a full-stack academic repository with Firebase Firestore persistence, Cloudinary document/asset management, and a custom Gemini-powered AI representative (Shree 2.0) trained on verified academic knowledge nodes.
            </p>
          </div>

          <div class="space-y-1 pt-2">
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span class="text-ink">Computational Simulations in Classical Mechanics</span>
              <span class="text-charcoal/50">2025</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed">
              Developed Python numerical algorithms using NumPy and Matplotlib to model non-linear oscillatory motion and trajectory dynamics under variable resistance parameters.
            </p>
          </div>
        </div>

        <!-- Co-Curricular & Leadership -->
        <div class="space-y-2">
          <h3 class="text-xs uppercase font-bold tracking-wider text-[#8A7DCB] border-b border-border/80 pb-1">Co-Curriculars &amp; Leadership</h3>
          <ul class="text-xs text-charcoal/80 space-y-1 list-disc list-inside">
            <li><strong class="text-ink">Passionate Dancer:</strong> Multi-year stage performance discipline, artistic rhythm, and choreography coordination.</li>
            <li><strong class="text-ink">STEM Peer Tutor:</strong> Volunteered weekly tutoring in algebra, trigonometry, and basic coding for junior high school students.</li>
            <li><strong class="text-ink">Science Fair Participant:</strong> Active presenter in annual high school science symposia and academic debates.</li>
          </ul>
        </div>

      </div>

    </div>
  `;
}

export function renderJourneyView() {
  return `
    <div class="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Milestones</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">Portfolio Journey</h1>
         <p class="text-sm text-charcoal/70 max-w-xl mx-auto font-medium">Chronological progression of academic milestones, research projects, and university roadmap.</p>
      </div>

      <!-- Timeline Structure -->
      <div class="space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-border/80">
        
        <!-- Grade 10 Milestone -->
        <div class="relative flex items-start gap-6 pl-2">
          <div class="w-12 h-12 rounded-full bg-white border-2 border-lavender flex items-center justify-center text-lavender font-bold shrink-0 z-10 shadow-xs">
            10
          </div>
          <div class="bg-white p-7 rounded-[30px] border border-border shadow-xs flex-1 space-y-2">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-lg font-serif font-bold text-ink">Secondary School Board Examination</h3>
              <span class="tag bg-emerald-50 text-emerald-700 font-bold uppercase text-[9px]">Completed • High Distinction</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Completed 10th grade with outstanding academic performance across science and mathematics, building foundational habits for computational inquiry.
            </p>
          </div>
        </div>

        <!-- Grade 11 Current Milestone -->
        <div class="relative flex items-start gap-6 pl-2">
          <div class="w-12 h-12 rounded-full bg-lavender text-white flex items-center justify-center font-bold shrink-0 z-10 shadow-md">
            11
          </div>
          <div class="bg-white p-7 rounded-[30px] border-2 border-lavender/40 shadow-xs flex-1 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-lg font-serif font-bold text-ink">High School Scholar — Advanced STEM Inquiry</h3>
              <span class="tag bg-lavender/10 text-lavender font-bold uppercase text-[9px]">Current Standing • Class of 2027</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Focused on advanced calculus, Python algorithmic development, experimental physics, technical certifications (CS50, Coursera), and independent research modeling.
            </p>
            <div class="flex gap-2 flex-wrap text-[10px] font-bold text-lavender">
              <span class="px-2.5 py-1 rounded-lg bg-lavender/10">In Progress</span>
              <span class="px-2.5 py-1 rounded-lg bg-cream border border-border text-charcoal/60">STEM Track</span>
            </div>
          </div>
        </div>

        <!-- Grade 12 Upcoming Milestone -->
        <div class="relative flex items-start gap-6 pl-2">
          <div class="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center text-charcoal/40 font-bold shrink-0 z-10">
            12
          </div>
          <div class="bg-white p-7 rounded-[30px] border border-border shadow-xs flex-1 space-y-2 opacity-85">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-lg font-serif font-bold text-ink">Grade 12 Capstone &amp; University Admissions</h3>
              <span class="tag bg-cream text-charcoal/60 font-bold uppercase text-[9px]">Upcoming 2026-2027</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Finalizing high school honors, capstone research paper, competitive university applications, and scholarship submissions in Computer Science and Engineering.
            </p>
          </div>
        </div>

        <!-- University Horizon Milestone -->
        <div class="relative flex items-start gap-6 pl-2">
          <div class="w-12 h-12 rounded-full bg-white border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold shrink-0 z-10 shadow-xs">
            <i data-lucide="graduation-cap" class="w-5 h-5"></i>
          </div>
          <div class="bg-white p-7 rounded-[30px] border border-[#C5A059]/30 shadow-xs flex-1 space-y-2">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-lg font-serif font-bold text-ink">Undergraduate Computer Science &amp; Research Track</h3>
              <span class="tag bg-amber-50 text-amber-700 font-bold uppercase text-[9px]">University Horizon</span>
            </div>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Pursuing undergraduate degree in Computer Science, engaging in academic laboratory research, collaborative open-source engineering, and industry internships.
            </p>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function renderMyWorkView(posts = []) {
  return `
    <div class="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Repository</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">Documented Work &amp; Artifacts</h1>
         <p class="text-sm text-charcoal/70 max-w-xl mx-auto font-medium">Browse computational projects, research inquiries, certificates, courses, and milestones.</p>
      </div>

      <!-- Filter Controls -->
      <div class="flex items-center justify-center gap-2 flex-wrap text-xs font-bold select-none pt-2">
        <button onclick="window.filterByCategory('')" class="py-2 px-4 rounded-xl bg-lavender text-white shadow-xs cursor-pointer">All Work (${posts.length})</button>
        <button onclick="window.filterByCategory('Projects')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Projects</button>
        <button onclick="window.filterByCategory('Research')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Research</button>
        <button onclick="window.filterByCategory('Certifications')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Certifications</button>
        <button onclick="window.filterByCategory('Achievements')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Achievements</button>
        <button onclick="window.filterByCategory('Courses')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Courses</button>
        <button onclick="window.filterByCategory('Activities')" class="py-2 px-4 rounded-xl bg-white border border-border hover:border-lavender text-charcoal/70 hover:text-lavender cursor-pointer">Activities</button>
      </div>

      <!-- Work Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        ${posts.length > 0 ? posts.map(p => renderPostCard(p, window.currentUser)).join('') : `
          <div class="col-span-full bg-white p-12 rounded-[36px] border border-border text-center space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-lavender/10 text-lavender flex items-center justify-center mx-auto">
              <i data-lucide="folder-open" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-serif font-bold text-ink">No Entries Documented Yet</h3>
            <p class="text-xs text-charcoal/60 max-w-md mx-auto">Academic milestones, projects, and research papers will appear here once published.</p>
          </div>
        `}
      </div>

    </div>
  `;
}

export function renderContactView() {
  return `
    <div class="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="text-center space-y-3">
         <span class="tag bg-lavender/10 text-lavender uppercase font-bold tracking-wider text-[10px]">Academic Inquiries</span>
         <h1 class="text-4xl sm:text-5xl font-serif font-bold text-ink">Contact &amp; Connect</h1>
         <p class="text-sm text-charcoal/70 max-w-lg mx-auto font-medium">Open to academic mentorship, research discussions, and university inquiry connections.</p>
      </div>

      <div class="bg-white p-8 md:p-10 rounded-[36px] border border-border shadow-xs space-y-8">
         <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="p-5 rounded-2xl bg-cream/20 border border-border/80 space-y-2">
               <div class="w-8 h-8 rounded-xl bg-lavender/10 text-lavender flex items-center justify-center">
                  <i data-lucide="mail" class="w-4 h-4"></i>
               </div>
               <h4 class="font-bold text-ink text-xs uppercase tracking-wider">Academic Inquiries</h4>
               <p class="text-xs text-charcoal/60 font-mono font-bold">contact@shreeverse.academic</p>
            </div>

            <div class="p-5 rounded-2xl bg-cream/20 border border-border/80 space-y-2">
               <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
               </div>
               <h4 class="font-bold text-ink text-xs uppercase tracking-wider">Academic Standing</h4>
               <p class="text-xs text-charcoal/60 font-semibold">11th Grade High School Scholar</p>
            </div>
         </div>

         <div class="border-t border-border/60 pt-6 space-y-4">
            <h3 class="text-lg font-serif font-bold text-ink">Send an Academic Message</h3>
            <form onsubmit="event.preventDefault(); window.showToast('Your message has been dispatched to Saanvishree.', 'success'); this.reset();" class="space-y-4">
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1">
                     <label class="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Your Name / Title</label>
                     <input type="text" required placeholder="e.g. Dr. Jane Smith" class="input-field text-xs font-semibold">
                  </div>
                  <div class="space-y-1">
                     <label class="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Your Email</label>
                     <input type="email" required placeholder="e.g. mentor@university.edu" class="input-field text-xs font-semibold">
                  </div>
               </div>
               <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Subject</label>
                  <input type="text" required placeholder="e.g. Research inquiry / Mentorship" class="input-field text-xs font-semibold">
               </div>
               <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Message</label>
                  <textarea rows="4" required placeholder="Write your message..." class="input-field resize-none text-xs leading-relaxed font-medium"></textarea>
               </div>
               <button type="submit" class="premium-btn w-full !py-3.5 text-xs font-bold uppercase tracking-wider">Send Inquiries</button>
            </form>
         </div>
      </div>
    </div>
  `;
}

export function renderProjectsView(posts = [], currentUser = null) {
  const projectPosts = posts.filter(p => (p.category || '').toLowerCase() === 'projects' || (p.tags || []).some(t => t.toLowerCase().includes('project') || t.toLowerCase().includes('code')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-indigo-50 text-indigo-700 uppercase font-bold tracking-wider text-[10px]">Computational &amp; Applied Engineering</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Projects &amp; Software</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Hands-on software development, algorithmic simulations, web platforms, and engineering inquiries built with Python, JavaScript, and computational tools.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Projects')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Document New Project
          </button>
        ` : ''}
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${projectPosts.length > 0 ? projectPosts.map(p => renderPostCard(p, currentUser)).join('') : `
          <!-- Featured Starter Project Cards -->
          <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">Python / Simulation</span>
                <span class="text-[10px] font-bold text-charcoal/40 font-mono">2026</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-ink">Non-Linear Physics &amp; Kinematics Simulator</h3>
              <p class="text-xs text-[#8A7DCB] font-semibold">Numerical differential solver for variable air-resistance projectile mechanics.</p>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
                Engineered a Python numerical engine utilizing NumPy and SciPy to model drag coefficients and multi-body gravitational trajectories with live Matplotlib visualizations.
              </p>
              <div class="flex flex-wrap gap-1.5 pt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Python</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#NumPy</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Mechanics</span>
              </div>
            </div>
            <div class="pt-4 border-t border-border/40 flex items-center justify-between">
              <span class="text-[10px] text-lavender font-bold uppercase tracking-wider">Independent Inquiry</span>
              <button onclick="window.showToast('Project repository available on request', 'info')" class="text-xs font-bold text-lavender hover:underline flex items-center gap-1">Details <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>

          <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">Web / AI Twin</span>
                <span class="text-[10px] font-bold text-charcoal/40 font-mono">2026</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-ink">ShreeVerse Academic Twin &amp; Knowledge Engine</h3>
              <p class="text-xs text-[#8A7DCB] font-semibold">Interactive portfolio with real-time Firebase sync and Gemini calibration.</p>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
                Designed a full-stack portfolio with persistent Firestore database, Cloudinary image pipeline, custom domain security rules, and conversational AI calibration.
              </p>
              <div class="flex flex-wrap gap-1.5 pt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#JavaScript</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Firebase</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Gemini</span>
              </div>
            </div>
            <div class="pt-4 border-t border-border/40 flex items-center justify-between">
              <span class="text-[10px] text-lavender font-bold uppercase tracking-wider">Active System</span>
              <button onclick="window.navigateTo('home')" class="text-xs font-bold text-lavender hover:underline flex items-center gap-1">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>

          <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">Algorithms</span>
                <span class="text-[10px] font-bold text-charcoal/40 font-mono">2025</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-ink">High-Performance Sorting &amp; Graph Visualizer</h3>
              <p class="text-xs text-[#8A7DCB] font-semibold">Interactive web visualizer of sorting time-complexity and BFS/DFS graphs.</p>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
                Implemented real-time step animations for QuickSort, MergeSort, Dijkstra, and A* pathfinding on custom grid topologies.
              </p>
              <div class="flex flex-wrap gap-1.5 pt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Algorithms</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#CS50</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#DataStructures</span>
              </div>
            </div>
            <div class="pt-4 border-t border-border/40 flex items-center justify-between">
              <span class="text-[10px] text-lavender font-bold uppercase tracking-wider">Coursework Capstone</span>
              <button onclick="window.showToast('CS50 Capstone Project', 'info')" class="text-xs font-bold text-lavender hover:underline flex items-center gap-1">Details <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
        `}
      </div>

    </div>
  `;
}

export function renderResearchView(posts = [], currentUser = null) {
  const researchPosts = posts.filter(p => (p.category || '').toLowerCase() === 'research' || (p.tags || []).some(t => t.toLowerCase().includes('research') || t.toLowerCase().includes('paper')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-emerald-50 text-emerald-700 uppercase font-bold tracking-wider text-[10px]">Academic Inquiry &amp; Scientific Method</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Research &amp; Papers</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Independent research papers, empirical studies, literature reviews, and scientific inquiries conducted across STEM disciplines.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Research')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Document Research Entry
          </button>
        ` : ''}
      </div>

      <!-- Research Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${researchPosts.length > 0 ? researchPosts.map(p => renderPostCard(p, currentUser)).join('') : `
          <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="tag bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase">Independent Study</span>
                <span class="text-[10px] font-bold text-charcoal/40 font-mono">11th Grade</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-ink">Comparative Analysis of Optimization Algorithms in Machine Learning</h3>
              <p class="text-xs text-emerald-700 font-semibold">Stochastic Gradient Descent vs. Adam in Non-Convex Parameter Spaces.</p>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
                Literature synthesis and mathematical evaluation exploring convergence rates, saddle-point escape dynamics, and hyperparameter sensitivity in neural network backpropagation.
              </p>
              <div class="flex flex-wrap gap-1.5 pt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Optimization</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Calculus</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#MachineLearning</span>
              </div>
            </div>
            <div class="pt-4 border-t border-border/40 flex items-center justify-between">
              <span class="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Working Paper</span>
              <button onclick="window.showToast('Research abstract and draft available on request', 'info')" class="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">Read Abstract <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>

          <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="tag bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase">Applied Sciences</span>
                <span class="text-[10px] font-bold text-charcoal/40 font-mono">High School</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-ink">Computational Fluid Dynamics Principles in Biological Motion</h3>
              <p class="text-xs text-emerald-700 font-semibold">Mathematical modeling of vortex generation and fluid resistance.</p>
              <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
                Investigated Navier-Stokes simplifications applied to rhythmic bio-mechanics, drawing connections between biological propulsion and physical fluid resistance.
              </p>
              <div class="flex flex-wrap gap-1.5 pt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Physics</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Biomechanics</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream text-charcoal/60">#Modeling</span>
              </div>
            </div>
            <div class="pt-4 border-t border-border/40 flex items-center justify-between">
              <span class="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Symposium Submission</span>
              <button onclick="window.showToast('Presented at High School Science Forum', 'info')" class="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">View Paper <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
        `}
      </div>

    </div>
  `;
}

export function renderAchievementsView(posts = [], currentUser = null) {
  const achPosts = posts.filter(p => (p.category || '').toLowerCase() === 'achievements' || (p.tags || []).some(t => t.toLowerCase().includes('award') || t.toLowerCase().includes('olympiad') || t.toLowerCase().includes('honor')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-amber-50 text-amber-700 uppercase font-bold tracking-wider text-[10px]">Honors, Competitions &amp; Distinctions</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Achievements &amp; Honors</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Recognition earned across academic Olympiads, science fairs, dance competitions, school distinctions, and leadership initiatives.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Achievements')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Achievement
          </button>
        ` : ''}
      </div>

      <!-- Honors Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-amber-600">Secondary School Board</span>
            <h3 class="text-xl font-serif font-bold text-ink">Academic Distinction Award (10th Standard)</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Graduated 10th grade with top-tier academic distinction, ranking among the highest percentiles in mathematics, physical sciences, and computer applications.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-amber-50 text-amber-700 font-bold text-[9px] uppercase">Board Honor</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-purple-600">Creative Arts &amp; Expression</span>
            <h3 class="text-xl font-serif font-bold text-ink">Classical Dance Excellence &amp; Stage Performance</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Achieved top accolades in inter-school cultural festivals and classical dance recitals, demonstrating multi-year discipline, choreography poise, and artistic expression.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-purple-50 text-purple-700 font-bold text-[9px] uppercase">Artistic Distinction</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i data-lucide="trophy" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Science Symposium</span>
            <h3 class="text-xl font-serif font-bold text-ink">High School STEM Inquiry Finalist</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Selected as a school science exhibition finalist for computational modeling in physics and presenting peer-reviewed empirical inquiry.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">STEM Recognition</span>
          </div>
        </div>

        ${achPosts.map(p => renderPostCard(p, currentUser)).join('')}
      </div>

    </div>
  `;
}

export function renderCertificationsView(posts = [], currentUser = null) {
  const certPosts = posts.filter(p => (p.category || '').toLowerCase() === 'certifications' || (p.tags || []).some(t => t.toLowerCase().includes('cert') || t.toLowerCase().includes('credential')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-violet-50 text-violet-700 uppercase font-bold tracking-wider text-[10px]">Verified Credentials &amp; Certifications</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Certifications &amp; Credentials</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Verified online coursework, competitive certifications, and credentials earned from leading universities and technical platforms.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Certifications')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Certification
          </button>
        ` : ''}
      </div>

      <!-- Certifications Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-violet-600">CS50 / Harvard Online</span>
            <h3 class="text-xl font-serif font-bold text-ink">Introduction to Computer Science</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Mastered foundational computer science concepts: algorithms, computational complexity (Big O), C memory management, Python, SQL, and full-stack development.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40 flex items-center justify-between">
            <span class="tag bg-violet-50 text-violet-700 font-bold text-[9px] uppercase">Verified Credential</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">Completed</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i data-lucide="code-2" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Python Institute</span>
            <h3 class="text-xl font-serif font-bold text-ink">Python Programming &amp; OOP Fundamentals</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Completed advanced Python programming track covering object-oriented architecture, modular development, exception handling, and data processing.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40 flex items-center justify-between">
            <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">Verified Track</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">Completed</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i data-lucide="book-open" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-600">STEM Workshop</span>
            <h3 class="text-xl font-serif font-bold text-ink">Quantitative Scientific Inquiries &amp; Lab Standards</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Certified high-school STEM workshop on empirical laboratory measurement, error propagation analysis, and scientific report documentation.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40 flex items-center justify-between">
            <span class="tag bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase">Workshop Credential</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">Completed</span>
          </div>
        </div>

        ${certPosts.map(p => renderPostCard(p, currentUser)).join('')}
      </div>

    </div>
  `;
}

export function renderCoursesView(posts = [], currentUser = null) {
  const coursePosts = posts.filter(p => (p.category || '').toLowerCase() === 'courses' || (p.tags || []).some(t => t.toLowerCase().includes('course') || t.toLowerCase().includes('curriculum')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-sky-50 text-sky-700 uppercase font-bold tracking-wider text-[10px]">Academic Curriculum &amp; Electives</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Courses &amp; Curriculum</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Detailed breakdown of advanced high school coursework, laboratory sciences, mathematics, and independent learning modules.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Courses')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Coursework Note
          </button>
        ` : ''}
      </div>

      <!-- Course Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-[32px] border border-border p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="tag bg-sky-50 text-sky-700 font-bold text-[9px] uppercase">Grade 11 Core</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">In Progress</span>
          </div>
          <h3 class="text-2xl font-serif font-bold text-ink">Advanced Mathematics &amp; Differential Calculus</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
            Rigorous curriculum covering limits, derivatives, rate of change, integration foundations, coordinate geometry, trigonometric transformations, and discrete probability distributions.
          </p>
          <div class="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-charcoal/60">
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Calculus</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Trigonometry</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Matrices</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="tag bg-sky-50 text-sky-700 font-bold text-[9px] uppercase">Grade 11 Core</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">In Progress</span>
          </div>
          <h3 class="text-2xl font-serif font-bold text-ink">Physics: Classical Mechanics &amp; Electromagnetism</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
            Theoretical principles and mathematical problem-solving in Newtonian mechanics, rotational dynamics, work-energy theorems, electrostatics, current electricity, and thermodynamics.
          </p>
          <div class="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-charcoal/60">
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Kinematics</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Dynamics</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Circuits</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="tag bg-sky-50 text-sky-700 font-bold text-[9px] uppercase">Grade 11 Core</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">In Progress</span>
          </div>
          <h3 class="text-2xl font-serif font-bold text-ink">Computer Science &amp; Software Architecture</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
            Python software engineering, computational thinking, algorithmic efficiency, data structures (lists, stacks, hash tables), and relational databases (SQL).
          </p>
          <div class="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-charcoal/60">
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Python OOP</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Data Structures</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">SQL</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="tag bg-sky-50 text-sky-700 font-bold text-[9px] uppercase">Grade 11 Core</span>
            <span class="text-xs font-bold text-charcoal/40 font-mono">In Progress</span>
          </div>
          <h3 class="text-2xl font-serif font-bold text-ink">Physical &amp; Inorganic Chemistry with Laboratory</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
            Atomic structures, chemical bonding, stoichiometry, equilibrium, thermodynamics, and hands-on quantitative laboratory titrations.
          </p>
          <div class="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-charcoal/60">
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Atomic Theory</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Thermodynamics</span>
            <span class="px-2.5 py-1 rounded-lg bg-cream border border-border">Lab Practicals</span>
          </div>
        </div>
      </div>

      ${coursePosts.length > 0 ? `
        <div class="pt-6 space-y-4">
          <h3 class="text-2xl font-serif font-bold text-ink">Additional Course Entries</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${coursePosts.map(p => renderPostCard(p, currentUser)).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function renderActivitiesView(posts = [], currentUser = null) {
  const actPosts = posts.filter(p => (p.category || '').toLowerCase() === 'activities' || (p.tags || []).some(t => t.toLowerCase().includes('dance') || t.toLowerCase().includes('club') || t.toLowerCase().includes('tutor') || t.toLowerCase().includes('leadership')));
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
    <div class="space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="tag bg-rose-50 text-rose-700 uppercase font-bold tracking-wider text-[10px]">Extracurriculars, Dance &amp; Student Leadership</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink mt-1">Activities &amp; Pursuits</h1>
          <p class="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-medium leading-relaxed">
            Balancing analytical rigor with creative expression: passionate dance performance, peer tutoring, academic clubs, and school initiatives.
          </p>
        </div>
        ${isOwner ? `
          <button onclick="window.openPostModalWithCategory('Activities')" class="premium-btn !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shrink-0 rounded-xl cursor-pointer shadow-md">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Activity
          </button>
        ` : ''}
      </div>

      <!-- Activities Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-purple-600">Creative Discipline</span>
            <h3 class="text-xl font-serif font-bold text-ink">Passionate Dancer &amp; Choreography</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Multi-year training in classical and contemporary dance forms. Dance instills rhythmic discipline, spatial mindfulness, stamina, and expressive balance that complements STEM problem-solving.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-purple-50 text-purple-700 font-bold text-[9px] uppercase">Ongoing Discipline</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <i data-lucide="users" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-rose-600">Community &amp; Mentorship</span>
            <h3 class="text-xl font-serif font-bold text-ink">STEM Peer Tutoring &amp; Study Circles</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Volunteer tutor helping junior high school peers with algebra, physics problem solving, and Python programming foundations during weekly study groups.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-rose-50 text-rose-700 font-bold text-[9px] uppercase">Peer Mentoring</span>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-border p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i data-lucide="compass" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Student Leadership</span>
            <h3 class="text-xl font-serif font-bold text-ink">School Science Club &amp; Coding Circles</h3>
            <p class="text-xs text-charcoal/70 leading-relaxed font-medium">
              Active participant in organizing science exhibition presentations, algorithmic challenge meetups, and guest speaker discussions.
            </p>
          </div>
          <div class="pt-4 border-t border-border/40">
            <span class="tag bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase">Club Member</span>
          </div>
        </div>

        ${actPosts.map(p => renderPostCard(p, currentUser)).join('')}
      </div>

    </div>
  `;
}

export function renderSiteSettingsModal(settings = {}) {
  const heroTitle = settings.heroTitle || "Saanvishree";
  const heroSubtitle = settings.heroSubtitle || "Just a growing girl.";
  const heroBio = settings.heroBio || "Just a growing girl exploring, creating, and dancing through life.";
  const heroTag = settings.heroTag || "Personal Space & Portfolio";
  const aboutBio = settings.aboutBio || "Just a growing girl navigating the world, learning new things every day, expressing creativity through dance and ideas, and building things with passion.";
  const quote = settings.quote || "Learning, growing, and dancing through every step.";

  return `
    <div id="site-settings-modal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md hidden animate-in fade-in duration-300 font-sans">
      <div class="bg-white w-full max-w-xl max-h-[90vh] rounded-[36px] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        <!-- Modal Header -->
        <div class="p-6 border-b border-border/80 flex items-center justify-between bg-cream/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-lavender/10 text-lavender flex items-center justify-center">
              <i data-lucide="edit-3" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-2xl font-serif text-ink font-bold">Customize Home Text &amp; Bio</h2>
              <p class="text-xs text-charcoal/50 font-medium">Edit the text appearing on your home screen anytime.</p>
            </div>
          </div>
          <button id="close-settings-modal" onclick="document.getElementById('site-settings-modal').classList.add('hidden')" class="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/40 hover:text-ink transition-colors cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="site-settings-form" onsubmit="event.preventDefault(); window.handleSaveSiteSettings();" class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Display Name / Title</label>
            <input type="text" id="setting-hero-title" value="${heroTitle}" required class="input-field font-semibold text-xs">
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Home Screen Tagline (Short &amp; Sweet)</label>
            <input type="text" id="setting-hero-subtitle" value="${heroSubtitle}" placeholder="Just a growing girl." required class="input-field font-semibold text-xs">
            <p class="text-[10px] text-charcoal/40 font-medium">e.g. "Just a growing girl."</p>
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Home Screen Description / Bio</label>
            <textarea id="setting-hero-bio" rows="3" required class="input-field font-medium text-xs leading-relaxed resize-none">${heroBio}</textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Top Badge / Pill Text</label>
              <input type="text" id="setting-hero-tag" value="${heroTag}" class="input-field font-semibold text-xs">
            </div>
            <div class="space-y-1">
              <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Personal Philosophy / Quote</label>
              <input type="text" id="setting-quote" value="${quote}" class="input-field font-semibold text-xs">
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">About Page Short Bio</label>
            <textarea id="setting-about-bio" rows="3" class="input-field font-medium text-xs leading-relaxed resize-none">${aboutBio}</textarea>
          </div>

        </form>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-border/80 flex justify-end gap-3 bg-cream/10">
          <button type="button" onclick="document.getElementById('site-settings-modal').classList.add('hidden')" class="secondary-btn !py-2.5 !px-6 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
          <button type="button" onclick="window.handleSaveSiteSettings()" id="btn-save-settings" class="premium-btn !py-2.5 !px-8 text-xs font-bold rounded-xl cursor-pointer shadow-md">Save Changes</button>
        </div>

      </div>
    </div>
  `;
}

export function renderAdminDashboardView(posts, categories, totalUsers, activeAdminTab = 'stories', memories = [], siteSettings = {}) {
  const totalStories = posts.length;
  let tabContentHtml = '';

  const heroTitle = siteSettings.heroTitle || "Saanvishree";
  const heroSubtitle = siteSettings.heroSubtitle || "Just a growing girl.";
  const heroBio = siteSettings.heroBio || "Just a growing girl exploring, creating, and dancing through life.";
  const heroTag = siteSettings.heroTag || "Personal Space & Portfolio";
  const aboutBio = siteSettings.aboutBio || "Just a growing girl navigating the world, learning new things every day, expressing creativity through dance and ideas, and building things with passion.";

  if (activeAdminTab === 'homepage') {
    tabContentHtml = `
      <div class="max-w-2xl bg-white p-8 rounded-[36px] border border-border shadow-xs space-y-6 font-sans">
        <div class="border-b border-border pb-4">
          <h3 class="text-2xl font-serif text-ink font-bold">Home Screen Text &amp; Bio Customizer</h3>
          <p class="text-xs text-charcoal/60 font-medium mt-1">Easily update your bio and the text appearing on your home screen.</p>
        </div>

        <form id="admin-homepage-form" onsubmit="event.preventDefault(); window.handleSaveSiteSettings();" class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Display Name / Title</label>
            <input type="text" id="setting-hero-title" value="${heroTitle}" required class="input-field font-semibold text-xs">
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Home Screen Tagline (Short &amp; Sweet)</label>
            <input type="text" id="setting-hero-subtitle" value="${heroSubtitle}" placeholder="Just a growing girl." required class="input-field font-semibold text-xs">
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Home Screen Description / Bio</label>
            <textarea id="setting-hero-bio" rows="3" required class="input-field font-medium text-xs leading-relaxed resize-none">${heroBio}</textarea>
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">Top Badge / Pill Text</label>
            <input type="text" id="setting-hero-tag" value="${heroTag}" class="input-field font-semibold text-xs">
          </div>

          <div class="space-y-1">
            <label class="font-bold uppercase tracking-wider text-[10px] text-charcoal/50">About Page Bio</label>
            <textarea id="setting-about-bio" rows="3" class="input-field font-medium text-xs leading-relaxed resize-none">${aboutBio}</textarea>
          </div>

          <div class="flex justify-end pt-4 border-t border-border/40">
            <button type="button" onclick="window.handleSaveSiteSettings()" id="btn-save-settings" class="premium-btn !py-3 !px-8 text-xs font-bold rounded-xl cursor-pointer shadow-md">
              Save Home Screen Changes
            </button>
          </div>
        </form>
      </div>
    `;
  } else if (activeAdminTab === 'stories') {
    const storiesListHtml = posts.map(p => `
      <div class="p-5 bg-white border border-border rounded-2xl flex flex-col md:flex-row md:items-center gap-4 justify-between hover:border-lavender transition-all">
         <div class="overflow-hidden space-y-1 flex-1">
            <div class="flex items-center gap-2">
               <span class="tag !mb-0 text-[9px] uppercase font-bold tracking-wider">${p.category || 'General'}</span>
               <span class="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">
                 ${p.createdAt?.toDate ? new Date(p.createdAt.toDate()).toLocaleDateString() : 'Just now'}
               </span>
               ${p.isFeatured ? '<span class="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">Featured</span>' : ''}
            </div>
            <h4 class="text-lg font-serif font-bold text-ink truncate">${p.title}</h4>
            <p class="text-[11px] text-charcoal/50 truncate font-medium">${(p.content || '').substring(0, 120)}...</p>
         </div>
         <div class="flex items-center gap-2 shrink-0">
            <button onclick="window.viewPost('${p.id}')" class="secondary-btn !py-1.5 !px-3 text-xs font-bold border-lavender/20 text-lavender hover:bg-lavender-light rounded-xl flex items-center gap-1 cursor-pointer">
               <i data-lucide="eye" class="w-3.5 h-3.5"></i> View
            </button>
            <button onclick="window.handleEditPostInline('${p.id}')" class="secondary-btn !py-1.5 !px-3 text-xs font-bold border-gold/20 text-gold hover:bg-amber-50 rounded-xl flex items-center gap-1 cursor-pointer">
               <i data-lucide="edit" class="w-3.5 h-3.5"></i> Edit
            </button>
            <button onclick="window.handleDeletePost('${p.id}')" class="secondary-btn !py-1.5 !px-3 text-xs font-bold border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-1 cursor-pointer">
               <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
         </div>
      </div>
    `).join('');

    tabContentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
         <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <h3 class="text-2xl font-serif text-ink font-bold">Manage Portfolio Entries</h3>
              <button onclick="window.openPostModal()" class="premium-btn !py-1.5 !px-4 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Entry
              </button>
            </div>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
               ${totalStories > 0 ? storiesListHtml : '<p class="text-charcoal/40 italic text-center py-8">No entries created yet.</p>'}
            </div>
         </div>

         <div class="space-y-6">
            <div class="space-y-3">
               <div class="flex items-center justify-between border-b border-border pb-3">
                 <h3 class="text-2xl font-serif text-ink font-bold">Academic Chapters</h3>
                 <button onclick="window.openCategoryModal(); document.getElementById('cat-modal-title').textContent = 'New Academic Division';" class="text-lavender hover:text-lavender-dark p-1 cursor-pointer">
                   <i data-lucide="plus-circle" class="w-5 h-5"></i>
                 </button>
               </div>
               <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  ${categories.map(c => `
                     <div class="p-3.5 bg-white border border-border/80 rounded-xl flex items-center justify-between shadow-xs">
                        <div class="flex items-center gap-2.5">
                           <div class="w-7 h-7 rounded-lg ${c.color || 'bg-lavender-light'} flex items-center justify-center text-charcoal/60">
                              <i data-lucide="${c.icon || 'folder'}" class="w-3.5 h-3.5"></i>
                           </div>
                           <span class="text-xs font-bold text-ink">${c.name}</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <button onclick="window.handleEditCategory('${c.id}')" class="p-1 text-lavender hover:text-lavender-dark transition-colors cursor-pointer" title="Edit">
                             <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                           </button>
                           <button onclick="window.handleDeleteCategory('${c.id}')" class="p-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer" title="Delete">
                             <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                           </button>
                        </div>
                     </div>
                  `).join('')}
               </div>
            </div>
         </div>
      </div>
    `;
  } else if (activeAdminTab === 'knowledge') {
    tabContentHtml = `
      <div class="space-y-6 font-sans">
         <div class="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-3">
            <h3 class="text-2xl font-serif text-ink font-bold">AI Knowledge Base (${memories.length} Nodes)</h3>
            <button onclick="window.navigateTo('training')" class="premium-btn !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="sparkles" class="w-4 h-4"></i> Enter Calibration Chamber
            </button>
         </div>

         <div class="p-4 bg-cream/10 rounded-2xl border border-border flex items-center gap-3">
            <div class="relative w-full max-w-md">
               <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 w-3.5 h-3.5"></i>
               <input type="text" id="admin-kb-search" oninput="window.filterAdminKbSearch()" placeholder="Search knowledge nodes..." class="w-full bg-white border border-border/80 pl-9 pr-4 py-2 rounded-xl text-xs outline-none">
            </div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="admin-kb-list">
            ${memories.map(m => `
               <div class="admin-kb-node bg-white p-5 rounded-2xl border border-border flex flex-col justify-between hover:border-gold/30 transition-all shadow-xs" data-search="${(m.category + ' ' + (m.question || m.title) + ' ' + (m.answer || m.content)).toLowerCase()}">
                  <div class="space-y-2">
                     <div class="flex items-center justify-between">
                        <span class="tag bg-gold/10 text-gold text-[9px] px-2.5 py-0.5 rounded-md font-sans font-bold uppercase">${m.category}</span>
                        <span class="text-[9px] text-charcoal/30 font-bold font-mono">${m.id}</span>
                     </div>
                     <h4 class="text-xs font-bold text-ink leading-relaxed">Q: ${m.question || m.title}</h4>
                     <p class="text-xs text-charcoal/70 leading-relaxed font-sans line-clamp-3">
                        A: ${m.answer || m.content}
                     </p>
                  </div>
                  <div class="flex justify-end gap-1.5 mt-4 border-t border-border/40 pt-3">
                     <button onclick="window.navigateTo('training')" class="p-1 px-3 bg-cream/20 hover:bg-lavender-light border border-border rounded-lg text-[10px] text-lavender font-bold flex items-center gap-1 cursor-pointer">
                       <i data-lucide="edit" class="w-3.5 h-3.5"></i> Calibrate
                     </button>
                     <button onclick="window.eraseSavedKnowledge('${m.id}')" class="p-1 px-3 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded-lg text-[10px] text-rose-500 font-bold flex items-center gap-1 cursor-pointer">
                       <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                     </button>
                  </div>
               </div>
            `).join('')}
         </div>
      </div>
    `;
  }

  return `
    <div class="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700 font-sans">
      <div class="mb-8 flex items-center justify-between flex-wrap gap-4 select-none">
         <div>
            <h1 class="text-4xl font-serif font-bold text-ink">Academic Portfolio Admin Hub</h1>
            <p class="text-charcoal/60 text-xs font-medium mt-1">Manage achievements, projects, research, courses, certifications, and AI assistant calibration.</p>
         </div>
         <span class="tag bg-lavender/10 text-lavender font-bold uppercase text-[9px] px-3.5 py-1">Admin Active</span>
      </div>

      <!-- Horizontal Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-border pb-3 mb-8 text-xs font-bold uppercase tracking-wider overflow-x-auto select-none">
         <button onclick="window.switchAdminTab('homepage')" class="py-2 px-4 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 
           ${activeAdminTab === 'homepage' ? 'bg-lavender text-white shadow-xs' : 'text-charcoal/60 hover:text-lavender hover:bg-lavender-light'}">
            <i data-lucide="layout" class="w-3.5 h-3.5"></i> Home Text &amp; Bio
         </button>
         <button onclick="window.switchAdminTab('stories')" class="py-2 px-4 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 
           ${activeAdminTab === 'stories' ? 'bg-lavender text-white shadow-xs' : 'text-charcoal/60 hover:text-lavender hover:bg-lavender-light'}">
            <i data-lucide="folder" class="w-3.5 h-3.5"></i> Entries &amp; Categories
         </button>
         <button onclick="window.switchAdminTab('knowledge')" class="py-2 px-4 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 
           ${activeAdminTab === 'knowledge' ? 'bg-lavender text-white shadow-xs' : 'text-charcoal/60 hover:text-lavender hover:bg-lavender-light'}">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> AI Knowledge Base
         </button>
      </div>

      <div class="min-h-[400px]">
        ${tabContentHtml}
      </div>
    </div>
  `;
}
