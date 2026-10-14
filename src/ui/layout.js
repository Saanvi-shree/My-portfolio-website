export function renderHeaderView(currentUser) {
  return `
     <header id="app-header" class="border-b border-border bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 animate-in fade-in">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between font-sans">
           <div class="flex items-center gap-3 cursor-pointer" onclick="window.navigateTo('home')">
              <div class="w-10 h-10 rounded-2xl bg-[#8A7DCB]/10 flex items-center justify-center border border-[#8A7DCB]/20 text-lavender shadow-xs">
                 <i data-lucide="sparkles" class="w-5 h-5 text-lavender"></i>
              </div>
              <div>
                 <span class="font-serif italic font-bold text-2xl tracking-tight text-ink">Saanvishree</span>
                 <p class="text-[9px] uppercase tracking-widest text-[#8A7DCB] font-bold">Personal Space &amp; Portfolio</p>
              </div>
           </div>
           
           <nav class="hidden lg:flex items-center gap-0.5 text-xs font-sans font-bold text-charcoal/70 uppercase tracking-wider">
              <button onclick="window.navigateTo('home')" class="nav-item-home py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Home</button>
              <button onclick="window.navigateTo('about')" class="nav-item-about py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">About</button>
              <button onclick="window.navigateTo('education')" class="nav-item-education py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Education</button>
              <button onclick="window.navigateTo('skills')" class="nav-item-skills py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Skills</button>
              <button onclick="window.navigateTo('projects')" class="nav-item-projects py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Projects</button>
              <button onclick="window.navigateTo('research')" class="nav-item-research py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Research</button>
              <button onclick="window.navigateTo('achievements')" class="nav-item-achievements py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Achievements</button>
              <button onclick="window.navigateTo('certifications')" class="nav-item-certifications py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Certifications</button>
              <button onclick="window.navigateTo('courses')" class="nav-item-courses py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Courses</button>
              <button onclick="window.navigateTo('activities')" class="nav-item-activities py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Activities</button>
              <button onclick="window.navigateTo('my-work')" class="nav-item-my-work py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">My Work</button>
              <button onclick="window.navigateTo('resume')" class="nav-item-resume py-2 px-2.5 text-lavender hover:bg-lavender-light transition-colors rounded-full font-sans cursor-pointer font-bold flex items-center gap-1">
                 <i data-lucide="file-text" class="w-3 h-3"></i> Resume / CV
              </button>
              <button onclick="window.navigateTo('contact')" class="nav-item-contact py-2 px-2.5 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer font-bold">Contact</button>

              <div class="h-4 w-px bg-border/80 mx-1"></div>

              ${currentUser ? `
                <button onclick="window.navigateTo('profile', '${currentUser.uid}')" class="py-1.5 px-3 hover:text-lavender transition-colors rounded-full font-sans cursor-pointer text-lavender flex items-center gap-1.5 font-bold border border-lavender/20 bg-lavender/5">
                   <img src="${currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="w-5 h-5 rounded-full object-cover border border-lavender/30">
                   Profile
                </button>
                ${currentUser.role === 'admin' ? `
                  <button onclick="window.navigateTo('admin')" class="bg-lavender/10 text-lavender py-1.5 px-3 hover:bg-lavender/25 transition-all rounded-full font-sans cursor-pointer flex items-center gap-1.5 font-bold">
                     <i data-lucide="crown" class="w-3.5 h-3.5"></i> Admin Hub
                  </button>
                  <button onclick="window.navigateTo('training')" class="bg-[#C5A059]/10 text-[#C5A059] py-1.5 px-3 hover:bg-[#C5A059]/25 transition-all rounded-full font-sans cursor-pointer flex items-center gap-1.5 font-bold">
                     <i data-lucide="brain-circuit" class="w-3.5 h-3.5"></i> Train Shree 2.0
                  </button>
                ` : ''}
                <button onclick="window.handleLogout()" class="border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 py-1.5 px-3 rounded-full font-sans transition-all cursor-pointer font-bold">Sign Out</button>
              ` : `
                <button onclick="window.navigateTo('login')" class="premium-btn py-2 px-4 hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer font-sans font-bold text-xs">
                   <i data-lucide="key-round" class="w-3.5 h-3.5"></i> Sign In
                </button>
              `}
           </nav>
           
           <!-- Mobile Hamburg-Trigger Drawer -->
           <div class="lg:hidden flex items-center gap-2">
              ${currentUser ? `
                <button onclick="window.navigateTo('profile', '${currentUser.uid}')" class="w-8 h-8 rounded-full border border-lavender/30 overflow-hidden cursor-pointer">
                   <img src="${currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="w-full h-full object-cover">
                </button>
              ` : ''}
              <button onclick="window.toggleMobileMenu()" class="p-2 text-charcoal/80 hover:text-lavender cursor-pointer">
                 <i data-lucide="menu" class="w-6 h-6" id="mobile-menu-icon"></i>
              </button>
           </div>
        </div>
        
        <!-- Mobile Dropdown Panel -->
        <div id="mobile-menu" class="hidden lg:hidden border-t border-border bg-white absolute top-20 left-0 w-full shadow-xl p-6 py-6 space-y-3 font-sans text-xs font-bold text-charcoal/70 uppercase tracking-wider animate-in slide-in-from-top duration-300 z-50">
           <div class="grid grid-cols-2 gap-2">
             <button onclick="window.navigateTo('home'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Home</button>
             <button onclick="window.navigateTo('about'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">About</button>
             <button onclick="window.navigateTo('education'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Education</button>
             <button onclick="window.navigateTo('skills'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Skills</button>
             <button onclick="window.navigateTo('projects'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Projects</button>
             <button onclick="window.navigateTo('research'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Research</button>
             <button onclick="window.navigateTo('achievements'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Achievements</button>
             <button onclick="window.navigateTo('certifications'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Certifications</button>
             <button onclick="window.navigateTo('courses'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Courses</button>
             <button onclick="window.navigateTo('activities'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Activities</button>
             <button onclick="window.navigateTo('my-work'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">My Work</button>
             <button onclick="window.navigateTo('resume'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl bg-lavender/10 text-lavender hover:bg-lavender-light cursor-pointer">Resume / CV</button>
             <button onclick="window.navigateTo('journey'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Journey</button>
             <button onclick="window.navigateTo('contact'); window.toggleMobileMenu()" class="block text-left py-2 px-3 rounded-xl hover:bg-lavender-light hover:text-lavender cursor-pointer">Contact</button>
           </div>
           ${currentUser ? `
             <div class="pt-3 border-t border-border/60 space-y-2">
               <button onclick="window.navigateTo('profile', '${currentUser.uid}'); window.toggleMobileMenu()" class="block w-full text-left py-2 px-3 rounded-xl hover:bg-lavender-light text-lavender cursor-pointer">My Profile</button>
               ${currentUser.role === 'admin' ? `
                 <button onclick="window.openSiteSettingsModal(); window.toggleMobileMenu()" class="block w-full text-left py-2 px-3 rounded-xl hover:bg-lavender-light text-ink flex items-center gap-1.5 cursor-pointer">
                    <i data-lucide="edit-3" class="w-4 h-4 text-lavender"></i> Edit Home Text &amp; Bio
                 </button>
                 <button onclick="window.navigateTo('admin'); window.toggleMobileMenu()" class="block w-full text-left py-2 px-3 rounded-xl hover:bg-lavender-light text-lavender flex items-center gap-1.5 cursor-pointer">
                    <i data-lucide="crown" class="w-4 h-4"></i> Admin Hub
                 </button>
                 <button onclick="window.navigateTo('training'); window.toggleMobileMenu()" class="block w-full text-left py-2 px-3 rounded-xl hover:bg-[#C5A059]/20 text-[#C5A059] flex items-center gap-1.5 cursor-pointer">
                    <i data-lucide="brain-circuit" class="w-4 h-4"></i> Train Shree 2.0
                 </button>
               ` : ''}
               <button onclick="window.handleLogout(); window.toggleMobileMenu()" class="block w-full text-rose-500 py-2 px-3 hover:underline text-left cursor-pointer font-bold">Sign Out</button>
             </div>
           ` : `
             <div class="pt-3 border-t border-border/60">
               <button onclick="window.navigateTo('login'); window.toggleMobileMenu()" class="premium-btn w-full py-2.5 text-center cursor-pointer flex items-center justify-center gap-2">
                  <i data-lucide="key-round" class="w-4 h-4 text-white"></i> Sign In
               </button>
             </div>
           `}
        </div>
     </header>
  `;
}

