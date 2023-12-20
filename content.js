console.log('Hello from content.js')

// Function to add emojis to code lines
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

        const emojis = ['😀', '👍', '🎉', '❤️', '🚀']
        emojis.forEach((emoji) => {
          const emojiButton = document.createElement('button')
          emojiButton.innerText = emoji
          // Add styles to emojiButton

          emojiButton.addEventListener('click', () => {
            alert(`Emoji ${emoji} clicked!`)
          })

          emojiContainer.appendChild(emojiButton)
        })

        line.appendChild(emojiContainer)
      })

      // When mouse leave we kill the emoji picker
      line.addEventListener('mouseleave', () => {
        console.log('mouse leaves')
        const emojiContainer = line.querySelector('.emoji-container')
        if (emojiContainer) {
          emojiContainer.remove() // This will remove the emoji picker from the DOM
        }
      })
    }
  })
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
