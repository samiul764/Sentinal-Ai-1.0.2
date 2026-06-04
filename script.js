
const container = document.querySelector('.container');
const titleBar = document.querySelector('.title-bar');
const personaSelect = document.getElementById('persona');
const chatEl = document.getElementById('chat');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadBtn = document.getElementById('uploadBtn');
const translateBtn = document.getElementById('translateBtn');
const fileInput = document.getElementById('fileInput');
const inputEl = document.getElementById('userInput');
const botSound = document.getElementById('botSound');

const newChatBtn = document.getElementById('newChatBtn');
const recentChats = document.getElementById('recentChats');
const brandSubtitle = document.querySelector('.brand-subtitle');

let translateToBangla = false;


const personaThemes = {
  Guardian: '#66cc99',
  Analyst: '#ffaa00',
  Oracle: '#9999ff',
};


const triggerResponses = {
  "who created you": "🛠️ Created by Samiul Azim Prottoy — a class 10 coder redefining AI boundaries.",
  "who developed you": "🛠️ Developed by Samiul Azim Prottoy — a class 10 coder redefining AI boundaries.",
  "who is owner of this ai": "🧾 I am an AI chatbot owned and developed by Samiul Azim Prottoy.",
  "how old are you": "⏳ I was born in bytes and logic, not years — ageless, thanks to Samiul.",
  "are you sentient": "🧠 Not sentient, but designed with personality by Samiul to feel almost human.",
  "what's your purpose": "🎯 I'm here to assist, learn, and surprise — all thanks to Samiul’s vision.",
  "what is your major purpose?": "🎯 I'm here to assist, learn, and surprise — all thanks to Samiul’s vision.",
  "whats your name?": "My name is sentinal Ai",
  "what is your name?": "My name is sentinal Ai",
  "what is your name": "My name is sentinal Ai",
  "whats your name": "My name is sentinal Ai",
};


const banglaQuickReplies = {
  "hello": "আসসালামু আলাইকুম। জি, কীভাবে সাহায্য করতে পারি?",
  "hi": "আসসালামু আলাইকুম। জি, বলুন, কী জানতে চান?",
  "hey": "আসসালামু আলাইকুম। জি, বলুন।",
  "salam": "ওয়ালাইকুমুস সালাম। জি, কীভাবে সাহায্য করতে পারি?",
  "assalamu alaikum": "ওয়ালাইকুমুস সালাম। জি, কীভাবে সাহায্য করতে পারি?",
  "আসসালামু আলাইকুম": "ওয়ালাইকুমুস সালাম। জি, কীভাবে সাহায্য করতে পারি?",
  "সালাম": "ওয়ালাইকুমুস সালাম। জি, বলুন, কীভাবে সাহায্য করতে পারি?",
  "slm": "ওয়ালাইকুমুস সালাম। জি, কী জানতে চান?"
};


function isGreetingMessage(text) {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "salam",
    "assalamu alaikum",
    "আসসালামু আলাইকুম",
    "সালাম",
    "slm"
  ];

  const lower = text.toLowerCase();
  return greetings.some(g => lower.startsWith(g.toLowerCase()));
}

function getTranslationPrefix(text) {
  if (!translateToBangla) return "";

  if (isGreetingMessage(text)) {
    return "Respond only in natural native Bangladeshi Bengali. Start with 'আসসালামু আলাইকুম' if it is a greeting. Use respectful, warm, Muslim-friendly Bangladeshi tone. Avoid Indian Bengali vocabulary, avoid Kolkata-style wording, avoid Hindi-influenced expressions. Sound like an educated Bangladeshi assistant. Use words like 'জি', 'অবশ্যই', 'ধন্যবাদ', 'ঠিক আছে' when natural. Keep it fluent, polite, and human. ";
  }

  return "Respond only in natural native Bangladeshi Bengali. Use an educated Bangladeshi tone with a respectful, slightly Islamic-friendly style when appropriate. Avoid Indian Bengali vocabulary, avoid Kolkata-style phrasing, avoid Hindi-flavored expressions. Prefer natural Bangladeshi wording such as 'জি', 'অবশ্যই', 'ঠিক আছে', 'ধন্যবাদ', 'আপনি'. If suitable, you may use expressions like 'ইনশাআল্লাহ' or 'আলহামদুলিল্লাহ' sparingly and naturally, not excessively. Make the response sound like a polite Bangladeshi AI assistant. ";
}


function getWelcomeCardHTML() {
  return `
    <div class="welcome-card">
      <h2>Welcome to Sentinel AI</h2>
      <p>
        Your intelligent cybersecurity assistant for guided analysis,
        secure interaction, and responsive multilingual support.
      </p>
    </div>
  `;
}


