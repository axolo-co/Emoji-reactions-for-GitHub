// Function to add emojis to code lines
function addEmojisToCodeLines() {
  const codeLines = document.querySelectorAll(
    '.blob-code.blob-code-context.js-file-line, .blob-code.blob-code-addition, .blob-code.blob-code-deletion',
  )

  codeLines.forEach((line) => {
    if (!line.dataset.emojiAdded) {
      line.dataset.emojiAdded = 'true' // Mark the line so we don't add emojis multiple times

      line.addEventListener('mouseenter', handleMouseEnter)
      line.addEventListener('mouseleave', handleMouseLeave)
    }
  })
}

let timer = null;

// Function to handle mouse enter event
function handleMouseEnter() {
  const line = this;

  timer = setTimeout(() => {
    const emojiContainer = createEmojiContainer();
    emojis.forEach(({ emoji, tooltip }, index) => {
      const emojiButton = createEmojiButton(emoji, tooltip, index, line);
      emojiContainer.appendChild(emojiButton);
    });

    line.appendChild(emojiContainer);
  }, 800); // Delay of 2000ms
}

// Function to handle mouse leave event
function handleMouseLeave() {
  const line = this;
  const emojiContainer = line.querySelector('.emoji-container');
  if (emojiContainer) {
    emojiContainer.remove();
  }

  // Clear the timer when mouse leaves the line
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}


// Function to create emoji container
function createEmojiContainer() {
  const emojiContainer = document.createElement('div')
  emojiContainer.classList.add('emoji-container')
  return emojiContainer
}

// Function to create emoji button
function createEmojiButton(emoji, tooltip, index,line) {
  const emojiButton = document.createElement('button')
  emojiButton.classList.add('emoji-button')
  emojiButton.innerText = emoji
  emojiButton.style.fontSize = '18px'
  emojiButton.title = tooltip

  if (index < emojis.length - 1) {
    emojiButton.style.borderRight = '2px solid darkgray'
  }

  if (index === 0) {
    emojiButton.style.borderTopLeftRadius = '25px'
    emojiButton.style.borderBottomLeftRadius = '25px'
  } else if (index === emojis.length - 1) {
    emojiButton.style.borderTopRightRadius = '25px'
    emojiButton.style.borderBottomRightRadius = '25px'
  }

  emojiButton.addEventListener('click', () => {
    postCommentWithEmoji(emoji, line)
  })

  return emojiButton
}

// Function to trigger input event
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
  function proceedWithComment(indexInput) {
    const commentBox = document.querySelectorAll(
      '.inline-comment-form-container textarea',
    )
    if (!commentBox) {
      console.error('Comment box not found')
      return
    }

    commentBox[indexInput].value = emoji
    triggerInputEvent(commentBox[indexInput])

    const commentButton = document.querySelectorAll('.review-simple-reply-button')

    // Here we check the settings to see if we should automatically post the comment or not
    chrome.storage.sync.get('autoComment', (data) => {
      if (data.autoComment) {
        if (!commentButton[indexInput]) {
          console.error('Comment button not found')
          return
        }
        commentButton[indexInput].click()
      }
    })
  }

  // Check if the comment box is available, if not wait a bit
  const checkExist = setInterval(() => {
    const inlineCommentFormContainerTextArea = document.querySelectorAll(
      '.inline-comment-form-container textarea',
    )

    let indexInput = -1 // Initialize with a default value
    // Find the index of the first matching element
    // This index is used to find the correct input from the line that has been selected
    Array.from(inlineCommentFormContainerTextArea).some((element, index) => {
      const id = element.getAttribute('id')
      // The way we find the input is by looking at the ID, usually the input ID we want is something like 'r2_new_inline_comment_123'
      // So we are looking for an ID that does not starts with 'new_inline'
      if (id && !id.startsWith('new_inline')) {
        indexInput = index
        return true
      }
    })

    if (inlineCommentFormContainerTextArea) {
      clearInterval(checkExist)
      proceedWithComment(indexInput)
    }
  }, 100) // Check every 100ms
}

// Function to find the index of the comment box
function findCommentBoxIndex() {
  const inlineCommentFormContainerTextArea = document.querySelectorAll('.inline-comment-form-container textarea')
  let indexInput = -1
  Array.from(inlineCommentFormContainerTextArea).some((element, index) => {
    const id = element.getAttribute('id')
    if (id && !id.startsWith('new_inline')) {
      indexInput = index
      return true
    }
  })
  return indexInput
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
