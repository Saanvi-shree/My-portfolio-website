/* global FormData, FileReader, navigator */
import { createIcons, icons } from 'lucide';
import { 
  onAuth, 
  signOut, 
  handleGoogleLogin, 
  updateProfile, 
  handleEmailSignup, 
  handleEmailLogin, 
  handleForgotPassword
} from './lib/auth';

import { 
  subscribeToPosts, 
  subscribeToPostDetails, 
  createPost, 
  updatePost, 
  deletePost 
} from './lib/posts';

import { 
  addComment, 
  subscribeToComments 
} from './lib/comments';

import { 
  initCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  subscribeToCategories, 
  subscribeToAiMemories, 
  createAiMemory, 
  updateAiMemory, 
  deleteAiMemory 
} from './lib/admin';

import { initResponsiveControllers } from './lib/responsive';

import { 
  renderPostCard, 
  renderPostDetail, 
  renderPostModal, 
  renderCategoryModal, 
  renderUsernameModal, 
  renderUserProfileView, 
  renderAdminDashboardView, 
  renderAboutView, 
  renderEducationView, 
  renderSkillsView, 
  renderProjectsView,
  renderResearchView,
  renderAchievementsView,
  renderCertificationsView,
  renderCoursesView,
  renderActivitiesView,
  renderContactView, 
  renderResumeView, 
  renderJourneyView, 
  renderMyWorkView,
  renderSiteSettingsModal
} from './ui/components';

import { saveSiteSettings, subscribeToSiteSettings } from './lib/settings';

import { renderAppLayout, renderLoginLayout, renderTrainingView } from './ui/layout';

// Global state
let currentUser = null;
let allPosts = [];
let allCategories = [];
let allMemories = [];
let activeCategory = null;
let activeView = 'home'; // 'home' | 'about' | 'education' | 'skills' | 'projects' | 'research' | 'achievements' | 'certifications' | 'courses' | 'activities' | 'contact' | 'resume' | 'journey' | 'my-work' | 'training' | 'admin' | 'profile'
let profileSelectedUserId = null;
let activeAdminTab = 'homepage';
let editingPostId = null;
let editingCategoryId = null;
let isChatbotOpen = false;
let chatHistory = [];
let isRegisterMode = false;
let currentSiteSettings = {
  heroTitle: 'Saanvishree',
  heroSubtitle: 'Just a growing girl.',
  heroBio: 'Just a growing girl exploring the world, learning new things every day, expressing creativity through dance and ideas, and building things with passion.',
  heroTag: 'Personal Space & Portfolio',
  aboutBio: 'Hi, I am Saanvishree — a passionate student, dancer, and learner exploring science, technology, and creative arts.'
};

// Subscriptions
let postsUnsubscribe = null;
let categoriesUnsubscribe = null;
let memoriesUnsubscribe = null;
let siteSettingsUnsubscribe = null;
let detailUnsubscribe = null;
let commentsUnsubscribe = null;

const appElement = document.getElementById('app');

// Toast notifications
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const isError = type === 'error';
  toast.className = `fixed bottom-24 right-4 md:right-8 z-[200] max-w-sm w-full bg-white rounded-2xl p-4 shadow-xl border ${isError ? 'border-rose-100 text-rose-800' : 'border-emerald-100 text-emerald-800'} flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans`;
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full ${isError ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'} flex items-center justify-center shrink-0">
      <i data-lucide="${isError ? 'x-circle' : 'check-circle'}" class="w-5 h-5"></i>
    </div>
    <div class="text-xs font-bold leading-normal text-charcoal/80">${message}</div>
  `;
  document.body.appendChild(toast);
  createIcons({ icons });

  setTimeout(() => {
    toast.classList.add('animate-out', 'fade-out', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;

export function showConfirm(message, onConfirm) {
  const dialog = document.createElement('div');
  dialog.className = 'fixed inset-0 bg-ink/75 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans';
  dialog.innerHTML = `
    <div class="bg-white max-w-md w-full rounded-[36px] p-8 shadow-2xl border border-border text-center transform scale-95 animate-in zoom-in-95 duration-300 space-y-4">
      <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
        <i data-lucide="alert-triangle" class="w-6 h-6"></i>
      </div>
      <h3 class="text-xl font-serif font-bold text-ink">Confirmation</h3>
      <p class="text-xs text-charcoal/60 leading-relaxed font-medium">${message}</p>
      <div class="flex gap-3 pt-2">
        <button id="dialog-cancel" class="secondary-btn flex-1 text-xs font-bold py-2.5 rounded-xl cursor-pointer">Cancel</button>
        <button id="dialog-confirm" class="premium-btn flex-1 text-xs font-bold py-2.5 rounded-xl cursor-pointer">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  createIcons({ icons });

  dialog.querySelector('#dialog-cancel').onclick = () => dialog.remove();
  dialog.querySelector('#dialog-confirm').onclick = () => {
    dialog.remove();
    onConfirm();
  };
}
window.showConfirm = showConfirm;

window.copyPortfolioLink = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    showToast("Portfolio link copied to clipboard!", "success");
  } else {
    showToast("URL: " + window.location.href, "info");
  }
};

