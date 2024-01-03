document.addEventListener('DOMContentLoaded', () => {
  const autoCommentCheckbox = document.getElementById('autoComment')

  // Load the saved setting or default to true
  chrome.storage.sync.get({ autoComment: false }, (data) => {
    autoCommentCheckbox.checked = data.autoComment
  })

  // Save the setting when the checkbox is changed
  autoCommentCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ autoComment: autoCommentCheckbox.checked })
  })
})
