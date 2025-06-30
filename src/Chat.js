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
• Finding the practice or department ID<br />
• Athena Tipsheet<br /><br />
Just type one of the options to get started.`,
      isHTML: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState(null);
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(null);
  const [phlebBranch, setPhlebBranch] = useState(null);
  const [phlebAccessBranch, setPhlebAccessBranch] = useState(null);
  const [awaitingLegacyView, setAwaitingLegacyView] = useState(false);
  const [awaitingFinalStep, setAwaitingFinalStep] = useState(false);
  const [awaitingSpecimenOk, setAwaitingSpecimenOk] = useState(false);
  const [awaitingTipsheetChoice, setAwaitingTipsheetChoice] = useState(false);
  const messagesEndRef = useRef(null);

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

  const departmentIdScreenshot = `
<a href="/departmentid.png" target="_blank" rel="noopener">
  <img src="/departmentid.png" alt="Department ID screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/departmentid.png" target="_blank" rel="noopener">Department ID screenshot</a>
</span>
`;

  const finalStepInstruction = `
You are doing great so far, hang in there, we are almost done!<br/><br/>
Right below the specimen collection, you will see a section called <strong>"Questions from Receiving Facility"</strong> and right below it is <strong>"Additional Information"</strong>.<br/><br/>
Have the user click in the box and select <strong>Medical Professional Consent</strong>.<br/><br/>
Verify their screen is similar to the screenshot below. If it looks good, have your customer click the <strong>Add</strong> button.<br/><br/>
<a href="/final.png" target="_blank" rel="noopener">
  <img src="/final.png" alt="Final step screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/final.png" target="_blank" rel="noopener">Final step screenshot</a>
</span>
`;

  const legacyViewStep = `
