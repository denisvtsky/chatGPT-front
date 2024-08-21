const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');
let userText = null;

const createMessageBox = (html, className) => {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat', className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;
    const html = `<div class="chat-content">
					        <div class="chat-details">
						        <img src="/styles/img/default-user.jpg" alt="default-user">
						        <div class="msg"><p>${userText}</p></div>
					        </div>
					        <span id="copy-btn" class="material-symbols-rounded" title="Копировать">content_copy</span>
					        <hr>
	                    </div>`;
    const outgoingChatDiv = createMessageBox(html, 'outgoing');
    chatContainer.appendChild(outgoingChatDiv);
    chatInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    sendMessage(userText);
}

const sendMessage = (message) => {
    const url = '/api/chat/requestCompletion';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    }
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            let aiResponse = data.data.completion;
            handleIncomingChat(aiResponse);
        })
        .catch(error => console.log(error));
}

const handleIncomingChat = (aiResponse) => {
    let rendered = aiResponse
    const html = `<div class="chat-content">
					        <div class="chat-details">
						        <img src="/styles/img/avatar-ai.jpg" alt="">
						        <div class="msg"></div>
					        </div>
					        <span id="copy-btn" class="material-symbols-rounded">content_copy</span>
				        </div>`;
    const incomingChatDiv = createMessageBox(html, 'incoming');
    incomingChatDiv.querySelector('.msg').innerHTML = rendered
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    console.log(rendered)
}

sendButton.addEventListener('click', handleOutgoingChat);

chatInput.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

const copyMessage = (button) => {
    let text = button.closest('.chat-content').querySelector('.msg').textContent;
    navigator.clipboard.writeText(text);
    button.textContent = 'done';
    setTimeout(() => button.textContent = 'content_copy', 1000)
}

chatContainer.addEventListener('click', (event) => {
    if (event.target.id === 'copy-btn') copyMessage(event.target);
})
