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
    `Let's get started with creating an order set.<br /><br />
At the top of the screen, you'll see a <strong>purple menu bar</strong>. On the far right side of this bar, there is a <strong>gear icon ⚙️</strong>.<br /><br />
Please click on the gear icon to open the configuration menu, then select <strong>Order Sets</strong>.<br /><br />
When you see the <strong>Manage My Order Sets</strong> screen, type <em>OK</em> or <em>Yes</em> to continue.`,

    `In the middle of the page, you'll see a section titled <strong>My Order Sets</strong>.<br /><br />
Right below it is a hyperlink labeled <strong>"Add New"</strong>. Please click on it.<br /><br />
<img src="/Addnew.png" alt="Add New button screenshot" style="max-width:100%; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 10px;" />`,

    `This will take you to the page where you can add the order set.<br /><br />
Locate the section labeled <strong>Add Order Set</strong>.<br /><br />
Right below it, you'll see a field labeled <strong>Order Set Name</strong>.<br />
Click into the field next to it and type <strong>Shield</strong> — this is what we will name the order set.<br /><br />
<img src="/nameorderset.png" alt="Order Set Name screenshot" style="max-width:100%; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 10px;" />`,

    `Have you named your order set?<br /><br />When you're ready, type <em>Yes</em> or <em>OK</em> to continue.`,

    `Great! Let’s add the diagnosis codes.<br /><br />
Scroll further down the page to the section labeled <strong>Diagnosis and Orders Detail</strong>.<br /><br />
You’ll see a <strong>light blue bar</strong> and just below that, a <strong>purple bar</strong> with several tabs or square boxes for different order types.<br /><br />
Look for the tab labeled <strong>Lab</strong> and click on it.<br /><br />
<img src="/ordersdiagnosis.png" alt="Diagnosis and Orders Detail screenshot" style="max-width:100%; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 10px;" />`,

    `This is where you’ll set the <strong>receiving facility</strong>.<br /><br />
You’ll see a <strong>search box</strong>, and to the right of it, a hyperlink that says <strong>Select Facility</strong>.<br /><br />
Click on that hyperlink.<br /><br />
This will bring up a window with the heading <strong>Add a Receiver</strong>.<br /><br />
Do you see this window?`,
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        botReply = { sender: "bot", text: orderSetSteps[0], isHTML: true };
      } else if (lowerInput.includes("practice")) {
        setContext("practiceId");
        botReply = {
          sender: "bot",
          text: `To find the practice ID, click the username in the top-right corner. A box will appear labeled “Practice” with the name and ID.`,
        };
      } else if (lowerInput.includes("department")) {
        setContext("departmentId");
        botReply = {
          sender: "bot",
          text: `In Athena, look for a box at the bottom-right with the department name. Click the caret to view all departments.`,
        };
      } else if (lowerInput.includes("submit")) {
        setContext("submitOrder");
        botReply = {
          sender: "bot",
          text: "To submit an order: open the patient chart > click ‘Encounter’ > choose ‘Order Set’ > select 'Shield' > complete AOE and sign.",
        };
      } else if (lowerInput.includes("troubleshoot")) {
        setContext("troubleshooting");
        botReply = {
          sender: "bot",
          text: "What issue are you experiencing? I can help with login, missing orders, or visibility.",
        };
      } else {
        botReply = {
          sender: "bot",
          text: "Please type one of the following: order set, submit an order, troubleshooting, practice ID, or department ID.",
        };
      }
    } else if (context === "orderSet") {
      if (step >= 1 && step <= 5) {
        if (["yes", "ok"].some(word => lowerInput.includes(word))) {
          const nextStep = step + 1;
          setStep(nextStep);
          botReply = {
            sender: "bot",
            text: orderSetSteps[step],
            isHTML: true,
          };
        } else if (lowerInput.includes("no") && step === 4) {
          botReply = {
            sender: "bot",
            text: `<strong>No problem!</strong><br />Here's what the screen should look like:<br /><br />
            <img src="/No Diagnosis.png" alt="No Diagnosis screen" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
            isHTML: true,
          };
        } else {
          botReply = {
            sender: "bot",
            text: "Please respond with OK or Yes to continue.",
          };
        }
      } else if (step === 6 && ["yes", "ok"].some(word => lowerInput.includes(word))) {
        setContext(null);
        setStep(0);
        botReply = {
          sender: "bot",
          text: "Perfect — you're almost there! Let me know if you'd like help selecting the Shield facility or saving the order set.",
        };
      } else {
        botReply = {
          sender: "bot",
          text: "Thanks! You can ask about submitting an order, practice ID, department ID, or troubleshooting.",
        };
        setContext(null);
        setStep(0);
      }
    } else {
      setContext(null);
      setStep(0);
      botReply = {
        sender: "bot",
        text: `Is there anything else I can help with? Try: order set, submit an order, troubleshooting, practice ID, or department ID.`,
      };
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
