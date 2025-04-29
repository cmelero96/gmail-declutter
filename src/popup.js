document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('toggleCheckbox');

  // Load the previous setting (defaulting to true)
  chrome.storage.sync.get({ hidePreview: true }, ({ hidePreview }) => {
    checkbox.checked = hidePreview;
  });

  // When user toggles, save setting
  checkbox.addEventListener('change', () => {
    chrome.storage.sync.set({ hidePreview: checkbox.checked });
  });
});