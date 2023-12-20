// Function to handle emoji selection and comment posting
export function postCommentWithEmoji(emoji, lineElement) {
  // Step 1: Click the '+' button
  const addButton = lineElement.querySelector('.js-add-line-comment')
  addButton.click()

  // Small delay to ensure the comment box is visible
  setTimeout(() => {
    // Step 2: Fill in the comment
    const commentBox = document.querySelector('textarea where the comment box appears') // Update the selector as needed
    commentBox.value = emoji

    // Step 3: Click the 'Add single comment' button
    const commentButton = document.querySelector('.js-single-comment-button')
    commentButton.click()
  }, 1000) // Adjust delay as necessary
}