export function renderHeroShowcase(siteSettings = {}, currentUser = null) {
  const heroTitle = siteSettings.heroTitle || "Saanvishree";
  const heroSubtitle = siteSettings.heroSubtitle || "Just a growing girl.";
  const heroBio = siteSettings.heroBio || "Just a growing girl exploring the world, learning new things every day, expressing creativity through dance and ideas, and building things with passion.";
  const heroTag = siteSettings.heroTag || "Personal Space & Portfolio";
  const isOwner = currentUser && currentUser.role === 'admin';

  return `
     <section id="hero-showcase" class="relative overflow-hidden pt-12 pb-16 select-none animate-in fade-in duration-500 font-sans">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(138,125,203,0.1),transparent_60%)]"></div>
        <div class="max-w-7xl mx-auto px-6 relative space-y-8">
           
           <!-- Top Banner Tag -->
           <div class="flex items-center justify-center gap-3">
              <span class="inline-flex items-center gap-2 tag bg-[#8A7DCB]/10 text-[#8A7DCB] tracking-wide px-5 py-2 font-sans border border-[#8A7DCB]/20 font-bold uppercase text-[10px]">
                 <i data-lucide="sparkles" class="w-3.5 h-3.5 text-lavender"></i> ${heroTag}
              </span>
              ${isOwner ? `
                <button onclick="window.openSiteSettingsModal()" class="inline-flex items-center gap-1.5 text-xs font-bold text-lavender bg-white border border-lavender/30 hover:bg-lavender/10 px-3.5 py-1.5 rounded-full shadow-xs cursor-pointer transition-all">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Home Text
                </button>
              ` : ''}
           </div>

           <!-- Centered Short & Sweet Hero -->
           <div class="max-w-3xl mx-auto text-center space-y-6">
              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-serif text-ink tracking-tight leading-[1.05]">
                ${heroTitle} <br>
                <span class="text-gradient font-bold not-italic">${heroSubtitle}</span>
              </h1>
              
              <p class="max-w-xl mx-auto text-charcoal/75 leading-relaxed text-base sm:text-lg font-medium font-sans">
                ${heroBio}
              </p>
              
              <div class="flex items-center justify-center gap-3 flex-wrap pt-2 font-sans font-bold text-xs select-none">
                 <button onclick="window.navigateTo('about')" class="premium-btn !px-6 !py-3.5 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer shadow-md">
                    <i data-lucide="user" class="w-4 h-4"></i> About Me
                 </button>
                 <button onclick="window.navigateTo('skills')" class="secondary-btn !px-6 !py-3.5 hover:bg-cream/10 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer border-lavender/30 text-lavender">
                    <i data-lucide="sparkles" class="w-4 h-4"></i> Skills &amp; Passions
                 </button>
                 <button onclick="window.navigateTo('my-work')" class="secondary-btn !px-6 !py-3.5 hover:bg-cream/10 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer">
                    <i data-lucide="layers" class="w-4 h-4"></i> View Work
                 </button>
                 <button onclick="window.navigateTo('contact')" class="secondary-btn !px-6 !py-3.5 hover:bg-cream/10 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer">
                    <i data-lucide="mail" class="w-4 h-4 text-gold"></i> Contact
                 </button>
              </div>
           </div>

           <!-- Quick Navigation Cards Grid -->
           <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-6 max-w-5xl mx-auto">
              <div onclick="window.navigateTo('education')" class="bg-white/90 hover:border-lavender border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Education</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Timeline</p>
              </div>

              <div onclick="window.navigateTo('skills')" class="bg-white/90 hover:border-indigo-400 border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="code-2" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Skills</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Competencies</p>
              </div>

              <div onclick="window.navigateTo('projects')" class="bg-white/90 hover:border-emerald-400 border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="folder" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Projects</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Software</p>
              </div>

              <div onclick="window.navigateTo('research')" class="bg-white/90 hover:border-sky-400 border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="microscope" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Research</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Inquiry</p>
              </div>

              <div onclick="window.navigateTo('achievements')" class="bg-white/90 hover:border-amber-400 border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="trophy" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Honors</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Awards</p>
              </div>

              <div onclick="window.navigateTo('activities')" class="bg-white/90 hover:border-purple-400 border border-border/80 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                 <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1.5 font-bold">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                 </div>
                 <p class="text-xs font-bold text-ink font-serif">Activities</p>
                 <p class="text-[9px] text-charcoal/50 font-bold uppercase mt-0.5">Dance &amp; Arts</p>
              </div>
           </div>

        </div>
     </section>
  `;
}

