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

        emojis.forEach(({ emoji, tooltip }, index) => {
          const emojiButton = document.createElement('button')
          emojiButton.classList.add('emoji-button')
          emojiButton.innerText = emoji
          emojiButton.style.fontSize = '18px' // Adjust the size as needed
          emojiButton.title = tooltip // Set the tooltip text

          // Add a dark gray border to the right of each emoji button
          if (index < emojis.length - 1) { // Check if it's not the last emoji
            emojiButton.style.borderRight = '2px solid darkgray'; // Adjust the width and color as needed
          }

          // Rounded corners for the first and last emoji

          if (index === 0) { // first emoji
            emojiButton.style.borderTopLeftRadius = '25px';
            emojiButton.style.borderBottomLeftRadius = '25px';
          } else if (index === emojis.length - 1) { // last emoji
            emojiButton.style.borderTopRightRadius = '25px';
            emojiButton.style.borderBottomRightRadius = '25px';
          }


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

  // 获取 lineElement 下面 button 的data-anchor 和 data-position
  const dataAnchor = addButton.getAttribute('data-anchor') // diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5
  const dataPosition = addButton.getAttribute('data-position') // 3
  // r0_new_inline_comment_diff_diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5_3
  const idTaget = `${dataAnchor}_${dataPosition}`
  // 找到idTarget对应的textarea，然后填充emoji，然后点击评论按钮

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

  const checkExist = setInterval(() => {
    const inlineCommentFormContainerTextAreas = Array.from(document.querySelectorAll('.inline-comment-form-container textarea'));
  
    let indexInput = -1;
    for (let i = 0; i < inlineCommentFormContainerTextAreas.length; i++) {
      const element = inlineCommentFormContainerTextAreas[i];
      const id = element.getAttribute('id');
      if (id && id.includes(idTaget) && !id.startsWith('new_inline')) {
        indexInput = i;
        break;
      }
    }
  
    if (indexInput !== -1) {
      clearInterval(checkExist);
      proceedWithComment(indexInput);
    }
  }, 100)
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