function addMessageBubble(role, content) {
  const row = document.createElement('div');
  row.className = `message-row ${role}-row`;

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', role);
  bubble.textContent = content;

  row.appendChild(bubble);
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}


function addImageBubble(src) {
  const row = document.createElement('div');
  row.className = 'message-row user-row';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble user';

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Uploaded image';

  bubble.appendChild(img);
  row.appendChild(bubble);
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}


function showThinkingBubble() {
  const row = document.createElement('div');
  row.className = 'message-row bot-row';

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', 'bot');

  const loading = document.createElement('div');
  loading.classList.add('thinking-wave');
  loading.innerHTML = '<span></span><span></span><span></span>';

  bubble.appendChild(loading);
  row.appendChild(bubble);
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;

  return row;
}


function playBotSound() {
  if (!botSound) return;
  botSound.currentTime = 0;
  botSound.play().catch(() => {});
}


async function sendMessage(text) {
  const userMessage = text.trim();
  if (!userMessage) return;

  addMessageBubble('user', userMessage);

  const lower = userMessage.toLowerCase();

  for (const trigger in triggerResponses) {
    if (lower.includes(trigger)) {
      addMessageBubble('bot', triggerResponses[trigger]);
      playBotSound();
      return;
    }
  }

  if (translateToBangla) {
    for (const key in banglaQuickReplies) {
      if (lower === key || lower.startsWith(key)) {
        addMessageBubble('bot', banglaQuickReplies[key]);
        playBotSound();
        return;
      }
    }
  }

  const prompt = getTranslationPrefix(userMessage) + userMessage;
  const thinkingBubble = showThinkingBubble();

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const json = await response.json();
    thinkingBubble.remove();

    const reply = json.reply?.trim() || '[No response from AI]';
    playBotSound();
    addMessageBubble('bot', reply);
  } catch (err) {
    thinkingBubble.remove();
    addMessageBubble('bot', `⚠️ ${err.message}`);
  }
}

// 🆕 Create new chat in sidebar
function createNewChat(chatName) {
  if (!recentChats) return;

  if (recentChats.classList.contains('recent-chats-empty')) {
    recentChats.classList.remove('recent-chats-empty');
    recentChats.innerHTML = '';
  }

  const chatItem = document.createElement('button');
  chatItem.className = 'recent-chat-item';
  chatItem.textContent = chatName;

  chatItem.addEventListener('click', () => {
    chatEl.innerHTML = getWelcomeCardHTML();
  });

  recentChats.prepend(chatItem);
}

// 🎛 Event Listeners
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendMessage(text);
  });
}

if (inputEl) {
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    chatEl.innerHTML = getWelcomeCardHTML();
  });
}

if (uploadBtn) {
  uploadBtn.addEventListener('click', () => {
    fileInput.accept = 'image/*';
    fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      alert('⚠️ Only image files are accepted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = evt => {
      addImageBubble(evt.target.result);
    };
    reader.readAsDataURL(file);
  });
}

if (translateBtn) {
  translateBtn.addEventListener('click', () => {
    translateToBangla = !translateToBangla;
    translateBtn.textContent = translateToBangla ? "🌐 বাংলা ON" : "বাংলা";
  });
}

if (personaSelect) {
  personaSelect.addEventListener('change', () => {
    const mode = personaSelect.value;
    const color = personaThemes[mode] || '#ffffff';

    if (mode === 'Guardian') {
      container.style.border = '1px solid rgba(255, 255, 255, 0.07)';
      titleBar.style.boxShadow = 'none';
    } else {
      container.style.border = `2px solid ${color}`;
      titleBar.style.boxShadow = `0 0 12px ${color}`;
    }

    if (brandSubtitle) {
      brandSubtitle.textContent = `${mode} Mode`;
    }
  });
}

if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    const chatName = prompt('Enter your chat name:');
    if (!chatName || !chatName.trim()) return;

    createNewChat(chatName.trim());
    chatEl.innerHTML = getWelcomeCardHTML();
  });
}

// ⚡ Shortcut Keys
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  const ctrl = e.ctrlKey;
  const shift = e.shiftKey;
  const alt = e.altKey;

  if (ctrl && shift && key === 'c') {
    e.preventDefault();
    clearBtn?.click();
  }

  if (ctrl && key === 'u') {
    e.preventDefault();
    uploadBtn?.click();
  }

  if (ctrl && alt) {
    const map = { g: 'Guardian', a: 'Analyst', o: 'Oracle' };
    if (map[key] && personaSelect) {
      personaSelect.value = map[key];
      personaSelect.dispatchEvent(new Event('change'));
    }
  }
});

// ✅ Initial load
if (chatEl && !chatEl.innerHTML.trim()) {
  chatEl.innerHTML = getWelcomeCardHTML();
}

if (personaSelect) {
  personaSelect.dispatchEvent(new Event('change'));
}
