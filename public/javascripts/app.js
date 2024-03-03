// Define namespace for app code
var myApp = myApp || {};

// Define app module
myApp.app = (function() {

  // Private variables and functions
  let apiModalButton = document.querySelector('a[name=api-modal-button]');

  // Initialize app
  function init() {
    checkApiKey();
    createConversation();
  }

  // Returns api key from local storage
  function getApiKey() {
    let apiKey = localStorage.getItem('myApiKey');
    return apiKey;
  }

  // Checks if api key matches pattern
  function validateApiKey(str) {
    let regex = /^sk-[a-zA-Z0-9]{48}$/;
    return regex.test(str);
  }

  // Checks if API key is saved in local storage. If true, updates
  // html content of api modal button. If false, disables chat input
  function checkApiKey() {
    let apiKey = getApiKey();
    let isKeyValid = validateApiKey(apiKey);
    (!apiKey || !isKeyValid)
      ? toggleChatInput()
      : apiModalButton.innerHTML = "<img style=\"width: 25px;\" src=\"images/checkmark.svg\" alt=\"Checkmark Icon\">API key found";
  }

  // Retrieves conversations from local storage
  // If no conversations are present, returns empty array
  function getConversations() {
    let conversations = JSON.parse(localStorage.getItem('myConversations')) || [];
    return conversations;
  }

  // Updates local storage item "myConversations"
  // Needs one parameter - array - which is an array of conversations
  function setConversations(array) {
    localStorage.setItem('myConversations', JSON.stringify(array));
  }

  // Generates a random identifier for conversation objects
  function generateRandomId() {
    const timestamp = Date.now().toString(36);
    const randomNumber = Math.random().toString(36).slice(2, 7);
    return `${timestamp}-${randomNumber}`;
  }

  // Deletes a conversation when given an ID
  function deleteConversation(id) {
    let conversations = getConversations();
    let newArray = conversations.filter((obj) => obj.id !== id);
    setConversations(newArray);
    window.location.reload();
  }

  // Given an array and an id, this function retrieves the desired
  // object from the array and moves it to the end of the array.
  // Returns the new array as well as the desired object.
  function moveObjectToLast(array, id) {
    if (array[array.length-1].messages.length === 0) array.pop();
    
    let conversation;
    const newArray = array.filter((obj) => {
      if (obj.id === id) {
        conversation = obj;
        return false;
      };
      return true;
    });
    newArray.push(conversation);
    return { newArray, conversation };
  }

  // Either enables or disables chat input based on a couple of conditions
  function toggleChatInput() {
    let inputContainer = document.querySelector('.chat__input__container');
    let currentStatus = inputContainer.children[0].getAttribute('disabled');
    inputContainer.style.backgroundColor = currentStatus ? '#fff' : '#e7e7e7';
    inputContainer.style.cursor = currentStatus ? 'default' : 'not-allowed';
    currentStatus
      ? inputContainer.children[0].removeAttribute('disabled')
      : inputContainer.children[0].setAttribute('disabled', true);
    inputContainer.children[0].style.cursor = currentStatus ? 'text' : 'not-allowed';
    inputContainer.children[1].style.display = currentStatus ? '' : 'none';
    inputContainer.children[0].focus();
  }

  // Event listener function for conversation buttons in sidenav
  function conversationButtonEventListener(e) {
    let id = e.target.getAttribute('data-id');
    let rect = e.target.getBoundingClientRect();
    if (e.clientX > rect.right-30 && e.clientX < rect.right) {
      let finalConfirmation = confirm("Are you sure you want to delete this conversation?");
      if (finalConfirmation) deleteConversation(id);
    } else {
      loadConversation(id);
    };
  }

  // Appends conversation to side nav
  function appendConversationToSideNav(id) {
    let sidenav = document.querySelector('.sidenav');
    let conversationElement = document.createElement('a');

    conversationElement.className = "sidenav__link";
    conversationElement.setAttribute('name', 'conversation-button');
    conversationElement.setAttribute('data-id', id);
    conversationElement.innerText = id;
    sidenav.insertBefore(conversationElement, apiModalButton);

    conversationElement.addEventListener('click', conversationButtonEventListener);
  }

  // Creates a new conversation only if the conversation list is empty
  // or if the last conversation contains messages. If the last conversation
  // does not contain any messages, it will return that conversation instead
  function createConversation() {
    let id = generateRandomId();
    let conversation = { id, messages: [] };
    let conversations = loadConversations();
    let lastConversation = conversations[conversations.length - 1] || null;

    if (!lastConversation || lastConversation.messages.length > 0) {
      conversations.push(conversation);
      setConversations(conversations);
    } else {
      conversation = lastConversation;
    };
    return conversation;
  }

  // Load and populate a conversation in the chat content area
  function loadConversation(id) {
    let conversations = getConversations();
    let { newArray, conversation } = moveObjectToLast(conversations, id);
    setConversations(newArray);

    myApp.chat.updateChatContent(true);

    for (let i = 0; i < conversation.messages.length; i++) {
      let message = conversation.messages[i];
      (message.role === 'user')
        ? myApp.chat.createAndAppendMessageElement(message.content, 'user__message')
        : myApp.chat.createAndAppendMessageElement(message.content, 'bot__message');
    };
  }

  // Load all conversations from local storage and displays them in the side nav
  function loadConversations() {
    let conversations = getConversations();
    if (conversations.length <= 0) setConversations([]);
    for (let i = 0; i < conversations.length; i++) {
      if (conversations[i].messages.length === 0) continue;
      appendConversationToSideNav(conversations[i].id);
    };
    return conversations;
  }

  // Public API
  return {
    init,
    getApiKey,
    validateApiKey,
    toggleChatInput,
    getConversations,
    setConversations,
    appendConversationToSideNav
  }
})();

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', function() {
  myApp.app.init();
  myApp.ui.bindEvents();
});