window.editSavedKnowledge = (id, category, question, answer) => {
  if (activeView !== 'training') {
    activeView = 'training';
    renderCurrentActiveView();
  }
  
  setTimeout(() => {
    window.activeInterviewCategory = category;
    const textEl = document.getElementById('interview-response-input');
    const questionTextEl = document.getElementById('interview-active-question-text');
    const indicator = document.getElementById('active-session-indicator');
    const statusLabel = document.getElementById('interview-status-label');

    if (questionTextEl) questionTextEl.textContent = `"${question}"`;
    if (indicator) indicator.textContent = `Active: ${category}`;
    if (textEl) {
      textEl.value = answer || '';
      textEl.focus();
    }
    if (statusLabel) statusLabel.textContent = `Editing Node: ${category}`;

    document.getElementById('interview-response-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`Loaded node "${category}" for revision.`, "info");
  }, 100);
};

window.eraseSavedKnowledge = async (id) => {
  showConfirm("Dissolve this academic knowledge node from Shree 2.0?", async () => {
    try {
      await deleteAiMemory(id);
      showToast("Knowledge node erased.", "success");
    } catch (e) {
      showToast("Error erasing node: " + e.message, "error");
    }
  });
};

// Initial App Entry
async function init() {
  onAuth(async (user) => {
    currentUser = user;
    if (user && !user.username && !user.name) {
      showUsernameModal(user);
    }
    await renderApp();
  });
}

function showUsernameModal(user) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;
  modalContainer.innerHTML += renderUsernameModal();
  createIcons({ icons });

  const saveBtn = document.getElementById('save-username');
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const input = document.getElementById('new-username');
      const val = input ? input.value.trim() : '';
      if (!val) return showToast("Please enter a name.", "error");

      try {
        await updateProfile(user.uid, {
          displayName: user.role === 'admin' ? 'Saanvishree' : val,
          username: user.role === 'admin' ? 'saanvishree' : val.toLowerCase().replace(/\s+/g, '_')
        });
        document.getElementById('username-modal')?.remove();
        showToast("Profile identifier established!", "success");
        await renderApp();
      } catch (e) {
        showToast("Error establishing identifier: " + e.message, "error");
      }
    };
  }
}

function renderLogin() {
  appElement.innerHTML = renderLoginLayout();
  createIcons({ icons });
  setupLoginEvents();
}

function setupLoginEvents() {
  window.switchAuthFormMode = (mode) => {
    isRegisterMode = mode === 'signup';
    const btnLogin = document.getElementById('btn-toggle-login');
    const btnSignup = document.getElementById('btn-toggle-signup');
    const extraFields = document.getElementById('signup-extra-fields');
    const primaryBtn = document.getElementById('auth-primary-action-btn');
    const panelTitle = document.getElementById('auth-panel-title');
    const tagline = document.getElementById('auth-panel-tagline');

    if (isRegisterMode) {
      if (btnLogin) btnLogin.className = "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider text-charcoal/40 hover:text-lavender cursor-pointer select-none";
      if (btnSignup) btnSignup.className = "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider bg-white shadow-xs text-lavender cursor-pointer select-none";
      if (extraFields) extraFields.classList.remove('hidden');
      if (primaryBtn) primaryBtn.innerHTML = `<i data-lucide="user-plus" class="w-4 h-4 font-sans"></i> Register Account`;
      if (panelTitle) panelTitle.textContent = "Register Academic Profile";
      if (tagline) tagline.textContent = "Create an account to participate in academic discussions and review entries.";
    } else {
      if (btnLogin) btnLogin.className = "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider bg-white shadow-xs text-lavender cursor-pointer select-none";
      if (btnSignup) btnSignup.className = "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider text-charcoal/40 hover:text-lavender cursor-pointer select-none";
      if (extraFields) extraFields.classList.add('hidden');
      if (primaryBtn) primaryBtn.innerHTML = `<i data-lucide="key-round" class="w-4 h-4 font-sans"></i> Sign In to Portfolio`;
      if (panelTitle) panelTitle.textContent = "Academic Portal";
      if (tagline) tagline.textContent = "Sign in to access portfolio management, reflections, and academic archives.";
    }
    createIcons({ icons });
  };

  window.handleGoogleLogin = async () => {
    try {
      showToast("Connecting to Google authentication...", "info");
      await handleGoogleLogin();
      showToast("Signed in with Google successfully!", "success");
    } catch (e) {
      showToast("Google connection declined: " + e.message, "error");
    }
  };

  window.handleQuickAdminLogin = async () => {
    try {
      currentUser = {
        uid: 'saanvishree-owner-uid',
        email: 'saanvishree.academic@portfolio.io',
        displayName: 'Saanvishree',
        name: 'Saanvishree',
        role: 'admin',
        username: 'saanvishree',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
      };
      showToast("Signed in as Admin Saanvishree!", "success");
      window.navigateTo('home');
    } catch (e) {
      showToast("Admin access error: " + e.message, "error");
    }
  };

  window.showForgotPasswordDialog = async () => {
    const email = document.getElementById('auth-email')?.value.trim();
    if (!email) return showToast("Enter your email address above to receive reset instructions.", "error");

    try {
      await handleForgotPassword(email);
      showToast("Password reset link sent to your email!", "success");
    } catch (e) {
      showToast("Reset failed: " + e.message, "error");
    }
  };

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email')?.value.trim();
      const password = document.getElementById('auth-password')?.value;

      if (!email || !password) return showToast("Email and password credentials required.", "error");

      try {
        if (isRegisterMode) {
          const displayName = document.getElementById('auth-displayName')?.value.trim() || email.split('@')[0];
          const relationship = document.getElementById('auth-relationship')?.value || "Academic Visitor";
          window.pendingRegName = displayName;
          window.pendingRegRelation = relationship;
          await handleEmailSignup(email, password);
          showToast("Account registered successfully!", "success");
        } else {
          await handleEmailLogin(email, password);
          showToast("Welcome back, Saanvishree!", "success");
        }
      } catch (err) {
        showToast(err.message || "Authentication failed.", "error");
      }
    };
  }
}

