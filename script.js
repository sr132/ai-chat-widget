
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const typingIndicator = document.getElementById('typingIndicator');

let conversationHistory = [];

function addBubble(text, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble', sender); // sender is 'user' or 'bot'
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight; // auto-scroll to newest
  return bubble;
}

function showTyping(show) {
  typingIndicator.style.display = show ? 'flex' : 'none';
}

async function sendMessage(message) {
  addBubble(message, 'user');
  conversationHistory.push({ role: 'user', content: message });

  showTyping(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply;

    addBubble(reply, 'bot');
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    console.error(err);
    addBubble("Sorry, something went wrong talking to the server.", 'bot');
  } finally {
    showTyping(false);
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault(); 
  const message = userInput.value.trim();
  if (!message) return;
  userInput.value = '';
  sendMessage(message);
});