export function renderFooterView() {
  return `
    <footer class="border-t border-border bg-white py-12 text-center text-xs text-charcoal/40 tracking-wider uppercase font-sans font-bold">
       <div class="max-w-7xl mx-auto px-6 space-y-4">
          <div class="flex items-center justify-center gap-4 text-xs text-charcoal/60 lowercase font-medium flex-wrap">
             <button onclick="window.navigateTo('home')" class="hover:text-lavender">Home</button>
             <span>•</span>
             <button onclick="window.navigateTo('about')" class="hover:text-lavender">About</button>
             <span>•</span>
             <button onclick="window.navigateTo('education')" class="hover:text-lavender">Education</button>
             <span>•</span>
             <button onclick="window.filterByCategory('Projects')" class="hover:text-lavender">Projects</button>
             <span>•</span>
             <button onclick="window.filterByCategory('Research')" class="hover:text-lavender">Research</button>
             <span>•</span>
             <button onclick="window.navigateTo('resume')" class="hover:text-lavender">Resume</button>
             <span>•</span>
             <button onclick="window.navigateTo('contact')" class="hover:text-lavender">Contact</button>
          </div>
          <p class="flex items-center justify-center gap-2 font-sans font-bold">
             <i data-lucide="graduation-cap" class="w-4 h-4 text-lavender"></i>
             ShreeVerse Academic Portfolio © 2026. Designed for academic and career development.
          </p>
          <p class="text-[10px] lowercase tracking-widest text-[#8A7DCB]/70 font-sans font-medium select-none">
             Saanvishree • 11th Grade High School Student • Academic Documentation &amp; Research Repository
          </p>
       </div>
    </footer>
  `;
}