async function renderApp() {
  const isLoggedIn = !!currentUser;
  appElement.innerHTML = renderAppLayout(isLoggedIn, currentUser, activeCategory, activeView, currentSiteSettings);

  const modalContainer = document.getElementById('modal-container');
  if (modalContainer && isLoggedIn) {
    modalContainer.innerHTML = renderPostModal(allCategories);
    if (currentUser.role === 'admin') {
      modalContainer.innerHTML += renderCategoryModal();
    }
  }

  createIcons({ icons });
  attachAppEvents();
  await loadAllData();
  await renderCurrentActiveView();
}

window.openSiteSettingsModal = () => {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;
  const existing = document.getElementById('site-settings-modal');
  if (existing) existing.remove();
  modalContainer.insertAdjacentHTML('beforeend', renderSiteSettingsModal(currentSiteSettings));
  createIcons({ icons });
};

window.closeSiteSettingsModal = () => {
  document.getElementById('site-settings-modal')?.remove();
};

window.handleSaveSiteSettings = async () => {
  const heroTitle = document.getElementById('setting-hero-title')?.value.trim() || 'Saanvishree';
  const heroSubtitle = document.getElementById('setting-hero-subtitle')?.value.trim() || 'Just a growing girl.';
  const heroBio = document.getElementById('setting-hero-bio')?.value.trim() || 'Just a growing girl exploring the world.';
  const heroTag = document.getElementById('setting-hero-tag')?.value.trim() || 'Personal Space & Portfolio';
  const aboutBio = document.getElementById('setting-about-bio')?.value.trim() || '';

  try {
    showToast("Updating home screen bio & text...", "info");
    const updated = await saveSiteSettings({
      heroTitle,
      heroSubtitle,
      heroBio,
      heroTag,
      aboutBio
    });
    currentSiteSettings = updated;
    window.closeSiteSettingsModal();
    showToast("Home screen updated successfully!", "success");
    await renderApp();
  } catch (e) {
    showToast("Error saving home settings: " + e.message, "error");
  }
};

window.navigateTo = (view, targetUid) => {
  if (view === 'login') {
    renderLogin();
    return;
  }
  activeCategory = null;
  activeView = view;
  if (view === 'profile') {
    profileSelectedUserId = targetUid || currentUser?.uid || null;
  } else {
    profileSelectedUserId = null;
  }
  renderApp();
};

window.filterByCategory = (categoryName) => {
  activeCategory = categoryName || null;
  activeView = 'home';
  renderApp();
};

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
};

window.handleLogout = () => {
  signOut();
  showToast("Signed out successfully.", "success");
};

window.openPostModal = () => {
  editingPostId = null;
  const modal = document.getElementById('post-modal');
  if (modal) {
    document.getElementById('post-title').value = '';
    document.getElementById('post-abstract').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-tags').value = '';
    document.getElementById('post-github-url').value = '';
    document.getElementById('post-demo-url').value = '';
    document.getElementById('post-doc-url').value = '';
    document.getElementById('post-image-url').value = '';
    document.getElementById('post-image-url-input').value = '';
    document.getElementById('post-featured').checked = false;
    document.getElementById('post-modal-title').textContent = 'Document Academic Entry';
    modal.classList.remove('hidden');
  } else {
    showToast("Please sign in to document an academic entry.", "error");
    renderLogin();
  }
};

window.openCategoryModal = () => {
  const modal = document.getElementById('category-modal');
  if (modal) {
    editingCategoryId = null;
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-icon').value = 'folder';
    document.getElementById('cat-order').value = '0';
    document.getElementById('cat-color').value = 'bg-indigo-50';
    document.getElementById('cat-desc').value = '';
    modal.classList.remove('hidden');
  }
};

function attachAppEvents() {
  initResponsiveControllers();

  if (currentUser) {
    const postModal = document.getElementById('post-modal');
    if (postModal) {
      document.getElementById('close-post-modal')?.addEventListener('click', () => postModal.classList.add('hidden'));
      document.getElementById('cancel-post')?.addEventListener('click', () => postModal.classList.add('hidden'));
      document.getElementById('save-post')?.addEventListener('click', handlePostSubmit);
      setupPostMediaUpload();
    }

    const catModal = document.getElementById('category-modal');
    if (catModal) {
      document.getElementById('close-cat-modal')?.addEventListener('click', () => catModal.classList.add('hidden'));
      document.getElementById('cancel-cat')?.addEventListener('click', () => catModal.classList.add('hidden'));
      document.getElementById('save-cat')?.addEventListener('click', handleCategorySubmit);
    }
  }

  setupChatbotControllers();
}