Let's try this:<br /><br />
Switch to <strong>Legacy View</strong> (if available), and try searching for the lab by entering the following zip code: <strong>94304</strong>.<br /><br />
Again, make sure you select the location with the Athena leaf icon to the left of it.<br /><br />
Were you able to complete this step? (Type Yes or No.)
`;

  const PHLEBOTOMIST_BRANCH_STEP = 8;
  const RECEIVER_SELECTION_STEP = 7;

  const orderSetSteps = [
    `At the top of the screen, you'll see a purple menu bar. On the far right side of this menu bar, there's a gear icon ⚙️. Please click on the gear icon to open the configuration menu and click on Order Sets.`,
    `When you see the Manage My Order Sets screen, type OK or Yes to proceed to the next step. (If you don't see this, type "I don't see it" for help.)`,
    `In the middle of the page, you'll see a section titled <strong>My Order Sets</strong>. Right below it is a hyperlink labeled <strong>"Add New"</strong>. Please click on it.<br /><br /><img src="/order-add-link.png" alt="add new link" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `This will take you to the page where you can add the order set.<br /><br />Locate the section labeled <strong>Add Order Set</strong>.<br /><br />Right below it, you'll see a field labeled <strong>Order Set Name</strong>. Click into the field next to it and type <strong>Shield</strong> — this is what we will name the order set.<br /><br /><img src="/nameorderset.png" alt="Order Set Name" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />`,
    `Once you have named your order set reply with ok`,
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
    `
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
`,
    `After clicking both areas you should see a screen that has the order details and this is where we will fill in the details of the order specific to your customer's practice.  Do you see the screen below?
<br /><br />
<a href="/orderdetails.png" target="_blank" rel="noopener">
  <img src="/orderdetails.png" alt="Order details screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" />
</a>
<br />
<span style="display:block;margin-top:4px;font-size:0.95em;color:#555">
  <a href="/orderdetails.png" target="_blank" rel="noopener">Order details screenshot</a>
</span>
`
  ];

  const mainMenuKeywords = [
    "order set",
    "submit an order",
    "troubleshooting",
    "practice id",
    "department id",
    "athena tipsheet",
    "tipsheet",
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

    // Handle awaiting tipsheet choice
    if (awaitingTipsheetChoice) {
      if (lowerInput === "1") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text:
            'Here is the <strong>Order Set Tip Sheet</strong>:<br /><a href="/Athena-Order-Set.pdf" target="_blank" rel="noopener">Download Order Set Tip Sheet (PDF)</a>'
        };
        setAwaitingTipsheetChoice(false);
      } else if (lowerInput === "2") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text:
            'Here is the <strong>Ordering Tip Sheet</strong>:<br /><a href="/Athena-Tip-Sheet-R2.pdf" target="_blank" rel="noopener">Download Ordering Tip Sheet (PDF)</a>'
        };
        setAwaitingTipsheetChoice(false);
      } else {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `
<strong>Please select a tip sheet:</strong><br /><br />
<ol style="padding-left: 18px; margin: 0;">
  <li><strong>Order Set Tip Sheet</strong></li>
  <li><strong>Ordering Tip Sheet</strong></li>
</ol>
<br />
<em>Reply with <strong>1</strong> or <strong>2</strong> to select.</em>
`
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Main menu quick jump
    const matchedMainMenu = mainMenuKeywords.find(keyword =>
      lowerInput.includes(keyword)
    );
    if (matchedMainMenu) {
      setContext(null);
      setStep(0);
      setSubStep(null);
      setPhlebBranch(null);
      setPhlebAccessBranch(null);
      setAwaitingLegacyView(false);
      setAwaitingFinalStep(false);
      setAwaitingSpecimenOk(false);

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
      } else if (
        matchedMainMenu === "athena tipsheet" ||
        matchedMainMenu === "tipsheet"
      ) {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `
<strong>Please select a tip sheet:</strong><br /><br />
<ol style="padding-left: 18px; margin: 0;">
  <li><strong>Order Set Tip Sheet</strong></li>
  <li><strong>Ordering Tip Sheet</strong></li>
</ol>
<br />
<em>Reply with <strong>1</strong> or <strong>2</strong> to select.</em>
`
        };
        setAwaitingTipsheetChoice(true);
      } else if (matchedMainMenu === "home" || matchedMainMenu === "restart") {
        botReply = {
          sender: "bot",
          text: `<strong>Welcome to the Shield Assistant for Athena!</strong><br /><br />
I can help you with the following:<br /><br />
• Setting up an order set<br />
• Submitting an order<br />
• Troubleshooting<br />
• Finding the practice or department ID<br />
• Athena Tipsheet<br /><br />
Just type one of the options to get started.`,
          isHTML: true,
        };
      }

      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // ... rest of your handleSend logic unchanged (IDs, branching, steps, etc.) ...
    // For brevity, not duplicating the rest, but keep as in previous file.

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

    // Detect user intent for Practice/Department ID
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

    // Legacy View fallback after receiver selection step
    if (context === "orderSet" && awaitingLegacyView) {
      if (lowerInput === "yes") {
        setAwaitingLegacyView(false);
        setStep(RECEIVER_SELECTION_STEP + 1);
        botReply = { sender: "bot", text: orderSetSteps[PHLEBOTOMIST_BRANCH_STEP], isHTML: true };
      } else if (lowerInput === "no") {
        botReply = {
          sender: "bot",
          text: "If you are still unable to find Guardant, please contact support for further assistance or confirm you are searching in the correct workflow. Would you like to restart the process? (Type 'restart' to begin again.)"
        };
        setAwaitingLegacyView(false);
      } else {
        botReply = {
          sender: "bot",
          text: "Were you able to complete this step in Legacy View? (Type Yes or No.)"
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Handle waiting for OK after specimen collection
    if (awaitingSpecimenOk) {
      if (lowerInput === "ok" || lowerInput === "okay" || lowerInput === "yes") {
        setAwaitingSpecimenOk(false);
        botReply = {
          sender: "bot",
          isHTML: true,
          text: finalStepInstruction
        };
        setAwaitingFinalStep(true);
        setMessages([...newMessages, botReply]);
        setInput("");
        return;
      } else {
        botReply = {
          sender: "bot",
          text: "Please reply with ok when you have selected the specimen collection option."
        };
        setMessages([...newMessages, botReply]);
        setInput("");
        return;
      }
    }

    // Handle final step after specimen collection
    if (awaitingFinalStep) {
      setAwaitingFinalStep(false);
      botReply = {
        sender: "bot",
        text: "Order set setup is complete! Let me know if you want to restart or need help with another topic."
      };
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Phlebotomist and Athena access branching logic
    if (context === "orderSet" && step === PHLEBOTOMIST_BRANCH_STEP) {
      if (!phlebBranch) {
        botReply = {
          sender: "bot",
          text: "Before we continue I would like to gather some information in order to help make the appropriate selections. Does this practice have an in office phlebotomist? (Type Yes or No)",
        };
        setPhlebBranch("awaiting");
        setMessages([...newMessages, botReply]);
        setInput("");
        return;
      } else if (phlebBranch === "awaiting") {
        if (lowerInput === "no") {
          botReply = {
            sender: "bot",
            text: 'Great, have the user select "External Lab" to the right of specimen collection and reply with ok when you have done this.',
          };
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingSpecimenOk(true);
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        } else if (lowerInput === "yes") {
          botReply = {
            sender: "bot",
            text: "Does the phlebotomist have access to Athena? (Type Yes or No)",
          };
          setPhlebBranch("yes");
          setPhlebAccessBranch("awaiting");
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        } else {
          botReply = {
            sender: "bot",
            text: "Please respond Yes or No: Does this practice have an in office phlebotomist?",
          };
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        }
      } else if (phlebBranch === "yes" && phlebAccessBranch === "awaiting") {
        if (lowerInput === "no") {
          botReply = {
            sender: "bot",
            text: 'Great, have the user select "External Lab" to the right of specimen collection and reply with ok when you have done this.',
          };
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingSpecimenOk(true);
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        } else if (lowerInput === "yes") {
          botReply = {
            sender: "bot",
            text: 'Great, have the user select Office to the right of specimen collection and reply with ok when you have done this.',
          };
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingSpecimenOk(true);
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        } else {
          botReply = {
            sender: "bot",
            text: "Please respond Yes or No: Does the phlebotomist have access to Athena?",
          };
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        }
      }
    }

    // Main navigation (order set steps)
    if (context === "orderSet") {
      // Receiver selection step: handle "No" for Legacy View
      if (step === RECEIVER_SELECTION_STEP) {
        if (lowerInput === "yes" || lowerInput === "ok") {
          setStep(step + 1);
          botReply = { sender: "bot", text: orderSetSteps[step + 1], isHTML: true };
        } else if (lowerInput === "no") {
          setAwaitingLegacyView(true);
          botReply = { sender: "bot", text: legacyViewStep, isHTML: true };
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

      if (lowerInput === "restart" || lowerInput === "start over") {
        setStep(0);
        setSubStep(null);
        setPhlebBranch(null);
        setPhlebAccessBranch(null);
        setAwaitingLegacyView(false);
        setAwaitingFinalStep(false);
        setAwaitingSpecimenOk(false);
        botReply = { sender: "bot", text: orderSetSteps[0], isHTML: true };
      } else if (lowerInput === "back" && step > 0) {
        setStep(step - 1);
        setSubStep(null);
        setPhlebBranch(null);
        setPhlebAccessBranch(null);
        setAwaitingLegacyView(false);
        setAwaitingFinalStep(false);
        setAwaitingSpecimenOk(false);
        botReply = { sender: "bot", text: orderSetSteps[step - 1], isHTML: true };
      } else if (lowerInput.includes("i don't see") || lowerInput.includes("not visible")) {
        botReply = {
          sender: "bot",
          text: `If you don't see the screen, make sure you're in the correct section. Try refreshing the page or check that you have the right permissions. Would you like to start over? (Type "restart" to begin again.)`
        };
      } else if (lowerInput.includes("yes") || lowerInput.includes("ok")) {
        const nextStep = step + 1;
        if (nextStep === PHLEBOTOMIST_BRANCH_STEP) {
          setStep(nextStep);
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
          botReply = { sender: "bot", text: orderSetSteps[nextStep], isHTML: true };
        } else if (step < orderSetSteps.length - 1) {
          setStep(nextStep);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
          botReply = { sender: "bot", text: orderSetSteps[nextStep], isHTML: true };
        } else if (step === PHLEBOTOMIST_BRANCH_STEP) {
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
          botReply = { sender: "bot", text: "Let me know if you need more help or want to restart!" };
          setContext(null);
        } else {
          botReply = {
            sender: "bot",
            text: `That's all for the order set setup! Let me know if you want to restart or need help with another topic.`
          };
          setContext(null);
          setSubStep(null);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
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