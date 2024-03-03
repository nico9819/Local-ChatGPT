# LocalChatGPT

LocalChatGPT is a web application that utilizes local storage to implement a chat interface powered by OpenAI's GPT-3.5 language model. This application allows users to engage in conversations with the chatbot without the need for a server or external database. All user interactions and chat history are stored locally within the user's web browser.

[Link to YouTube Tutorial](https://www.youtube.com/watch?v=MoUKFLig_Rc)

## Features

- Chat with an AI-powered language model
- Conversations stored locally in the web browser
- No server or external database required
- Simple and intuitive user interface
- Responsive design for various screen sizes

## Installation

To use LocalChatGPT, follow these steps:

1. Clone the repository:

```bash
   git clone https://github.com/moehambouta/LocalChatGPT.git
```
2. Open the project folder.

3. Install the necessary dependencies (ensure you have Node.js installed):

```bash
   npm install
```

4. Start the server:

```bash
   npm start
```

5. Open `http://localhost:3000` in your preferred web browser.

That's it! The LocalChatGPT application is now running with a basic server, ready for chatting.

## Usage

1. Launch the application by navigating to `http://localhost:3000` in your web browser.

2. Launch the API key modal by clicking the modal button located in the side nav.

3. Once your API key is saved, enter your message in the input field at the bottom of the chat window.

4. Press Enter or click the send button to send your message.

5. The chatbot's response will appear in the chat window above.

6. Continue the conversation by sending more messages.

## Customization

You can customize the LocalChatGPT application to fit your needs:

- Modify the CSS styles in `styles.css` to change the visual appearance of the chat interface.

- Customize the behavior or add new features by editing the JavaScript code.

- Adjust the chatbot's language model settings by modifying the relevant code in `chat.js`.
