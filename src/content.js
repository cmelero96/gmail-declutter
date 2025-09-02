(function() {
  const messagePreviewsSelector = "table[id] tr td[id][role='gridcell'] div + span[id]";
  const importantIconsSelector = "table[id] tr > td[jsaction][jscontroller]";
  const searchFormSelector = "#aso_search_form_anchor"
  const mainUnreadQuery = "is:unread category:primary"
  let hideMessagePreviews = true;
  let hideImportantIcons = true;

  function setupSearchShortcut() {
    const searchForm = document.querySelector(searchFormSelector);
    if (!searchForm) return;
    
    searchForm.style.position = 'relative';
    
    // Create button
    const button = document.createElement('button');
    button.className = 'main-unread-shortcut-button';
    button.style.position = 'absolute';
    button.style.inset = '0 auto 0 100%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    
    // Create span inside button
    const span = document.createElement('span');
    span.style.borderRadius = '16px';
    span.style.display = 'inline-flex';
    span.style.height = '24px';
    span.style.lineHeight = 'initial';
    span.style.padding = '8px 4px 4px 4px';
    span.textContent = 'Main unread emails';
    button.appendChild(span);
    
    // Add hover effect to span
    button.addEventListener('mouseenter', () => {
      span.style.backgroundColor = 'rgba(120,120,120,0.1)';
    });
    button.addEventListener('mouseleave', () => {
      span.style.backgroundColor = '';
    });
    
    // Trigger search when button is clicked
    button.addEventListener('click', () => {
      const searchInput = searchForm.querySelector('input:not([disabled])');
      if (searchInput) {
        searchInput.value = mainUnreadQuery;
        searchInput.focus();
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
      }
    });
    
    searchForm.appendChild(button);
  }

  function updateView(hidePreview, hideImportant) {
    hideMessagePreviews = hidePreview ?? hideMessagePreviews;
    hideImportantIcons = hideImportant ?? hideImportantIcons;
    applySettings();
  }

  function applySettings() {
    toggleElements(messagePreviewsSelector, hideMessagePreviews);
    toggleElements(importantIconsSelector, hideImportantIcons);
  }

  function toggleElements(selector, shouldHide) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = shouldHide ? 'none' : '';
    });
  }

  // Initial state load
  chrome.storage.sync.get({ hidePreview: true, hideImportant: true }, ({ hidePreview, hideImportant }) => {
    updateView(hidePreview, hideImportant);
    setupSearchShortcut();
  });

  // Re-apply whenever Gmail injects new nodes
  const observer = new MutationObserver(() => {
    applySettings();
    setupSearchShortcut();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for changes from the popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      updateView(changes.hidePreview?.newValue, changes.hideImportant?.newValue)
    }
  });
})();