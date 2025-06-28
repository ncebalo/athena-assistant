/* Main chat window */
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100dvh; /* for iOS Safari */
  background: #f3f3f6;
  font-family: 'Segoe UI', Arial, sans-serif;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 0 24px 0 rgba(0,0,0,0.07);
}

/* Messages area */
.chat-messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px 8px 16px 8px;
  display: flex;
  flex-direction: column;
}

/* Chat bubbles */
.chat-bubble {
  max-width: 90%;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 1.1rem;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.chat-bubble.bot {
  align-self: flex-start;
  background: #fff;
  color: #222;
}
.chat-bubble.user {
  align-self: flex-end;
  background: #dcf8c6;
  color: #222;
}

/* Images in bot responses */
.chat-bubble.bot img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  margin-top: 8px;
}

/* Input area */
.chat-input {
  display: flex;
  align-items: center;
  padding: 8px 8px 16px 8px;
  background: #f3f3f6;
  border-top: 1px solid #e0e0e0;
  position: sticky;
  bottom: 0;
}

/* Input box */
.chat-input input[type="text"] {
  flex: 1 1 auto;
  font-size: 1.1rem;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  background: #fff;
  margin-right: 8px;
  transition: border 0.2s;
}
.chat-input input[type="text"]:focus {
  border: 1.5px solid #6e9cff;
}

/* Send button */
.chat-input button {
  flex: 0 0 auto;
  padding: 11px 22px;
  border: none;
  border-radius: 20px;
  background: #6e9cff;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-input button:active {
  background: #4f7cd6;
}

@media (max-width: 600px) {
  .chat-window {
    max-width: 100vw;
    border-radius: 0;
    box-shadow: none;
  }
  .chat-messages {
    padding: 10px 2vw 10px 2vw;
  }
  .chat-bubble {
    font-size: 1rem;
    padding: 10px 13px;
  }
  .chat-input input[type="text"] {
    font-size: 1rem;
    padding: 10px 10px;
  }
  .chat-input button {
    font-size: 1rem;
    padding: 10px 18px;
  }
}