/**
 * Keeps the ShreeVerse layout perfectly stabilized & responsive.
 * Manages side drawer toggle, backdrop overlays, and screen dimensions.
 */
export function initResponsiveControllers() {
  const sidebar = document.getElementById('sidebar-nav');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('mobile-menu-toggle');
  
  if (!sidebar || !overlay) return;

  const openMenu = () => {
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.add('opacity-100');
      overlay.classList.remove('opacity-0');
    }, 50);
    sidebar.classList.add('translate-x-0');
    sidebar.classList.remove('-translate-x-full');
  };

  const closeMenu = () => {
    overlay.classList.add('opacity-0');
    overlay.classList.remove('opacity-100');
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  };

  if (toggle) {
    toggle.onclick = () => {
      const isMobileOpen = sidebar.classList.contains('translate-x-0');
      if (isMobileOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };
  }

  const closeBtnMob = document.getElementById('close-sidebar-mob');
  if (closeBtnMob) closeBtnMob.onclick = closeMenu;
  
  overlay.onclick = closeMenu;

  sidebar.onclick = (e) => {
    if (window.innerWidth < 1024 && (e.target.closest('button') || e.target.closest('a'))) {
      if (e.target.closest('#add-chapter-btn')) return;
      closeMenu();
    }
  };

  // Safe-guard to close drawer if window is resized above mobile/tablet screen widths
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });
}
