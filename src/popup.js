document.addEventListener('DOMContentLoaded', () => {
  const previews = document.getElementById('previewsCheckbox');
  const important = document.getElementById('importantCheckbox');

  // Load the previous setting (defaulting to true)
  chrome.storage.sync.get({ hidePreview: true, hideImportant: true }, ({ hidePreview, hideImportant }) => {
    previews.checked = hidePreview;
    important.checked = hideImportant;
  });

  // When user toggles, save setting
  previews.addEventListener('change', () => {
    chrome.storage.sync.set({ hidePreview: previews.checked });
  });
  important.addEventListener('change', () => {
    chrome.storage.sync.set({ hideImportant: important.checked });
  });
});