export function renderLoginLayout() {
  return `
     <div class="min-h-screen bg-[#FFFCF8] flex items-center justify-center px-4 py-16 relative overflow-hidden select-none font-sans font-medium">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,252,248,0.4),rgba(138,125,203,0.05))]"></div>
        <div class="w-full max-w-sm bg-white p-8 md:p-10 rounded-[45px] border border-border/80 shadow-2xl relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
           
           <!-- Title / Greeting -->
           <div class="text-center space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-[#8A7DCB]/10 mx-auto flex items-center justify-center border border-[#8A7DCB]/20 text-lavender">
                 <i data-lucide="graduation-cap" class="w-6 h-6 text-lavender"></i>
              </div>
              <h2 class="text-3xl font-serif text-ink italic leading-none" id="auth-panel-title">Academic Portal</h2>
              <p class="text-xs text-charcoal/50 leading-relaxed font-sans" id="auth-panel-tagline">Sign in to access portfolio management, reflections, and academic archives.</p>
           </div>
           
           <!-- Form Mode Select Toggle -->
           <div class="flex bg-cream/10 p-1 rounded-xl border border-border/60 font-sans font-bold" id="auth-mode-toggle-bar">
              <button onclick="window.switchAuthFormMode('login')" id="btn-toggle-login" class="flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider bg-white shadow-xs text-lavender cursor-pointer select-none">Sign In</button>
              <button onclick="window.switchAuthFormMode('signup')" id="btn-toggle-signup" class="flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all uppercase tracking-wider text-charcoal/40 hover:text-lavender cursor-pointer select-none">Register</button>
           </div>

           <!-- Standard Sign In Form -->
           <form id="auth-form" class="space-y-4">
              <div class="space-y-1.5 flex flex-col font-sans">
                 <label class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Academic / User Email</label>
                 <input type="email" id="auth-email" required placeholder="e.g. mentor@school.edu" class="input-field text-xs text-ink font-sans font-semibold">
              </div>
              
              <div class="space-y-1.5 flex flex-col font-sans">
                 <div class="flex justify-between items-center font-sans">
                    <label class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Passphrase</label>
                    <button type="button" onclick="window.showForgotPasswordDialog()" class="text-[10px] text-lavender hover:underline lowercase font-sans cursor-pointer font-bold">Forgot password?</button>
                 </div>
                 <input type="password" id="auth-password" required placeholder="••••••••••••" class="input-field text-xs text-ink font-sans font-semibold">
              </div>

              <!-- Extra sign up variables (only shown during registration mode) -->
              <div id="signup-extra-fields" class="hidden space-y-4 animate-in slide-in-from-top-3 duration-300">
                 <div class="space-y-1.5 flex flex-col font-sans">
                    <label class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Full Name</label>
                    <input type="text" id="auth-displayName" placeholder="e.g. Dr. Eleanor Vance" class="input-field text-xs text-ink font-sans font-semibold">
                 </div>
                 <div class="space-y-1.5 flex flex-col font-sans">
                    <label class="text-[10px] uppercase font-bold tracking-wider text-charcoal/40">Affiliation / Connection</label>
                    <select id="auth-relationship" class="input-field text-xs text-charcoal/70 font-sans font-bold">
                       <option value="Admissions Officer">University Admissions Officer</option>
                       <option value="Teacher / Faculty">Teacher / Faculty</option>
                       <option value="Academic Mentor">Academic Mentor / Counselor</option>
                       <option value="Research Collaborator">Research Collaborator</option>
                       <option value="Student Peer">Student Peer</option>
                       <option value="Visitor">Academic Visitor</option>
                    </select>
                 </div>
              </div>

              <div id="auth-message" class="hidden text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl p-3 text-center font-sans font-bold my-3"></div>

              <button type="submit" id="auth-primary-action-btn" class="premium-btn w-full !py-3.5 hover:scale-[1.02] active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md">
                 <i data-lucide="key-round" class="w-4 h-4 font-sans"></i> Sign In to Portfolio
              </button>
           </form>

           <!-- Provider Buttons -->
           <div class="space-y-3 font-sans font-bold">
              <button type="button" onclick="window.handleGoogleLogin()" class="w-full secondary-btn !py-3 font-sans text-xs flex items-center justify-center gap-2 hover:bg-cream/10 border-border/80 text-charcoal/70 bg-white shadow-xs rounded-2xl cursor-pointer">
                 <i class="w-4 h-4 text-rose-500 fill-rose-500 font-sans" data-lucide="chrome"></i>
                 Sign In with Google
              </button>
           </div>

           <!-- Admin Fast Access / Demo -->
           <div class="pt-2 text-center">
              <button type="button" onclick="window.handleQuickAdminLogin()" class="text-[11px] text-lavender font-bold hover:underline inline-flex items-center gap-1 cursor-pointer">
                <i data-lucide="shield" class="w-3 h-3"></i> Quick Admin / Owner Sign-In
              </button>
           </div>
        </div>
     </div>
  `;
}