function setupPostMediaUpload() {
  const dropzone = document.getElementById('post-dropzone');
  const fileInput = document.getElementById('post-file');
  const hiddenUrl = document.getElementById('post-image-url');
  const statusEl = document.getElementById('upload-status');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const urlInput = document.getElementById('post-image-url-input');

  if (!dropzone || !fileInput) return;

  dropzone.onclick = () => fileInput.click();

  if (urlInput) {
    urlInput.oninput = () => {
      hiddenUrl.value = urlInput.value.trim();
    };
  }

  fileInput.onchange = async () => {
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) return showToast("Please select an image file.", "error");

    if (progressContainer) progressContainer.classList.remove('hidden');
    if (progressBar) progressBar.style.width = '40%';
    if (statusEl) statusEl.textContent = "Uploading image...";

    try {
      const configRes = await fetch('/api/config');
      const config = await configRes.json();
      const { cloudinaryCloudName, cloudinaryUploadPreset } = config;

      if (cloudinaryCloudName && cloudinaryUploadPreset) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
        const data = await uploadRes.json();
        if (data.secure_url) {
          hiddenUrl.value = data.secure_url;
          if (urlInput) urlInput.value = data.secure_url;
          if (statusEl) statusEl.textContent = "Image uploaded successfully via Cloudinary!";
          showToast("Cover photo uploaded to Cloudinary!", "success");
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          hiddenUrl.value = e.target.result;
          if (statusEl) statusEl.textContent = "Saved photo locally (Base64).";
          showToast("Photo stored locally.", "success");
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      console.warn("Upload fallback to base64:", e);
      const reader = new FileReader();
      reader.onload = (ev) => {
        hiddenUrl.value = ev.target.result;
        if (statusEl) statusEl.textContent = "Stored locally as Base64.";
      };
      reader.readAsDataURL(file);
    } finally {
      if (progressContainer) progressContainer.classList.add('hidden');
    }
  };
}

async function handlePostSubmit() {
  const title = document.getElementById('post-title')?.value.trim();
  const category = document.getElementById('post-category')?.value;
  const abstract = document.getElementById('post-abstract')?.value.trim();
  const content = document.getElementById('post-content')?.value.trim();
  const tagsRaw = document.getElementById('post-tags')?.value.trim();
  const githubUrl = document.getElementById('post-github-url')?.value.trim();
  const demoUrl = document.getElementById('post-demo-url')?.value.trim();
  const documentUrl = document.getElementById('post-doc-url')?.value.trim();
  const visibility = document.getElementById('post-visibility')?.value || 'public';
  const isFeatured = document.getElementById('post-featured')?.checked || false;
  const imageUrl = document.getElementById('post-image-url')?.value.trim() || document.getElementById('post-image-url-input')?.value.trim() || '';

  if (!title || !content) return showToast("Please provide both title and content.", "error");

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  const saveBtn = document.getElementById('save-post');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  try {
    const payload = {
      title,
      abstract,
      content,
      category: category || 'General',
      tags,
      githubUrl,
      demoUrl,
      documentUrl,
      visibility,
      isFeatured,
      imageUrl,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.name || (currentUser.role === 'admin' ? 'Saanvishree' : 'Scholar')
    };

    if (editingPostId) {
      await updatePost(editingPostId, payload);
      showToast("Academic entry updated successfully!", "success");
    } else {
      await createPost(payload);
      showToast("New academic entry published to portfolio!", "success");
    }

    document.getElementById('post-modal')?.classList.add('hidden');
    editingPostId = null;
    await renderApp();
  } catch (err) {
    showToast("Error saving entry: " + err.message, "error");
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save to Portfolio';
    }
  }
}

window.handleEditPostInline = (postId) => {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;

  editingPostId = postId;
  const modal = document.getElementById('post-modal');
  if (!modal) return;

  document.getElementById('post-title').value = post.title || '';
  document.getElementById('post-abstract').value = post.abstract || '';
  document.getElementById('post-content').value = post.content || '';
  document.getElementById('post-tags').value = (post.tags || []).join(', ');
  document.getElementById('post-github-url').value = post.githubUrl || '';
  document.getElementById('post-demo-url').value = post.demoUrl || '';
  document.getElementById('post-doc-url').value = post.documentUrl || '';
  document.getElementById('post-visibility').value = post.visibility || 'public';
  document.getElementById('post-featured').checked = !!post.isFeatured;
  document.getElementById('post-image-url').value = post.imageUrl || '';
  document.getElementById('post-image-url-input').value = post.imageUrl || '';
  document.getElementById('post-category').value = post.category || 'Projects';
  document.getElementById('post-modal-title').textContent = 'Revise Academic Entry';

  modal.classList.remove('hidden');
};

window.handleDeletePost = (postId) => {
  showConfirm("Remove this academic entry permanently from the portfolio?", async () => {
    try {
      await deletePost(postId);
      showToast("Entry removed from portfolio.", "success");
      await renderApp();
    } catch (e) {
      showToast("Error deleting entry: " + e.message, "error");
    }
  });
};

async function handleCategorySubmit() {
  const name = document.getElementById('cat-name')?.value.trim();
  const icon = document.getElementById('cat-icon')?.value.trim() || 'folder';
  const order = parseInt(document.getElementById('cat-order')?.value) || 0;
  const color = document.getElementById('cat-color')?.value.trim() || 'bg-indigo-50';
  const description = document.getElementById('cat-desc')?.value.trim() || '';

  if (!name) return showToast("Category name is required.", "error");

  try {
    const data = { name, icon, order, color, description };
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, data);
      showToast("Academic category updated!", "success");
    } else {
      await createCategory(data);
      showToast("New academic division established!", "success");
    }

    document.getElementById('category-modal')?.classList.add('hidden');
    editingCategoryId = null;
    await loadAllData();
    await renderApp();
  } catch (e) {
    showToast("Error saving category: " + e.message, "error");
  }
}

