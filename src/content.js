(function() {
  const messagePreviewsSelector = "table[id] tr td[id][role='gridcell'] div + span[id]";
  const importantIconsSelector = "table[id] tr > td[jsaction][jscontroller]";
  let hideMessagePreviews = true;
  let hideImportantIcons = true;

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
  chrome.storage.sync.get({ hidePreview: true, hideImportant: true }, ({ hidePreview, hideImportant }) => updateView(hidePreview, hideImportant));

  // Re-apply whenever Gmail injects new nodes
  const observer = new MutationObserver(applySettings);
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for changes from the popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      updateView(changes.hidePreview?.newValue, changes.hideImportant?.newValue)
    }
  });
})();