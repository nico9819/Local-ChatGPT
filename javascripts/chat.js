// Define namespace for app code
var myApp = myApp || {};

// Define chat module
myApp.chat = (function() {

    // Private variables and functions
    var textarea = document.querySelector('.chat__input');

    // Get the last conversation in our conversation array
    const getCurrentConversation = () => {
        let conversations = myApp.app.getConversations();
        let lastConversation = conversations[conversations.length - 1];
        return lastConversation;
    };

    // Update the last conversation in our conversation array with the updated content
    const updateConversation = (newConversation) => {
        let conversations = myApp.app.getConversations();
        conversations[conversations.length - 1] = newConversation;
        myApp.app.setConversations(conversations);
    };

    // Check if chat content is empty and adjust accordingly
    const updateChatContent = (forceRemove=false) => {
        var chat = document.querySelector('.chat');

        if (chat.children[0].tagName === "SECTION" || forceRemove) {
            chat.removeChild(chat.children[0]);
            let newChatContentElement = document.createElement('div');
            newChatContentElement.className = 'chat__content';
            chat.prepend(newChatContentElement);
        };
    };

    // Create and append message element
    const createAndAppendMessageElement = (str, classType) => {
        let loadingAnimation = document.createElement('div');
        loadingAnimation.classList.add('lds-facebook');
        loadingAnimation.innerHTML = `<div></div><div></div><div></div>`;

        let chatContent = document.querySelector('.chat__content');
        let parent = document.createElement('div');
        parent.className = `${classType}__container`;
        let child = document.createElement('div');
        child.className = classType;
        child.innerText = str;
        parent.appendChild(child);
        chatContent.appendChild(parent);

        (classType === 'user__message')
            ? chatContent.appendChild(loadingAnimation)
            : chatContent.removeChild(document.querySelector('.lds-facebook'));

        setTimeout(() => {
            chatContent.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
        }, 50);
    };

    // Fetch response from OpenAI API
    const fetchResponse = async (apiKey, messages) => {
        var headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };
        var body = {
            "model": "gpt-3.5-turbo",
            "messages": messages
        };
        const options = {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        };

        let response = await fetch('https://api.openai.com/v1/chat/completions', options);
        let jsonData = await response.json();
        if (response.status !== 200) {
            if ('error' in jsonData) {
                if (jsonData.error.message.length > 0) {
                    throw new Error(jsonData.error.message);
                } else {
                    throw new Error(jsonData.error.code);
                };
            } else {
                throw new Error(`server responded with status code ${response.status}`);
            };
        };
        let botMessage = jsonData.choices[0].message;
        return botMessage;
    };

    // Fetch response from OpenAI API and update the conversation
    const submitChatForm = async (e) => {
        e.preventDefault();
        let botMessage;
        let userMessage = textarea.value;
        let apiKey = myApp.app.getApiKey();

        if (!userMessage) return;

        textarea.style.height = '28px';
        textarea.value = "";

        updateChatContent();
        myApp.app.toggleChatInput();
        createAndAppendMessageElement(userMessage, 'user__message');
    
        let currentConversation = getCurrentConversation();
        let newMessages = [...currentConversation.messages, {"role": "user", "content": userMessage}];
        if (currentConversation.messages.length === 0) myApp.app.appendConversationToSideNav(currentConversation.id);

        try {
            botMessage = await fetchResponse(apiKey, newMessages);
        } catch (err) {
            botMessage = {"role": "assistant", "content": `Error encountered: ${err.message}`};
        };

        newMessages = [...newMessages, botMessage];
        currentConversation.messages = newMessages;
        updateConversation(currentConversation);

        createAndAppendMessageElement(botMessage.content, 'bot__message');
        myApp.app.toggleChatInput();
    };

    // Public API
    return {
        submitChatForm,
        updateChatContent,
        createAndAppendMessageElement
    };
})();