window.handleEditCategory = (catId) => {
  const cat = allCategories.find(c => c.id === catId);
  if (!cat) return;

  editingCategoryId = catId;
  document.getElementById('cat-name').value = cat.name || '';
  document.getElementById('cat-icon').value = cat.icon || 'folder';
  document.getElementById('cat-order').value = cat.order || 0;
  document.getElementById('cat-color').value = cat.color || 'bg-indigo-50';
  document.getElementById('cat-desc').value = cat.description || '';
  document.getElementById('category-modal')?.classList.remove('hidden');
};

window.handleDeleteCategory = (catId) => {
  showConfirm("Delete this academic category division?", async () => {
    try {
      await deleteCategory(catId);
      showToast("Category removed.", "success");
      await loadAllData();
      await renderApp();
    } catch (e) {
      showToast("Error deleting category: " + e.message, "error");
    }
  });
};

async function loadAllData() {
  if (siteSettingsUnsubscribe) siteSettingsUnsubscribe();
  siteSettingsUnsubscribe = subscribeToSiteSettings((settings) => {
    currentSiteSettings = { ...currentSiteSettings, ...settings };
    if (['home', 'admin', 'about', 'skills', 'education'].includes(activeView)) {
      renderAppLayout(!!currentUser, currentUser, activeCategory, activeView, currentSiteSettings);
      renderCurrentActiveView();
    }
  });

  if (categoriesUnsubscribe) categoriesUnsubscribe();
  categoriesUnsubscribe = subscribeToCategories(async (categories) => {
    allCategories = categories;

    if (allCategories.length === 0 && currentUser?.role === 'admin') {
      const presets = [
        { id: 'projects', name: 'Projects', icon: 'code-2', description: 'Computational and software engineering projects.', color: 'bg-indigo-50', order: 0 },
        { id: 'research', name: 'Research', icon: 'microscope', description: 'Scientific inquiries, essays, and academic papers.', color: 'bg-emerald-50', order: 1 },
        { id: 'achievements', name: 'Achievements', icon: 'trophy', description: 'Honors, academic competitions, and awards.', color: 'bg-amber-50', order: 2 },
        { id: 'certifications', name: 'Certifications', icon: 'award', description: 'Verified courses, certifications, and technical credentials.', color: 'bg-violet-50', order: 3 },
        { id: 'courses', name: 'Courses', icon: 'book-open', description: 'Advanced academic coursework and curriculum studies.', color: 'bg-sky-50', order: 4 },
        { id: 'activities', name: 'Activities', icon: 'compass', description: 'Student leadership, clubs, and co-curricular initiatives.', color: 'bg-rose-50', order: 5 },
        { id: 'creative-pursuits', name: 'Creative Pursuits', icon: 'palette', description: 'Passionate dancer activities, fine arts, and creative expressions.', color: 'bg-purple-50', order: 6 }
      ];
      await initCategories(currentUser.uid, presets);
      return;
    }

    if (allCategories.length === 0) {
      allCategories = [
        { id: 'projects', name: 'Projects', icon: 'code-2', description: 'Computational and software engineering projects.', color: 'bg-indigo-50', order: 0 },
        { id: 'research', name: 'Research', icon: 'microscope', description: 'Scientific inquiries, essays, and academic papers.', color: 'bg-emerald-50', order: 1 },
        { id: 'achievements', name: 'Achievements', icon: 'trophy', description: 'Honors, academic competitions, and awards.', color: 'bg-amber-50', order: 2 },
        { id: 'certifications', name: 'Certifications', icon: 'award', description: 'Verified courses, certifications, and technical credentials.', color: 'bg-violet-50', order: 3 },
        { id: 'courses', name: 'Courses', icon: 'book-open', description: 'Advanced academic coursework and curriculum studies.', color: 'bg-sky-50', order: 4 },
        { id: 'activities', name: 'Activities', icon: 'compass', description: 'Student leadership, clubs, and co-curricular initiatives.', color: 'bg-rose-50', order: 5 }
      ];
    }
  });

  if (postsUnsubscribe) postsUnsubscribe();
  postsUnsubscribe = subscribeToPosts(activeCategory, (posts) => {
    allPosts = posts;
    if (['home', 'my-work', 'projects', 'research', 'achievements', 'certifications', 'courses', 'activities'].includes(activeView)) {
      renderCurrentActiveView();
    }
  });

  if (memoriesUnsubscribe) memoriesUnsubscribe();
  memoriesUnsubscribe = subscribeToAiMemories((memories) => {
    allMemories = memories;
    if (['training', 'admin'].includes(activeView)) {
      renderCurrentActiveView();
    }
  });
}

