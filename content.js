function addEmojisToCodeLines() {
  const codeLines = document.querySelectorAll(
    '.blob-code.blob-code-context.js-file-line, .blob-code.blob-code-addition, .blob-code.blob-code-deletion',
  )

  codeLines.forEach((line) => {
    if (!line.dataset.emojiAdded) {
      line.dataset.emojiAdded = 'true' // Mark the line so we don't add emojis multiple times

      // When mouse over we show the emoji picker
      line.addEventListener('mouseenter', () => {
        const emojiContainer = document.createElement('div')
        // Add styles to emojiContainer for positioning and styling
        emojiContainer.classList.add('emoji-container')

        const emojis = [
          '👍', // I like this
          '🔧', // Needs to be changed
          '❓', // I have a question
          '🤔', // Thinking aloud or suggesting alternatives
          '🌱', // Planting a seed for future
          '📝', // Explanatory note
          '⛏', // Nitpick
          '♻️', // Suggestion for refactoring
          '🏕', // Opportunity to improve the codebase
          '📌', // Concerns out of scope
          '💡', // A new idea or suggestion
        ]

        emojis.forEach((emoji) => {
          const emojiButton = document.createElement('button')
          emojiButton.innerText = emoji
          emojiButton.style.fontSize = '20px' // Adjust the size as needed

          // Add styles to emojiButton

          emojiButton.addEventListener('click', () => {
            postCommentWithEmoji(emoji, line)
          })

          emojiContainer.appendChild(emojiButton)
        })

        line.appendChild(emojiContainer)
      })

      // When mouse leave we kill the emoji picker
      line.addEventListener('mouseleave', () => {
        const emojiContainer = line.querySelector('.emoji-container')
        if (emojiContainer) {
          emojiContainer.remove() // This will remove the emoji picker from the DOM
        }
      })
    }
  })
}

function triggerInputEvent(element) {
  const event = new Event('input', { bubbles: true })
  element.dispatchEvent(event)
}

function postCommentWithEmoji(emoji, lineElement) {
  // Step 1: Click the '+' button
  const addButton = lineElement.querySelector('.js-add-line-comment')
  if (!addButton) {
    console.error('Add button not found')
    return
  }
  addButton.click()

  // Function to proceed with comment posting
  function proceedWithComment() {
    const commentBox = document.querySelectorAll(
      '.inline-comment-form-container textarea',
    )
    if (!commentBox) {
      console.error('Comment box not found')
      return
    }

    // This needs to be changed
    // We need to identify which one we should take rather than taking the last one every time
    // Because code reviews aren't always done from top to bottom
    const lastCommentBox = commentBox.length - 1

    commentBox[lastCommentBox].value = emoji
    triggerInputEvent(commentBox[lastCommentBox])

    // Same here, we take the last one but it's not always the right one
    const commentButton = document.querySelectorAll('.review-simple-reply-button')
    const lastCommentButton = commentButton.length - 1

    if (!commentButton[lastCommentButton]) {
      console.error('Comment button not found')
      return
    }
    commentButton[lastCommentButton].click()
  }

  // Check if the comment box is available, if not wait a bit
  const checkExist = setInterval(() => {
    const inlineCommentFormContainerTextArea = document.querySelectorAll(
      '.inline-comment-form-container textarea',
    )
    console.log(
      '👉👉👉 inlineCommentFormContainerTextArea',
      inlineCommentFormContainerTextArea,
    )
    if (inlineCommentFormContainerTextArea) {
      clearInterval(checkExist)
      proceedWithComment()
    }
  }, 100) // Check every 100ms
}

// Observer for dynamic content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      addEmojisToCodeLines()
    }
  })
})

// Start observing the document body
observer.observe(document.body, { childList: true, subtree: true })

// Initial run in case the content is already there
addEmojisToCodeLines()
