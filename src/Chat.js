import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `<strong>Welcome to the Shield Assistant for Athena!</strong><br /><br />
I can help you with the following:<br /><br />
• Setting up an order set<br />
• Submitting an order<br />
• Troubleshooting<br />
• Finding the practice or department ID<br /><br />
Just type one of the options to get started.`,
      isHTML: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState(null);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);

  const orderSetSteps = [
    `At the top of the screen, you'll see a purple menu bar. On the far right side of this menu bar, there's a gear icon ⚙️. Please click on the gear icon to open the configuration menu and click on Order Sets.`,
    `When you see the Manage My Order Sets screen, type OK or Yes to proceed to the next step.`,
    `In the middle of the page, you'll see a section titled <strong>My Order Sets</strong>. Right below it is a hyperlink labeled <strong>"Add New"</strong>. Please click on it.<br /><br /><img src="/order-add-link.png" alt="add new link" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `This will take you to the page where you can add the order set.<br /><br />Locate the section labeled <strong>Add Order Set</strong>.<br /><br />Right below it, you'll see a field labeled <strong>Order Set Name</strong>. Click into the field next to it and type <strong>Shield</strong> — this is what we will name the order set.<br /><br /><img src="/nameorderset.png" alt="Order Set Name" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `Have you named your order set?`,
    `Great! Let's add the diagnosis codes.<br /><br />Scroll further down the page to the section labeled <strong>Diagnosis and Orders Detail</strong>.<br /><br />You’ll see a light blue bar and just below that, a purple bar with several tabs or square boxes for different order types.<br /><br />Look for the tab labeled <strong>Lab</strong> and click on it.<br /><br /><img src="/ordersdiagnosis.png" alt="Diagnosis Tab" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `This is where you set the receiving facility.<br /><br />You will see a search box and to the right of it you will see a hyperlink that says <strong>Select Facility</strong>. Click on that hyperlink.<br /><br />This will bring up a window with a heading <strong>Add a Receiver</strong>. Do you see this?<br /><br /><img src="/nodiagnosis.png" alt="Select Facility" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const images = document.querySelectorAll(".chat-bubble.bot img");
    images.forEach((img) => {
      img.onload = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
    });
  }, [messages]);

  // 🛠️ Fix input scroll on mobile keyboard open
  useEffect(() => {
    const input = document.querySelector('.chat-input input');
    const scrollOnFocus = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    };
    input?.addEventListener("focus", scrollOnFocus);
    return () => {
      input?.removeEventListener("focus", scrollOnFocus);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];

    const lowerInput = input.toLowerCase().trim();
    let botReply = null;

    if (!context) {
      if (lowerInput.includes("order set")) {
        setContext("orderSet");
        setStep(1);
        botReply = { sender: "bot", text: orderSetSteps[0] };
      } else {
        botReply = {
          sender: "bot",
          text: "I'm sorry, I didn’t catch that. Please type one of the following: order set, submit an order, troubleshooting, practice ID, or department ID.",
        };
      }
    } else if (context === "orderSet") {
      if (lowerInput.includes("yes") || lowerInput.includes("ok")) {
        const nextStep = step + 1;
        if (nextStep < orderSetSteps.length) {
          setStep(nextStep);
          botReply = { sender: "bot", text: orderSetSteps[nextStep], isHTML: true };
        } else {
          botReply = {
            sender: "bot",
            text: `That's all for the order set setup! Let me know if you want to restart or need help with another topic.`
          };
        }
      } else {
        botReply = {
          sender: "bot",
          text: `Let me know when you're ready to continue.`
        };
      }
    }

    newMessages.push(botReply);
    setMessages(newMessages);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, i) =>
          msg.isHTML ? (
            <div
              key={i}
              className={`chat-bubble ${msg.sender}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ) : (
            <div key={i} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