async function renderCurrentActiveView() {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  // Clear previous content to avoid any duplication glitches
  contentArea.innerHTML = '';

  if (activeView === 'about') {
    contentArea.innerHTML = renderAboutView(currentSiteSettings);
  } else if (activeView === 'education') {
    contentArea.innerHTML = renderEducationView(currentSiteSettings);
  } else if (activeView === 'skills') {
    contentArea.innerHTML = renderSkillsView(currentSiteSettings);
  } else if (activeView === 'projects') {
    contentArea.innerHTML = renderProjectsView(allPosts, currentUser);
  } else if (activeView === 'research') {
    contentArea.innerHTML = renderResearchView(allPosts, currentUser);
  } else if (activeView === 'achievements') {
    contentArea.innerHTML = renderAchievementsView(allPosts, currentUser);
  } else if (activeView === 'certifications') {
    contentArea.innerHTML = renderCertificationsView(allPosts, currentUser);
  } else if (activeView === 'courses') {
    contentArea.innerHTML = renderCoursesView(allPosts, currentUser);
  } else if (activeView === 'activities') {
    contentArea.innerHTML = renderActivitiesView(allPosts, currentUser);
  } else if (activeView === 'resume') {
    contentArea.innerHTML = renderResumeView();
  } else if (activeView === 'journey') {
    contentArea.innerHTML = renderJourneyView();
  } else if (activeView === 'my-work') {
    contentArea.innerHTML = renderMyWorkView(allPosts, currentUser);
  } else if (activeView === 'contact') {
    contentArea.innerHTML = renderContactView();
  } else if (activeView === 'training') {
    contentArea.innerHTML = renderTrainingView(currentUser, allMemories);
    setupTrainingModuleEvents();
  } else if (activeView === 'admin') {
    contentArea.innerHTML = renderAdminDashboardView(allPosts, allCategories, allPosts.length, activeAdminTab, allMemories, currentSiteSettings);
    window.switchAdminTab = (tab) => {
      activeAdminTab = tab;
      renderCurrentActiveView();
    };
  } else if (activeView === 'profile') {
    const targetUserId = profileSelectedUserId || currentUser?.uid;
    const targetUser = currentUser;
    const userPosts = allPosts.filter(p => p.authorId === targetUserId);
    contentArea.innerHTML = renderUserProfileView(targetUser, userPosts, allCategories, [], currentUser);
    setupProfilePhotoUpload();
  } else {
    // Default Home View
    const filtered = activeCategory ? allPosts.filter(p => p.category === activeCategory) : allPosts;
    const featured = allPosts.filter(p => p.isFeatured);

    contentArea.innerHTML = `
      <div class="space-y-12 font-sans animate-in fade-in duration-300">
        
        <!-- Category Filter Strip -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none text-xs font-bold">
          <button onclick="window.filterByCategory('')" class="px-4 py-2 rounded-full cursor-pointer transition-all ${!activeCategory ? 'bg-lavender text-white shadow-xs' : 'bg-white border border-border text-charcoal/60 hover:text-lavender'}">
            All Work (${allPosts.length})
          </button>
          ${allCategories.map(c => `
            <button onclick="window.filterByCategory('${c.name}')" class="px-4 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${activeCategory === c.name ? 'bg-lavender text-white shadow-xs' : 'bg-white border border-border text-charcoal/60 hover:text-lavender'}">
              <i data-lucide="${c.icon || 'tag'}" class="w-3.5 h-3.5"></i> ${c.name}
            </button>
          `).join('')}
        </div>

        <!-- Featured Carousel/Grid if on Home without category -->
        ${(!activeCategory && featured.length > 0) ? `
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 class="text-2xl font-serif font-bold text-ink">Featured Highlights</h3>
              </div>
              <span class="text-xs font-bold text-charcoal/40 font-mono">${featured.length} Highlights</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${featured.map(p => renderPostCard(p, currentUser)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Main Feed Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-border pb-3">
            <h3 class="text-2xl font-serif font-bold text-ink">${activeCategory || 'Latest Portfolio Entries'}</h3>
            <span class="text-xs font-bold text-charcoal/40 font-mono">${filtered.length} Entries</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.length > 0 ? filtered.map(p => renderPostCard(p, currentUser)).join('') : `
              <div class="col-span-full bg-white p-12 rounded-[36px] border border-border text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-lavender/10 text-lavender flex items-center justify-center mx-auto">
                  <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <h4 class="text-lg font-serif font-bold text-ink">No entries found in ${activeCategory || 'portfolio'}</h4>
                <p class="text-xs text-charcoal/50">Entries will appear here once published.</p>
              </div>
            `}
          </div>
        </div>

      </div>
    `;
  }

  createIcons({ icons });
}

window.viewPost = (postId) => {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  if (detailUnsubscribe) detailUnsubscribe();
  detailUnsubscribe = subscribeToPostDetails(postId, (post) => {
    if (!post) {
      contentArea.innerHTML = `<div class="p-12 text-center text-xs text-charcoal/50">Entry not found.</div>`;
      return;
    }

    if (commentsUnsubscribe) commentsUnsubscribe();
    commentsUnsubscribe = subscribeToComments(postId, (comments) => {
      contentArea.innerHTML = renderPostDetail(post, currentUser, comments, allCategories);
      createIcons({ icons });
    });
  });
};

window.handleAddComment = async (postId) => {
  const text = document.getElementById('comment-input-text')?.value.trim();
  if (!text || !currentUser) return;

  try {
    await addComment({
      postId,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.name || 'Scholar',
      content: text,
      text: text
    });
    showToast("Academic note recorded.", "success");
    document.getElementById('comment-input-text').value = '';
  } catch (e) {
    showToast("Error adding note: " + e.message, "error");
  }
};

function setupProfilePhotoUpload() {
  const dropzone = document.getElementById('prof-photo-dropzone');
  const fileInput = document.getElementById('prof-photo-file');
  const hiddenUrl = document.getElementById('prof-photo-url');
  const preview = document.getElementById('prof-photo-preview');
  const statusEl = document.getElementById('prof-upload-status');

  if (!dropzone || !fileInput) return;

  dropzone.onclick = () => fileInput.click();

  fileInput.onchange = async () => {
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) return showToast("Please select an image file.", "error");

    if (statusEl) statusEl.textContent = "Uploading photo...";

    try {
      const configRes = await fetch('/api/config');
      const config = await configRes.json();
      const { cloudinaryCloudName, cloudinaryUploadPreset } = config;

      if (cloudinaryCloudName && cloudinaryUploadPreset) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
        const data = await uploadRes.json();
        if (data.secure_url) {
          hiddenUrl.value = data.secure_url;
          if (preview) preview.src = data.secure_url;
          showToast("Profile picture uploaded to Cloudinary!", "success");
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          hiddenUrl.value = e.target.result;
          if (preview) preview.src = e.target.result;
          showToast("Photo saved locally.", "success");
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      console.warn("Profile upload fallback to Base64:", e);
      const reader = new FileReader();
      reader.onload = (ev) => {
        hiddenUrl.value = ev.target.result;
        if (preview) preview.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  window.handleProfileSave = async () => {
    const displayName = document.getElementById('prof-display-name')?.value.trim() || 'Saanvishree';
    const username = document.getElementById('prof-username')?.value.trim() || 'saanvishree';
    const bio = document.getElementById('prof-bio')?.value.trim() || '';
    const hobbies = document.getElementById('prof-hobbies')?.value.trim() || '';
    const interests = document.getElementById('prof-interests')?.value.trim() || '';
    const city = document.getElementById('prof-city')?.value.trim() || '';
    const photoURL = document.getElementById('prof-photo-url')?.value || '';

    try {
      await updateProfile(currentUser.uid, {
        displayName: currentUser.role === 'admin' ? 'Saanvishree' : displayName,
        name: currentUser.role === 'admin' ? 'Saanvishree' : displayName,
        username: currentUser.role === 'admin' ? 'saanvishree' : username,
        bio,
        hobbies,
        interests,
        city,
        photoURL,
        profilePhoto: photoURL
      });
      showToast("Profile updated successfully!", "success");
      await renderApp();
    } catch (e) {
      showToast("Error updating profile: " + e.message, "error");
    }
  };
}

function setupTrainingModuleEvents() {
  const categoriesList = [
    "Academic Profile", "Current Education", "Projects", "Research", "Achievements",
    "Courses & Certifications", "Technical Skills", "Academic Skills", "Interests",
    "Future Career Goals", "University Aspirations", "Extracurriculars", "Study Methodologies"
  ];

  window.selectCategoryInterview = (cat) => {
    window.activeInterviewCategory = cat;
    const existingNode = allMemories.find(m => m.category === cat);
    const textEl = document.getElementById('interview-response-input');
    const questionTextEl = document.getElementById('interview-active-question-text');
    const indicator = document.getElementById('active-session-indicator');
    const statusLabel = document.getElementById('interview-status-label');

    if (questionTextEl && window.predefinedQuestionsMap) {
      const q = window.predefinedQuestionsMap[cat] || `Describe your academic achievements in ${cat}...`;
      questionTextEl.textContent = `"${q}"`;
    }
    if (indicator) indicator.textContent = `Active: ${cat}`;

    if (existingNode) {
      if (textEl) textEl.value = existingNode.answer || existingNode.content || '';
      if (statusLabel) statusLabel.textContent = "Existing node loaded (Revision mode)";
    } else {
      if (textEl) textEl.value = '';
      if (statusLabel) statusLabel.textContent = "Awaiting your response...";
    }
  };

  window.skipInterviewQuestion = () => {
    const currentIdx = categoriesList.indexOf(window.activeInterviewCategory || "Academic Profile");
    const nextIdx = (currentIdx + 1) % categoriesList.length;
    window.selectCategoryInterview(categoriesList[nextIdx]);
  };

  window.backToPreviousPrompt = () => {
    const currentIdx = categoriesList.indexOf(window.activeInterviewCategory || "Academic Profile");
    const prevIdx = (currentIdx - 1 + categoriesList.length) % categoriesList.length;
    window.selectCategoryInterview(categoriesList[prevIdx]);
  };

  window.editSavedKnowledge = (id, category, question, answer) => {
    if (activeView !== 'training') {
      activeView = 'training';
      renderCurrentActiveView();
    }
    
    setTimeout(() => {
      window.activeInterviewCategory = category;
      const textEl = document.getElementById('interview-response-input');
      const questionTextEl = document.getElementById('interview-active-question-text');
      const indicator = document.getElementById('active-session-indicator');
      const statusLabel = document.getElementById('interview-status-label');

      if (questionTextEl) questionTextEl.textContent = `"${question}"`;
      if (indicator) indicator.textContent = `Active: ${category}`;
      if (textEl) {
        textEl.value = answer || '';
        textEl.focus();
      }
      if (statusLabel) statusLabel.textContent = `Editing Node: ${category}`;

      document.getElementById('interview-response-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(`Loaded node "${category}" for revision.`, "info");
    }, 100);
  };

  window.eraseSavedKnowledge = async (id) => {
    showConfirm("Dissolve this academic knowledge node from Shree 2.0?", async () => {
      try {
        await deleteAiMemory(id);
        showToast("Knowledge node erased.", "success");
      } catch (e) {
        showToast("Error erasing node: " + e.message, "error");
      }
    });
  };

  window.filterKbSearch = () => {
    const query = document.getElementById('kb-search-box')?.value.toLowerCase().trim() || '';
    const cards = document.querySelectorAll('.kb-node-card');
    cards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const cat = card.getAttribute('data-category') || '';
      const content = card.getAttribute('data-content') || '';
      if (!query || title.includes(query) || cat.includes(query) || content.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  };

  window.filterAdminKbSearch = () => {
    const query = document.getElementById('admin-kb-search')?.value.toLowerCase().trim() || '';
    const nodes = document.querySelectorAll('.admin-kb-node');
    nodes.forEach(node => {
      const searchData = node.getAttribute('data-search') || '';
      if (!query || searchData.includes(query)) {
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }
    });
  };

  const saveBtn = document.getElementById('save-interview-btn');
  const inputEl = document.getElementById('interview-response-input');

  if (saveBtn && inputEl) {
    saveBtn.onclick = async () => {
      const text = inputEl.value.trim();
      if (!text) return showToast("Please enter an answer before continuing.", "error");

      saveBtn.disabled = true;
      try {
        const cat = window.activeInterviewCategory || "Academic Profile";
        const q = (window.predefinedQuestionsMap && window.predefinedQuestionsMap[cat]) || `Describe your ${cat}`;

        const existing = allMemories.find(m => m.category === cat);
        const payload = {
          category: cat,
          title: `Interview Question on ${cat}`,
          question: q,
          answer: text,
          content: text
        };

        if (existing) {
          await updateAiMemory(existing.id, payload);
          showToast(`Academic node for ${cat} updated!`, "success");
        } else {
          await createAiMemory(payload);
          showToast(`Academic node for ${cat} calibrated!`, "success");
        }

        window.skipInterviewQuestion();
      } catch (e) {
        showToast("Error saving node: " + e.message, "error");
      } finally {
        saveBtn.disabled = false;
      }
    };
  }
}

function setupChatbotControllers() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const drawer = document.getElementById('chatbot-drawer');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const messagesContainer = document.getElementById('chatbot-messages');

  if (!toggleBtn || !drawer) return;

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    isChatbotOpen = !isChatbotOpen;
    drawer.classList.toggle('hidden');
    if (isChatbotOpen && input) {
      input.focus();
    }
  };

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      isChatbotOpen = false;
      drawer.classList.add('hidden');
    };
  }

  window.sendChatPrompt = (textPrompt) => {
    if (!textPrompt.trim()) return;
    isChatbotOpen = true;
    drawer.classList.remove('hidden');
    if (input) input.value = '';
    executeChatAction(textPrompt);
  };

  if (sendBtn && input) {
    sendBtn.onclick = () => {
      const txt = input.value.trim();
      if (!txt) return;
      input.value = '';
      executeChatAction(txt);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        executeChatAction(txt);
      }
    };
  }

  async function executeChatAction(messageText) {
    chatHistory.push({ role: 'user', text: messageText });
    appendChatMessage('user', messageText);

    const typingId = 'typing-' + Date.now();
    messagesContainer.insertAdjacentHTML('beforeend', `
      <div id="${typingId}" class="flex items-start gap-3 animate-pulse duration-700">
        <div class="w-7 h-7 rounded-full bg-lavender/20 flex items-center justify-center text-lavender shrink-0">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
        </div>
        <div class="bg-lavender/5 border border-lavender/10 rounded-2xl p-3.5 max-w-[80%] text-xs text-charcoal/60 leading-relaxed italic">
          <p class="font-bold text-[9px] mb-1 text-lavender uppercase tracking-widest">Shree 2.0</p>
          Consulting Saanvishree's academic repository...
        </div>
      </div>
    `);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    createIcons({ icons });

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: chatHistory.slice(0, -1),
          memories: allMemories,
          stories: allPosts.map(p => ({ title: p.title, content: p.content, category: p.category, abstract: p.abstract }))
        })
      });

      const data = await response.json();
      document.getElementById(typingId)?.remove();

      if (response.ok && data.text) {
        chatHistory.push({ role: 'model', text: data.text });
        appendChatMessage('model', data.text);
      } else {
        appendChatMessage('model', data.error || "Shree 2.0 is currently reviewing records. Please ask again.");
      }
    } catch {
      document.getElementById(typingId)?.remove();
      appendChatMessage('model', "Shree 2.0 is currently offline. Please ensure server credentials are set.");
    }
  }

  function appendChatMessage(role, text) {
    const isUser = role === 'user';
    messagesContainer.insertAdjacentHTML('beforeend', `
      <div class="flex items-start gap-3 ${isUser ? 'justify-end' : ''}">
        ${!isUser ? `
          <div class="w-7 h-7 rounded-full bg-lavender/20 flex items-center justify-center text-lavender shrink-0">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
          </div>
        ` : ''}
        <div class="${isUser ? 'bg-lavender text-white rounded-[20px] rounded-tr-none' : 'bg-lavender/5 border border-lavender/10 rounded-2xl'} p-3.5 max-w-[80%] text-xs leading-relaxed">
          ${!isUser ? '<p class="font-bold text-[9px] mb-1 text-lavender uppercase tracking-widest">Shree 2.0</p>' : ''}
          ${text.replace(/\n/g, '<br>')}
        </div>
      </div>
    `);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    createIcons({ icons });
  }
}

init();