export function renderTrainingView(currentUser, memories = []) {
  const count = memories?.length || 0;
  
  // Academic & Professional Categories for Shree 2.0 Training
  const categoriesList = [
    "Academic Profile", "Current Education", "Projects", "Research", "Achievements",
    "Courses & Certifications", "Technical Skills", "Academic Skills", "Interests",
    "Future Career Goals", "University Aspirations", "Extracurriculars", "Study Methodologies"
  ];
  
  // Check which categories have at least one saved answer
  const trainedCategories = Array.from(new Set(memories.map(m => m.category)));
  const uniqueTrainedCount = trainedCategories.filter(cat => categoriesList.includes(cat)).length;
  const progressPercent = Math.min(Math.round((uniqueTrainedCount / categoriesList.length) * 100), 100);

  // Predefined Academic Training Questions
  const defaultQuestions = {
    "Academic Profile": "What is your current academic standing, grade level (11th grade), and academic summary?",
    "Current Education": "What school/institution do you attend, what are your major subjects, and what are your key academic strengths?",
    "Projects": "What software, scientific, or computational projects have you built? Describe their tech stack and purpose.",
    "Research": "What independent research, academic essays, or scientific inquiries are you working on or completed?",
    "Achievements": "What academic competitions, school honors, Olympiads, science fairs, or leadership awards have you won?",
    "Courses & Certifications": "What online coursework (CS50, Coursera, edX) and verified certifications have you earned?",
    "Technical Skills": "What programming languages, frameworks, laboratory tools, and computational skills do you possess?",
    "Academic Skills": "What are your skills in literature review, data analysis, quantitative modeling, and technical writing?",
    "Interests": "What are your core academic interests, passions, and creative co-curriculars (e.g. passionate dancer, reading)?",
    "Future Career Goals": "What are your long-term career aspirations in STEM, research, technology, or academia?",
    "University Aspirations": "What fields of study, undergraduate majors, or university research programs do you aim to pursue?",
    "Extracurriculars": "What student clubs, leadership positions, volunteering, or co-curricular activities do you participate in?",
    "Study Methodologies": "How do you organize your independent research, problem-solving, and continuous academic growth?"
  };

  const defaultQuestionsJsonEscaped = JSON.stringify(defaultQuestions).replace(/"/g, '&quot;');

  return `
    <div class="space-y-12 animate-in fade-in duration-500 font-sans pb-20">
      
      <!-- Top Overview & Progress Widget -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <!-- Left Side: Interactive Progress Meter -->
         <div class="lg:col-span-1 bg-gradient-to-tr from-[#8A7DCB]/15 via-[#FFFCF8] to-[#C5A059]/5 p-6 rounded-[35px] border border-border/80 flex flex-col justify-between shadow-xs">
            <div>
               <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-full bg-lavender/10 flex items-center justify-center text-lavender font-semibold">
                     <i data-lucide="brain-circuit" class="w-4 h-4 text-lavender animate-spin-slow"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-widest text-[#8A7DCB] font-sans">AI Knowledge Engine</span>
               </div>
               <h3 class="text-2xl font-serif text-ink tracking-tight">Shree 2.0 Academic Calibration</h3>
               <p class="text-xs text-charcoal/60 leading-relaxed mt-2.5">
                  Train your AI representative across key academic and career dimensions to represent your portfolio accurately to admissions officers and mentors.
               </p>
            </div>
            
            <div class="mt-8 space-y-2">
               <div class="flex justify-between items-end text-xs font-bold font-sans">
                  <span class="text-[#8A7DCB] uppercase tracking-wider">${uniqueTrainedCount} / ${categoriesList.length} Calibrated</span>
                  <span class="text-ink text-sm">${progressPercent}%</span>
               </div>
               <div class="w-full h-3 bg-[#8A7DCB]/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-lavender to-[#C5A059] rounded-full transition-all duration-1000" style="width: ${progressPercent}%"></div>
               </div>
            </div>
         </div>

         <!-- Right Side: Bento Checklist of Categories -->
         <div class="lg:col-span-2 bg-white p-6 md:p-8 rounded-[35px] border border-border/70 shadow-xs flex flex-col justify-between">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-3 font-sans">Academic Knowledge Board</h4>
              <p class="text-xs text-charcoal/50 italic mb-4">Click any node pill to calibrate that academic category's response node.</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
               ${categoriesList.map(cat => {
                 const isTrained = trainedCategories.includes(cat);
                 return `
                   <button type="button" onclick="window.selectCategoryInterview('${cat}')" id="pill-cat-${cat.replace(/\s+/g, '-')}" class="py-2 px-3 rounded-xl border text-[11px] font-bold text-left transition-all flex items-center justify-between gap-1 cursor-pointer select-none
                     ${isTrained ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100' : 'bg-cream/10 border-border text-charcoal/60 hover:bg-lavender-light hover:text-lavender'}">
                      <span class="truncate">${cat}</span>
                      <i data-lucide="${isTrained ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5 shrink-0 uppercase opacity-60"></i>
                   </button>
                 `;
               }).join('')}
            </div>
         </div>
      </div>

      <!-- Main Conversational Training Chamber -->
      <div class="bg-gradient-to-b from-[#8A7DCB]/5 to-white rounded-[45px] border border-border/90 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
         
         <!-- Header -->
         <div class="p-6 bg-white border-b border-border/60 flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
               <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-lavender to-[#C5A059] flex items-center justify-center text-white shadow-md">
                  <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
               </div>
               <div>
                  <h3 class="text-lg font-serif text-ink italic leading-none">Shree 2.0 Calibration Chamber</h3>
                  <p class="text-[10px] text-[#8A7DCB] font-bold uppercase tracking-widest mt-1">Guided Portfolio Verification</p>
               </div>
            </div>
            <div class="flex items-center gap-2 font-sans font-bold">
               <span id="active-session-indicator" class="px-3.5 py-1.5 rounded-full bg-lavender/10 text-lavender font-bold text-[10px] uppercase tracking-wider">Active: Academic Profile</span>
            </div>
         </div>

         <!-- Chat Flow Streams -->
         <div class="flex-1 bg-cream/10 p-6 md:p-8 space-y-6 max-h-[400px] overflow-y-auto" id="interview-chat-stream">
            <!-- Assistant Greeting -->
            <div class="flex items-start gap-4">
               <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-lavender/30 to-amber-200/10 flex flex-shrink-0 items-center justify-center text-lavender font-serif">
                  <i data-lucide="sparkles" class="w-4 h-4 text-lavender"></i>
               </div>
               <div class="bg-white border border-border rounded-2xl rounded-tl-sm p-5 max-w-[85%] text-sm text-ink leading-relaxed shadow-sm">
                  <p class="font-bold text-[10px] mb-1.5 text-lavender uppercase tracking-widest font-sans">Shree 2.0 Assistant</p>
                  <p class="font-medium text-charcoal/70">"Hello Saanvishree! I am ready to calibrate your academic portfolio knowledge base. Provide verified details regarding your coursework, research papers, projects, and goals so I can accurately represent you."</p>
               </div>
            </div>

            <!-- Active Question -->
            <div class="flex items-start gap-4">
               <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-lavender/30 to-amber-200/10 flex flex-shrink-0 items-center justify-center text-lavender font-serif">
                  <i data-lucide="graduation-cap" class="w-4 h-4 text-lavender"></i>
               </div>
               <div class="bg-white border border-border rounded-2xl rounded-tl-sm p-5 max-w-[85%] text-sm text-ink leading-relaxed shadow-sm">
                  <p class="font-bold text-[10px] mb-1.5 text-lavender uppercase tracking-widest font-sans">Target Academic Prompt</p>
                  <p class="font-serif italic text-base font-bold text-[#8A7DCB]" id="interview-active-question-text">
                     "What is your current academic standing, grade level (11th grade), and academic summary?"
                  </p>
               </div>
            </div>
         </div>

         <!-- Input Response Field -->
         <div class="p-6 bg-white border-t border-border/80 space-y-4">
            <div class="flex items-center justify-between text-xs text-charcoal/40 font-bold font-sans">
               <span id="interview-status-label">Awaiting your response...</span>
               <div class="flex items-center gap-4">
                  <button type="button" onclick="window.backToPreviousPrompt()" class="hover:text-lavender hover:underline flex items-center gap-1 cursor-pointer">
                     <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i> Previous
                  </button>
                  <button type="button" onclick="window.skipInterviewQuestion()" class="hover:text-lavender hover:underline flex items-center gap-1 cursor-pointer">
                     Skip Question <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                  </button>
               </div>
            </div>

            <!-- Answer text container -->
            <div class="flex gap-4 items-end">
               <textarea id="interview-response-input" rows="3" placeholder="Enter detailed academic records, methodology, learnings, or milestone descriptions..." class="flex-1 bg-cream/20 border border-border hover:border-lavender/40 focus:border-lavender focus:ring-1 focus:ring-lavender rounded-2xl p-4 text-sm outline-none resize-none leading-relaxed transition-all font-sans font-medium" max="4000"></textarea>
               <button type="button" id="save-interview-btn" class="bg-gradient-to-tr from-lavender to-[#C5A059] text-white h-[60px] px-8 rounded-2xl uppercase tracking-widest font-bold text-[11px] shadow-lg active:scale-95 transition-transform flex items-center gap-2 cursor-pointer font-sans">
                  <i data-lucide="check" class="w-4 h-4"></i> Save &amp; Next
               </button>
            </div>
         </div>
      </div>

      <!-- Revision Header -->
      <div class="space-y-6">
         <div class="flex items-center justify-between border-b border-border pb-4">
            <div>
               <h3 class="text-2xl font-serif text-ink italic tracking-tight select-none">Calibrated Knowledge Base</h3>
               <p class="text-xs text-charcoal/40 font-medium italic mt-1 font-sans">Review, revise, or update existing academic nodes.</p>
            </div>
            <span class="tag bg-lavender/5 text-lavender font-bold lowercase px-3 font-sans">${count} nodes active</span>
         </div>

         <!-- Static Display Grid of the Knowledge Base values -->
         ${count === 0 ? `
           <div class="bg-cream/20 border border-dotted border-border text-center py-16 px-4 rounded-[40px] shadow-inner">
              <i data-lucide="archive" class="w-8 h-8 mx-auto text-[#8A7DCB]/25 mb-4 flex items-center justify-center"></i>
              <p class="text-sm font-serif italic text-ink/75">No knowledge base documents exist yet. Calibrate Shree 2.0 above to empower your AI representative!</p>
           </div>
         ` : `
           <div class="font-sans text-xs bg-white border border-border p-5 rounded-[28px] mb-4 shadow-sm flex items-center justify-between gap-4">
             <div class="relative w-full max-w-sm">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 w-3.5 h-3.5"></i>
                <input type="text" id="kb-search-box" oninput="window.filterKbSearch()" placeholder="Search academic nodes..." class="w-full bg-cream/40 border border-border pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-lavender">
             </div>
             <span class="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest font-sans">Portfolio Knowledge Index</span>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans" id="kb-nodes-grid">
              ${memories.map(node => `
                <div class="kb-node-card bg-white p-6 rounded-[30px] border border-border/80 flex flex-col justify-between shadow-xs hover:border-lavender/40 hover:scale-[1.01] transition-all duration-300 font-sans" data-title="${(node.title || '').toLowerCase()}" data-category="${(node.category || '').toLowerCase()}" data-content="${(node.content || '').toLowerCase()}">
                   <div class="space-y-3">
                      <div class="flex items-center justify-between gap-2 flex-wrap">
                         <span class="tag bg-[#C5A059]/10 text-[#C5A059] text-[9px] px-2.5 py-0.5 rounded-md font-sans uppercase font-bold">${node.category}</span>
                         <span class="text-[9px] text-charcoal/30 font-bold uppercase tracking-wider">${new Date(node.updatedAt || Date.now()).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                      </div>
                      <h4 class="text-xs font-bold text-ink leading-relaxed text-charcoal/70">Q: ${node.question || node.title}</h4>
                      <p class="text-xs text-ink leading-relaxed font-sans font-medium line-clamp-5">
                         A: ${node.answer || node.content}
                      </p>
                   </div>
                   <div class="flex items-center justify-end gap-1.5 pt-4 border-t border-border/40 mt-5 shrink-0">
                      <button type="button" onclick="window.editSavedKnowledge('${node.id}', '${node.category}', '${(node.question || node.title).replace(/'/g, "\\'")}', '${(node.answer || node.content).replace(/\n/g, '\\n').replace(/'/g, "\\'")}')" class="w-8 h-8 hover:bg-lavender-light text-lavender rounded-full flex items-center justify-center transition-colors shadow-xs mr-1 cursor-pointer font-sans" title="Edit node">
                         <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                      </button>
                      <button type="button" onclick="window.eraseSavedKnowledge('${node.id}')" class="w-8 h-8 hover:bg-rose-50 text-rose-500 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer font-sans" title="Delete node">
                         <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                   </div>
                </div>
              `).join('')}
           </div>
         `}
      </div>

      <script>
         window.predefinedQuestionsMap = ${defaultQuestionsJsonEscaped};
         window.activeInterviewCategory = "Academic Profile";
      </script>
    </div>
  `;
}

export function renderAppLayout(isLoggedIn, currentUser, activeCategory, activeView, siteSettings = {}) {
  return `
     <div class="min-h-screen bg-[#FFFCF8] flex flex-col font-sans">
       ${renderHeaderView(currentUser)}
       
       ${(activeView === 'home' && !activeCategory) ? renderHeroShowcase(siteSettings, currentUser) : ''}
       
       <main id="main-content" class="flex-grow max-w-7xl w-full mx-auto px-6 py-10">
          <div id="content-area">
             <!-- Content loaded dynamically inside main.js -->
          </div>
       </main>
       
       ${renderFooterView()}
       
       <!-- Shree 2.0 Floating AI Academic Assistant Anchor Widget -->
       ${renderChatbotWidget()}

       <!-- Modal Container -->
       <div id="modal-container"></div>
     </div>
  `;
}

export function renderChatbotWidget() {
  return `
     <div class="fixed bottom-6 right-6 z-[100] font-sans">
        <!-- Floating controller button -->
        <button id="chatbot-toggle-btn" class="w-14 h-14 bg-gradient-to-tr from-lavender to-[#C5A059] rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group relative" title="Ask Shree 2.0 Academic Assistant">
           <i data-lucide="sparkles" class="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300"></i>
           <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
           </span>
        </button>

        <!-- Floating chat screen window -->
        <div id="chatbot-drawer" class="hidden absolute bottom-20 right-0 w-[360px] sm:w-[400px] h-[540px] bg-white rounded-[32px] border border-border/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
           <!-- Title details -->
           <div class="px-5 py-4 bg-gradient-to-r from-[#8A7DCB]/10 to-[#C5A059]/5 border-b border-border/40 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2.5">
                 <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender to-[#C5A059] flex items-center justify-center text-white shadow-sm">
                    <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                 </div>
                 <div>
                    <h4 class="text-xs font-serif italic text-ink font-bold leading-none">Shree 2.0</h4>
                    <span class="text-[8px] uppercase tracking-widest text-[#8A7DCB] font-sans font-bold">Academic Portfolio Assistant</span>
                 </div>
              </div>
              <button id="chatbot-close-btn" class="w-6 h-6 hover:bg-black/5 rounded-full flex items-center justify-center text-charcoal/50 hover:text-ink cursor-pointer">
                 <i data-lucide="x" class="w-4 h-4"></i>
              </button>
           </div>

           <!-- Content streams -->
           <div id="chatbot-messages" class="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-cream/10">
              <!-- Initial Greeting from Shree 2.0 -->
              <div class="flex items-start gap-3 animate-in fade-in duration-300">
                 <div class="w-7 h-7 rounded-full bg-[#8A7DCB]/10 flex items-center justify-center text-[#8A7DCB] font-serif shrink-0">
                    ✨
                 </div>
                 <div class="bg-white border border-border/60 rounded-2xl rounded-tl-sm p-4 text-xs text-charcoal/80 leading-relaxed shadow-xs space-y-2">
                    <p class="font-bold text-[9px] uppercase tracking-wider text-[#8A7DCB]">Shree 2.0</p>
                    <p>Hello! I am <strong class="text-ink">Shree 2.0</strong>, Saanvishree's AI Academic Portfolio Assistant.</p>
                    <p class="text-charcoal/60">Ask me about her projects, research papers, coursework, certifications, academic skills, or future university aspirations!</p>
                 </div>
              </div>
           </div>

           <!-- Quick suggestion pills -->
           <div class="px-4 py-2 bg-white/80 border-t border-border/30 flex gap-1.5 overflow-x-auto text-[10px] font-bold font-sans">
              <button onclick="window.sendChatPrompt('What projects has Saanvishree built?')" class="px-2.5 py-1 rounded-lg bg-lavender/10 text-lavender hover:bg-lavender/20 whitespace-nowrap cursor-pointer">Projects</button>
              <button onclick="window.sendChatPrompt('Tell me about her research and coursework.')" class="px-2.5 py-1 rounded-lg bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 whitespace-nowrap cursor-pointer">Research</button>
              <button onclick="window.sendChatPrompt('What are her key skills and future goals?')" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 whitespace-nowrap cursor-pointer">Skills &amp; Goals</button>
              <button onclick="window.sendChatPrompt('What certifications has Saanvishree earned?')" class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 whitespace-nowrap cursor-pointer">Certifications</button>
           </div>

           <!-- Chat Inputs -->
           <div class="p-4 bg-white border-t border-border/60 shrink-0">
              <div class="flex gap-2">
                 <input type="text" id="chatbot-input" placeholder="Ask about her academic work..." class="flex-1 bg-cream/30 border border-border/70 hover:border-lavender/30 focus:border-lavender rounded-xl px-4 py-2.5 text-xs outline-none font-sans font-semibold">
                 <button id="chatbot-send-btn" class="w-9 h-9 bg-gradient-to-tr from-[#8A7DCB] to-[#C5A059] rounded-xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
                    <i data-lucide="send" class="w-4 h-4"></i>
                 </button>
              </div>
              <p class="text-center text-[8px] text-charcoal/40 mt-2 font-sans">Grounded in verified portfolio records &amp; knowledge base</p>
           </div>
        </div>
     </div>
  `;
}
