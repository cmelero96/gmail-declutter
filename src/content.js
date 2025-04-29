(function() {
  const selector = "table[id] tr td[id][role='gridcell'] div + span[id]";
  let hide = true;

  // Apply or remove the `display:none` on every matching element
  function apply() {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = hide ? 'none' : '';
    });
  }

  // Initial state load
  chrome.storage.sync.get({ hidePreview: true }, ({ hidePreview }) => {
    hide = hidePreview;
    apply();
  });

  // Re-apply whenever Gmail injects new nodes
  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for changes from the popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.hidePreview) {
      hide = changes.hidePreview.newValue;
      apply();
    }
  });
})();