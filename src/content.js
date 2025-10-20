(function() {
  const messagePreviewsSelector = "table[id] tr td[id][role='gridcell'] div + span[id]";
  const importantIconsSelector = "table[id] tr > td[jsaction][jscontroller]";
  const searchFormSelector = "#aso_search_form_anchor"
  const mainUnreadQuery = "is:unread category:primary"
  let hideMessagePreviews = true;
  let hideImportantIcons = true;

  function setupSearchShortcut() {
    const searchForm = document.querySelector(searchFormSelector);
    if (!searchForm || !searchForm.parentElement) {
      console.error("Gmail Declutter Error - Search form not found");
      return;
    }
    const searchInput = searchForm.querySelector('input:not([disabled])');
    if (!searchInput)  {
      console.error("Gmail Declutter Error - Search input not found");
      return;
    };
    
    searchForm.parentElement.style.display = 'flex';
    searchForm.parentElement.style.columnGap = '8px';
    searchForm.style.flexGrow = '1';
    
    // Check if button already exists
    let button = document.getElementById('main-unread-shortcut-button');
    let span = document.getElementById('main-unread-shortcut-span');
    
    if (!button) {
      // Create button only if it doesn't exist
      button = document.createElement('button');
      button.id = 'main-unread-shortcut-button';
      button.style.borderRadius = '20px';
      button.style.borderWidth = '0';
      button.style.outline = '1px solid lightgrey';
      button.style.background = 'white';
      button.style.boxShadow = '0px 2px 6px -4px darkslategrey';
      button.style.height = '36px';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.padding = '0 8px';
      button.style.alignSelf = 'center';

      // Create span inside button
      span = document.createElement('span');
      span.id = 'main-unread-shortcut-span';
      span.textContent = 'Main unread emails';
      button.appendChild(span);
      
      // Add hover effect to button
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'lightgrey';
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'white';
      });
      
      // Trigger search when button is clicked
      button.addEventListener('click', () => {
          button.style.visibility = 'hidden';
          searchInput.value = mainUnreadQuery;
          searchInput.focus();
          searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
      });
      
      searchForm.parentElement.appendChild(button);
    }

    function updateButtonVisibility() {
      button.style.visibility = searchInput.value.trim() !== mainUnreadQuery ? 'visible' : 'hidden';
    }
    
    // Update button visibility and add input listener
    updateButtonVisibility();
    
    // Remove existing input listener to avoid duplicates
    searchInput.removeEventListener('input', updateButtonVisibility);
    // Add change listener to search input to show button again
    searchInput.addEventListener('input', updateButtonVisibility);
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