import type { MessagePayload } from './background'

console.log('ChatsNavi content script loaded') // デバッグ用ログ

export default defineContentScript({
  matches: ['https://chatgpt.com/*', 'https://gemini.google.com/*'],
  main() {
    console.log('ChatsNavi content script main function executed') // デバッグ用ログ
    browser.runtime.onMessage.addListener((message: MessagePayload) => {
      console.log('Message received:', message) // デバッグ用ログ
      
      if (message.type !== 'FILL_PROMPT') return

      if (message.target === 'chatgpt') {
        // contenteditable divを探す
        const promptDiv = document.querySelector<HTMLDivElement>('#prompt-textarea')
        console.log('ChatGPT prompt div found:', !!promptDiv) // デバッグ用ログ
        console.log('AutoSubmit enabled:', !!message.autoSubmit) // autoSubmitの値を確認
        
        if (promptDiv) {
          // contenteditableにテキストを設定する
          promptDiv.innerHTML = `<p>${message.text}</p>`
          promptDiv.dispatchEvent(new InputEvent('input', { bubbles: true }))

          if (message.autoSubmit) {
            // 複数のセレクタを試す
            const submitButton = 
              document.querySelector<HTMLButtonElement>('button[data-testid="send-button"]') ||
              document.querySelector<HTMLButtonElement>('button[aria-label="プロンプトを送信する"]') ||
              document.querySelector<HTMLButtonElement>('.send-button')
            
            console.log('ChatGPT submit button found:', !!submitButton) // デバッグ用ログ
            if (submitButton) {
              console.log('Clicking submit button')
              submitButton.click()
            } else {
              console.log('Submit button not found, cannot auto-submit')
            }
          }
        } else {
          // プロンプト要素が見つからない場合は、待機して再試行
          console.log('Prompt div not found, retrying...')
          
          // 500ミリ秒ごとに最大10回試行
          let attempts = 0
          const maxAttempts = 10
          
          const interval = setInterval(() => {
            attempts++
            const promptDiv = document.querySelector<HTMLDivElement>('#prompt-textarea')
            console.log(`Attempt ${attempts}: prompt div found: ${!!promptDiv}`)
            
            if (promptDiv) {
              clearInterval(interval)
              promptDiv.innerHTML = `<p>${message.text}</p>`
              promptDiv.dispatchEvent(new InputEvent('input', { bubbles: true }))
              
              if (message.autoSubmit) {
                // 複数のセレクタを試す
                const submitButton = 
                  document.querySelector<HTMLButtonElement>('button[data-testid="send-button"]') ||
                  document.querySelector<HTMLButtonElement>('button[aria-label="プロンプトを送信する"]') ||
                  document.querySelector<HTMLButtonElement>('.send-button')
                
                console.log('ChatGPT submit button found (retry):', !!submitButton) // デバッグ用ログ
                if (submitButton) {
                  console.log('Clicking submit button (retry)')
                  submitButton.click()
                } else {
                  console.log('Submit button not found in retry, cannot auto-submit')
                }
              }
            }
            
            if (attempts >= maxAttempts) {
              clearInterval(interval)
              console.log('Failed to find prompt div after maximum attempts')
            }
          }, 500)
        }
      }

      if (message.target === 'gemini') {
        const richTextarea = document.querySelector('rich-textarea')
        const paragraph = richTextarea?.querySelector<HTMLParagraphElement>('p')
        console.log('Gemini textarea found:', !!richTextarea, 'Paragraph found:', !!paragraph) // デバッグ用ログ

        if (paragraph) {
          paragraph.textContent = message.text

          if (message.autoSubmit) {
            const submitButton = document.querySelector<HTMLButtonElement>('.send-button')
            console.log('Gemini submit button found:', !!submitButton) // デバッグ用ログ
            // Geminiの場合、入力反映に少し時間がかかるので遅延実行
            setTimeout(() => {
              submitButton?.click()
            }, 500)
          }
        }
      }
    })
  },
})
