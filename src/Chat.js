import React, { useState, useEffect, useRef } from 'react';
import InternalUseBanner from './InternalUseBanner';
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
  const [awaitingLabSelection, setAwaitingLabSelection] = useState(false);
  const messagesEndRef = useRef(null);

  // Practice/Department ID Instructions
  const practiceIdInstructions = `
To help your customer find their <strong>Practice ID</strong> in Athena, please guide them through these steps:<br /><br />
1. Ask your customer to log in to Athena.<br />
2. Instruct them to look at the upper right-hand corner of their Athena screen and locate their username.<br />
3. Have them click on their username. A box will appear.<br />
4. In this box, your customer will see the name of their practice, and a number in parenthesis to the right of it.<br />
5. <strong>That number is their Practice ID.</strong><br /><br />
You may reference the screenshot below (for your internal use only):<br /><br />
<a href="/practice.png" target="_blank" rel="noopener">
  <img src="/practice.png" alt="Practice ID screenshot" style="max-width:100%; border-radius:12px; box-shadow:0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/practice.png" target="_blank" rel="noopener">Practice ID screenshot</a>
</span>
`;

  const departmentIdInstructions = `
To find your <strong>Department ID</strong> in Athena:<br /><br />
1. Click the gear icon ⚙️ in the top menu bar.<br />
2. Select <strong>Departments</strong> from the configuration menu.<br />
3. You will see a list of departments, each with its Department ID in the left column.<br /><br />
Would you like a screenshot example? (Type Yes or No)
`;

  // Example image paths, update if you have actual screenshots
  const departmentIdScreenshot = `
<a href="/departmentid.png" target="_blank" rel="noopener">
  <img src="/departmentid.png" alt="Department ID screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/departmentid.png" target="_blank" rel="noopener">Department ID screenshot</a>
</span>
`;

  // --- Order Set Steps (summarized for clarity, expand as needed) ---
  const orderSetSteps = [
    `At the top of the screen, you'll see a purple menu bar. On the far right side of this menu bar, there's a gear icon ⚙️. Please click on the gear icon to open the configuration menu and click on Order Sets.`,
    `When you see the Manage My Order Sets screen, type OK or Yes to proceed to the next step. (If you don't see this, type "I don't see it" for help.)`,
    `In the middle of the page, you'll see a section titled <strong>My Order Sets</strong>. Right below it is a hyperlink labeled <strong>"Add New"</strong>. Please click on it.<br /><br /><img src="/order-add-link.png" alt="add new link" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `This will take you to the page where you can add the order set.<br /><br />Locate the section labeled <strong>Add Order Set</strong>.<br /><br />Right below it, you'll see a field labeled <strong>Order Set Name</strong>. Click into the field next to it and type <strong>Shield</strong> — this is what we will name the order set.<br /><br /><img src="/nameorderset.png" alt="Order Set Name" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `Have you named your order set? (Type Yes, No, or "back" to repeat the previous step.)`,
    `Awesome, now let's set up the order details!  
Go ahead and scroll down the page until you see the section called <strong>Diagnosis and Orders Detail</strong>.<br /><br />
You'll notice a light blue bar, and just underneath it, there's a purple bar with several tabs or boxes for different types of orders.<br /><br />
Find the tab labeled <strong>Lab</strong> and give it a click—that's where we'll add your information.<br /><br />
<a href="/ordersdiagnosis.png" target="_blank" rel="noopener">
  <img src="/ordersdiagnosis.png" alt="Diagnosis and Orders Detail screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/ordersdiagnosis.png" target="_blank" rel="noopener">Diagnosis and Orders Detail screenshot</a>
</span>
`,
    `This is where you set the receiving facility.<br /><br />You will see a search box and to the right of it you will see a hyperlink that says <strong>Select Facility</strong>. Click on that hyperlink.<br /><br />This will bring up a window with a heading <strong>Add a Receiver</strong>. Do you see this?`,
    `Great! Now we're ready for the next part. Are you ready to continue? (Type Yes to proceed.)`
  ];

  const labSelectionStep = `
In the search bar, type <strong>Guardant</strong> — double check your spelling, as it's easy to misspell!<br /><br />
You'll see a list of results. This part is very important:<br />
Please select the location with <strong>505 Penobscot Way</strong> and make sure it has the Athena icon (the green leaf) to the left of it, just like in the example image below.<br /><br />
<a href="/receiver.png" target="_blank" rel="noopener">
  <img src="/receiver.png" alt="Receiver selection screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/receiver.png" target="_blank" rel="noopener">Receiver selection screenshot</a>
</span>
<br /><br />
Were you able to complete this step? (Type Yes or No.)
`;

  const addReceiverLegacy = `
Let's try this:<br /><br />
Switch to <strong>Legacy View</strong> (if available), and try searching for the lab by entering the following zip code: <strong>94304</strong>.<br /><br />
Again, make sure you select the location with the Athena leaf icon to the left of it.<br /><br />
Were you able to complete this step? (Type Yes or No.)
`;

  // Main menu keywords to always listen for
  const mainMenuKeywords = [
    "order set",
    "submit an order",
    "troubleshooting",
    "practice id",
    "department id",
    "home",
    "restart"
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

    // --- GLOBAL KEYWORD JUMP ---
    const matchedMainMenu = mainMenuKeywords.find(keyword =>
      lowerInput.includes(keyword)
    );
    if (matchedMainMenu) {
      setContext(null);
      setStep(0);
      setAwaitingLabSelection(false);

      if (matchedMainMenu === "order set") {
        setContext("orderSet");
        setStep(1);
        botReply = { sender: "bot", text: orderSetSteps[0], isHTML: true };
      } else if (matchedMainMenu === "submit an order") {
        botReply = {
          sender: "bot",
          text: "Submitting an order is not yet implemented. Please specify what you'd like to do next."
        };
      } else if (matchedMainMenu === "troubleshooting") {
        botReply = {
          sender: "bot",
          text: "Troubleshooting steps are not yet implemented. Please specify what you'd like to do next."
        };
      } else if (
        matchedMainMenu === "practice id" ||
        matchedMainMenu === "practiceid"
      ) {
        setContext("practiceIdFlow");
        botReply = { sender: "bot", text: practiceIdInstructions, isHTML: true };
      } else if (
        matchedMainMenu === "department id" ||
        matchedMainMenu === "departmentid"
      ) {
        setContext("departmentIdFlow");
        botReply = { sender: "bot", text: departmentIdInstructions, isHTML: true };
      } else if (matchedMainMenu === "home" || matchedMainMenu === "restart") {
        botReply = {
          sender: "bot",
          text: `<strong>Welcome to the Shield Assistant for Athena!</strong><br /><br />
I can help you with the following:<br /><br />
• Setting up an order set<br />
• Submitting an order<br />
• Troubleshooting<br />
• Finding the practice or department ID<br /><br />
Just type one of the options to get started.`,
          isHTML: true,
        };
      }

      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Practice/Department ID flows
    if (context === "practiceIdFlow") {
      botReply = { sender: "bot", text: "Let me know if you need anything else!" };
      setContext(null);
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }
    if (context === "departmentIdFlow") {
      if (lowerInput === "yes") {
        botReply = { sender: "bot", text: departmentIdScreenshot, isHTML: true };
        setContext(null);
      } else if (lowerInput === "no") {
        botReply = { sender: "bot", text: "Let me know if you need anything else!" };
        setContext(null);
      } else {
        botReply = { sender: "bot", text: "Would you like a screenshot example? (Type Yes or No)" };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }
    if (context === "idClarify") {
      if (lowerInput.includes("practice")) {
        botReply = { sender: "bot", text: practiceIdInstructions, isHTML: true };
        setContext("practiceIdFlow");
      } else if (lowerInput.includes("department")) {
        botReply = { sender: "bot", text: departmentIdInstructions, isHTML: true };
        setContext("departmentIdFlow");
      } else {
        botReply = { sender: "bot", text: "Please specify if you are looking for the Practice ID or Department ID." };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Detect user intent for new queries
    if (
      lowerInput.includes("practice id")
      || lowerInput.includes("practiceid")
      || (lowerInput.includes("practice") && lowerInput.includes("id"))
    ) {
      botReply = { sender: "bot", text: practiceIdInstructions, isHTML: true };
      setContext("practiceIdFlow");
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (
      lowerInput.includes("department id")
      || lowerInput.includes("departmentid")
      || (lowerInput.includes("department") && lowerInput.includes("id"))
    ) {
      botReply = { sender: "bot", text: departmentIdInstructions, isHTML: true };
      setContext("departmentIdFlow");
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (
      (lowerInput.includes("id") && !lowerInput.includes("practice") && !lowerInput.includes("department"))
    ) {
      botReply = { sender: "bot", text: "Do you need your Practice ID or Department ID? Please specify." };
      setContext("idClarify");
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // --- Lab selection flow ---
    if (awaitingLabSelection) {
      if (lowerInput.includes("yes")) {
        botReply = {
          sender: "bot",
          text: `Fantastic! You've selected the correct location. You're all set for this part of the process! If you need help with the next steps or another topic, just let me know.`,
        };
        setAwaitingLabSelection(false);
        setContext(null);
      } else if (lowerInput.includes("no")) {
        // Show legacy instructions & switch to legacy context
        botReply = {
          sender: "bot",
          text: addReceiverLegacy,
          isHTML: true
        };
        setAwaitingLabSelection(false);
        setContext("orderSetAddReceiverLegacy");
      } else {
        botReply = {
          sender: "bot",
          text: `Let me know if you were able to find and select the correct lab location, or if you need more help.`
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // --- Add Receiver step logic ---
    if (context === "orderSet" && step === 6) {
      if (lowerInput.includes("yes")) {
        setStep(step + 1);
        botReply = { sender: "bot", text: orderSetSteps[step + 1], isHTML: true };
      } else if (lowerInput.includes("no")) {
        // Immediately show legacy instructions, no intermediate message
        botReply = { sender: "bot", text: addReceiverLegacy, isHTML: true };
        setContext("orderSetAddReceiverLegacy");
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (context === "orderSetAddReceiverLegacy") {
      if (lowerInput.includes("yes")) {
        setContext("orderSet");
        setStep(7);
        botReply = { sender: "bot", text: orderSetSteps[7], isHTML: true };
      } else if (lowerInput.includes("no")) {
        botReply = { sender: "bot", text: "If you're still having trouble, please let support know or try refreshing your browser. Would you like to try again or start over?" };
      } else {
        botReply = { sender: "bot", text: "Were you able to complete the step using legacy view? (Type Yes or No.)" };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // --- Main navigation ---
    if (!context) {
      if (lowerInput.includes("order set")) {
        setContext("orderSet");
        setStep(1);
        botReply = { sender: "bot", text: orderSetSteps[0], isHTML: true };
      } else {
        botReply = {
          sender: "bot",
          text: "I'm sorry, I didn’t catch that. Please type one of the following: order set, submit an order, troubleshooting, practice ID, or department ID.",
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (context === "orderSet") {
      // Insert new branching after the "Are you ready to continue?" prompt
      if (step === orderSetSteps.length - 1 && (lowerInput.includes("yes") || lowerInput.includes("ok"))) {
        // User is ready to proceed after the "Are you ready?" step
        botReply = {
          sender: "bot",
          text: labSelectionStep,
          isHTML: true,
        };
        setAwaitingLabSelection(true);
      } else if (lowerInput === "restart" || lowerInput === "start over") {
        setStep(0);
        botReply = { sender: "bot", text: orderSetSteps[0], isHTML: true };
      } else if (lowerInput === "back" && step > 0) {
        setStep(step - 1);
        botReply = { sender: "bot", text: orderSetSteps[step - 1], isHTML: true };
      } else if (lowerInput.includes("i don't see") || lowerInput.includes("not visible")) {
        botReply = {
          sender: "bot",
          text: `If you don't see the screen, make sure you're in the correct section. Try refreshing the page or check that you have the right permissions. Would you like to start over? (Type "restart" to begin again.)`
        };
      } else if (lowerInput.includes("yes") || lowerInput.includes("ok")) {
        const nextStep = step + 1;
        if (nextStep < orderSetSteps.length) {
          setStep(nextStep);
          botReply = { sender: "bot", text: orderSetSteps[nextStep], isHTML: true };
        } else {
          botReply = {
            sender: "bot",
            text: `That's all for the order set setup! Let me know if you want to restart or need help with another topic.`
          };
          setContext(null); // Reset for other topics
        }
      } else if (lowerInput.includes("no")) {
        botReply = {
          sender: "bot",
          text: `No worries! Would you like me to repeat the last step or start over? (Type "back" or "restart".)`
        };
      } else {
        botReply = {
          sender: "bot",
          text: `Let me know when you're ready to continue, or type "back", "restart", or "I don't see it" for help.`
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Catch-all fallback
    botReply = {
      sender: "bot",
      text: "I'm sorry, I didn’t catch that. Please type one of the following: order set, submit an order, troubleshooting, practice ID, or department ID.",
    };
    setMessages([...newMessages, botReply]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-outer-container">
      <InternalUseBanner />
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
    </div>
  );
}

export default Chat;