import React, { useState, useEffect, useRef } from 'react';
import InternalUseBanner from './InternalUseBanner';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      isHTML: true,
      text: `
<strong>Welcome to the Shield Assistant for Athena!</strong><br><br>
I can help you with the following:<br>
• <strong>Setting up an order set</strong><br>
• <strong>Submitting an order</strong><br>
• <strong>Troubleshooting</strong><br>
• <strong>Finding the practice or department ID</strong><br>
• <strong>Athena Tipsheet</strong><br><br>
Just type one of the options to get started.
      `
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
<div>
  <strong>How to find the Practice ID:</strong><br><br>
  1. Ask your customer to log in to Athena.<br>
  2. Instruct them to look at the upper right-hand corner of their Athena screen and locate their username.<br>
  3. Have them click on their username. A box will appear.<br>
  4. In this box, your customer will see the name of their practice, and a number in parenthesis to the right of it.<br>
  5. <strong>That number is their Practice ID.</strong><br><br>
  <img src="/practice.png" alt="Practice ID screenshot" style="max-width:100%; border-radius:12px; box-shadow:0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/practice.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Practice ID screenshot</a>
</div>
`;

  const departmentIdInstructions = `
<div>
  <strong>How to find the Department ID:</strong><br><br>
  1. Click the gear icon (<strong>⚙️</strong>) in the top menu bar.<br>
  2. Select <strong>Departments</strong> from the configuration menu.<br>
  3. You will see a list of departments, each with its Department ID in the left column.<br><br>
  Would you like a screenshot example? (Type <strong>Yes</strong> or <strong>No</strong>)
</div>
`;

  const departmentIdScreenshot = `
<div>
  <img src="/departmentid.png" alt="Department ID screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/departmentid.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Department ID screenshot</a>
</div>
`;

  const finalStepInstruction = `
<div>
  Right below the specimen collection, you will see a section called <strong>"Questions from Receiving Facility"</strong> and right below it is <strong>"Additional Information"</strong>.<br><br>
  Have the user click in the box and select <strong>Medical Professional Consent</strong>.<br><br>
  Verify their screen is similar to the screenshot below. If it looks good, have your customer click the <strong>Add</strong> button.<br><br>
  <img src="/final.png" alt="Final step screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/final.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Final step screenshot</a>
</div>
`;

  const legacyViewStep = `
<div>
  <strong>Troubleshooting: Legacy View</strong><br><br>
  Switch to <strong>Legacy View</strong> (if available), and try searching for the lab by entering the following zip code: <strong>94304</strong>.<br><br>
  Make sure you select the location with the Athena leaf icon to the left of it.<br><br>
  Were you able to complete this step? (Type <strong>Yes</strong> or <strong>No</strong>.)
</div>
`;

  const PHLEBOTOMIST_BRANCH_STEP = 8;
  const RECEIVER_SELECTION_STEP = 7;

  const orderSetSteps = [
    `
<div>
  At the top of the screen, you'll see a purple menu bar. On the far right side of this menu bar, there's a gear icon (<strong>⚙️</strong>).<br>
  Please click on the gear icon to open the configuration menu and click on <strong>Order Sets</strong>.
</div>
    `,
    `
<div>
  When you see the Manage My Order Sets screen, type <strong>OK</strong> or <strong>Yes</strong> to proceed to the next step.<br>
  <span style="color:#666;">(If you don't see this, type "I don't see it" for help.)</span>
</div>
    `,
    `
<div>
  In the middle of the page, you'll see a section titled <strong>My Order Sets</strong>.<br>
  Right below it is a hyperlink labeled <strong>"Add New"</strong>.<br>
  Please click on it.<br><br>
  <img src="/order-add-link.png" alt="Add New Order Set" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/order-add-link.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Add New link screenshot</a>
</div>
    `,
    `
<div>
  This will take you to the page where you can add the order set.<br><br>
  Locate the section labeled <strong>Add Order Set</strong>.<br>
  Right below it, you'll see a field labeled <strong>Order Set Name</strong>.<br>
  Click into the field next to it and type <strong>Shield</strong> — this is what we will name the order set.<br><br>
  <img src="/nameorderset.png" alt="Order Set Name" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/nameorderset.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Order Set Name screenshot</a>
</div>
    `,
    `
<div>
  Once you have named your order set, reply with <strong>ok</strong> to continue.
</div>
    `,
    `
<div>
  <strong>Next step:</strong> Let's set up the order details.<br><br>
  Scroll down the page until you see the section called <strong>Diagnosis and Orders Detail</strong>.<br>
  You'll notice a light blue bar, and just underneath it, there's a purple bar with several tabs or boxes for different types of orders.<br>
  Find the tab labeled <strong>Lab</strong> and give it a click — that's where we'll add your information.<br><br>
  <img src="/ordersdiagnosis.png" alt="Diagnosis and Orders Detail screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/ordersdiagnosis.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Diagnosis and Orders Detail screenshot</a>
</div>
    `,
    `
<div>
  This is where you set the receiving facility.<br>
  You will see a search box and to the right of it a hyperlink that says <strong>Select Facility</strong>.<br>
  Click on that hyperlink.<br><br>
  This will bring up a window with a heading <strong>Add a Receiver</strong>.<br>
  Do you see this?
</div>
    `,
    `
<div>
  In the search bar, type <strong>Guardant</strong> — double check your spelling!<br>
  You'll see a list of results.<br>
  <strong>This part is very important:</strong><br>
  Please select the location with <strong>505 Penobscot Way</strong> and make sure it has the Athena icon (the green leaf) to the left of it, just like in the example image below.<br><br>
  <img src="/receiver.png" alt="Receiver selection screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/receiver.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Receiver selection screenshot</a><br><br>
  Were you able to complete this step? (Type <strong>Yes</strong> or <strong>No</strong>.)
</div>
    `,
    `
<div>
  After clicking both areas, you should see a screen that has the order details and this is where we will fill in the details of the order specific to your customer's practice.<br><br>
  <img src="/orderdetails.png" alt="Order details screenshot" style="max-width:100%; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0,0,0,0.15);" /><br>
  <a href="/orderdetails.png" target="_blank" rel="noopener" style="font-size: 1em; color: #3366cc; text-decoration: underline;">Order details screenshot</a>
</div>
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

  // Consistently scroll to bottom after every message update (fixes scroll bug)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const externalLabActionHTML = `
<div>
  <strong>Action Required:</strong><br><br>
  Please have the user select <strong>External Lab</strong> (located to the right of <strong>Specimen Collection</strong>).<br><br>
  Once this is selected, reply with <strong>ok</strong> to continue.
</div>
`;

  const officeActionHTML = `
<div>
  <strong>Action Required:</strong><br><br>
  Please have the user select <strong>Office</strong> (located to the right of <strong>Specimen Collection</strong>).<br><br>
  Once this is selected, reply with <strong>ok</strong> to continue.
</div>
`;

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
            `<div>Here is the <strong>Order Set Tip Sheet</strong>:<br><a href="/Athena-Order-Set.pdf" target="_blank" rel="noopener" style="font-size:1em;color:#3366cc;text-decoration:underline;">Download Order Set Tip Sheet (PDF)</a></div>`
        };
        setAwaitingTipsheetChoice(false);
      } else if (lowerInput === "2") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text:
            `<div>Here is the <strong>Ordering Tip Sheet</strong>:<br><a href="/Athena-Tip-Sheet-R2.pdf" target="_blank" rel="noopener" style="font-size:1em;color:#3366cc;text-decoration:underline;">Download Ordering Tip Sheet (PDF)</a></div>`
        };
        setAwaitingTipsheetChoice(false);
      } else {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `
<div>
  <strong>Please select a tip sheet:</strong><br><br>
  <ol style="padding-left: 18px; margin: 0;">
    <li><strong>Order Set Tip Sheet</strong></li>
    <li><strong>Ordering Tip Sheet</strong></li>
  </ol>
  <br>
  <em>Reply with <strong>1</strong> or <strong>2</strong> to select.</em>
</div>
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
        botReply = { sender: "bot", isHTML: true, text: orderSetSteps[0] };
      } else if (matchedMainMenu === "submit an order") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: "<div>Submitting an order is not yet implemented. Please specify what you'd like to do next.</div>"
        };
      } else if (matchedMainMenu === "troubleshooting") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: "<div>Troubleshooting steps are not yet implemented. Please specify what you'd like to do next.</div>"
        };
      } else if (
        matchedMainMenu === "practice id" ||
        matchedMainMenu === "practiceid"
      ) {
        setContext("practiceIdFlow");
        botReply = { sender: "bot", isHTML: true, text: practiceIdInstructions };
      } else if (
        matchedMainMenu === "department id" ||
        matchedMainMenu === "departmentid"
      ) {
        setContext("departmentIdFlow");
        botReply = { sender: "bot", isHTML: true, text: departmentIdInstructions };
      } else if (
        matchedMainMenu === "athena tipsheet" ||
        matchedMainMenu === "tipsheet"
      ) {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `
<div>
  <strong>Please select a tip sheet:</strong><br><br>
  <ol style="padding-left: 18px; margin: 0;">
    <li><strong>Order Set Tip Sheet</strong></li>
    <li><strong>Ordering Tip Sheet</strong></li>
  </ol>
  <br>
  <em>Reply with <strong>1</strong> or <strong>2</strong> to select.</em>
</div>
`
        };
        setAwaitingTipsheetChoice(true);
      } else if (matchedMainMenu === "home" || matchedMainMenu === "restart") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `
<strong>Welcome to the Shield Assistant for Athena!</strong><br><br>
I can help you with the following:<br>
• <strong>Setting up an order set</strong><br>
• <strong>Submitting an order</strong><br>
• <strong>Troubleshooting</strong><br>
• <strong>Finding the practice or department ID</strong><br>
• <strong>Athena Tipsheet</strong><br><br>
Just type one of the options to get started.
          `
        };
      }

      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    // Practice/Department ID flows
    if (context === "practiceIdFlow") {
      botReply = { sender: "bot", isHTML: true, text: "<div>Let me know if you need anything else!</div>" };
      setContext(null);
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }
    if (context === "departmentIdFlow") {
      if (lowerInput === "yes") {
        botReply = { sender: "bot", isHTML: true, text: departmentIdScreenshot };
        setContext(null);
      } else if (lowerInput === "no") {
        botReply = { sender: "bot", isHTML: true, text: "<div>Let me know if you need anything else!</div>" };
        setContext(null);
      } else {
        botReply = { sender: "bot", isHTML: true, text: "<div>Would you like a screenshot example? (Type <strong>Yes</strong> or <strong>No</strong>)</div>" };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }
    if (context === "idClarify") {
      if (lowerInput.includes("practice")) {
        botReply = { sender: "bot", isHTML: true, text: practiceIdInstructions };
        setContext("practiceIdFlow");
      } else if (lowerInput.includes("department")) {
        botReply = { sender: "bot", isHTML: true, text: departmentIdInstructions };
        setContext("departmentIdFlow");
      } else {
        botReply = { sender: "bot", isHTML: true, text: "<div>Please specify if you are looking for the <strong>Practice ID</strong> or <strong>Department ID</strong>.</div>" };
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
      botReply = { sender: "bot", isHTML: true, text: practiceIdInstructions };
      setContext("practiceIdFlow");
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (
      lowerInput.includes("department id")
      || lowerInput.includes("departmentid")
      || (lowerInput.includes("department") && lowerInput.includes("id"))
    ) {
      botReply = { sender: "bot", isHTML: true, text: departmentIdInstructions };
      setContext("departmentIdFlow");
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    } else if (
      (lowerInput.includes("id") && !lowerInput.includes("practice") && !lowerInput.includes("department"))
    ) {
      botReply = { sender: "bot", isHTML: true, text: "<div>Do you need your <strong>Practice ID</strong> or <strong>Department ID</strong>? Please specify.</div>" };
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
        botReply = { sender: "bot", isHTML: true, text: orderSetSteps[PHLEBOTOMIST_BRANCH_STEP] };
      } else if (lowerInput === "no") {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: "<div>If you are still unable to find Guardant, please contact support for further assistance or confirm you are searching in the correct workflow. Would you like to restart the process? (Type '<strong>restart</strong>' to begin again.)</div>"
        };
        setAwaitingLegacyView(false);
      } else {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: "<div>Were you able to complete this step in Legacy View? (Type <strong>Yes</strong> or <strong>No</strong>.)</div>"
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
          isHTML: true,
          text: "<div>Please reply with <strong>ok</strong> when you have selected the specimen collection option.</div>"
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
        isHTML: true,
        text: "<div><strong>Order set setup is complete!</strong><br>Let me know if you need help with placing a test order with your new order set.</div>"
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
          isHTML: true,
          text: "<div>Before we continue, does this practice have an in-office phlebotomist? (Type <strong>Yes</strong> or <strong>No</strong>)</div>"
        };
        setPhlebBranch("awaiting");
        setMessages([...newMessages, botReply]);
        setInput("");
        return;
      } else if (phlebBranch === "awaiting") {
        if (lowerInput === "no") {
          botReply = {
            sender: "bot",
            isHTML: true,
            text: externalLabActionHTML,
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
            isHTML: true,
            text: "<div>Does the phlebotomist have access to Athena? (Type <strong>Yes</strong> or <strong>No</strong>)</div>"
          };
          setPhlebBranch("yes");
          setPhlebAccessBranch("awaiting");
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        } else {
          botReply = {
            sender: "bot",
            isHTML: true,
            text: "<div>Please respond <strong>Yes</strong> or <strong>No</strong>: Does this practice have an in-office phlebotomist?</div>"
          };
          setMessages([...newMessages, botReply]);
          setInput("");
          return;
        }
      } else if (phlebBranch === "yes" && phlebAccessBranch === "awaiting") {
        if (lowerInput === "no") {
          botReply = {
            sender: "bot",
            isHTML: true,
            text: externalLabActionHTML,
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
            isHTML: true,
            text: officeActionHTML
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
            isHTML: true,
            text: "<div>Please respond <strong>Yes</strong> or <strong>No</strong>: Does the phlebotomist have access to Athena?</div>"
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
          botReply = { sender: "bot", isHTML: true, text: orderSetSteps[step + 1] };
        } else if (lowerInput === "no") {
          setAwaitingLegacyView(true);
          botReply = { sender: "bot", isHTML: true, text: legacyViewStep };
        } else {
          botReply = {
            sender: "bot",
            isHTML: true,
            text: `<div>Let me know when you're ready to continue, or type <strong>back</strong>, <strong>restart</strong>, or <strong>I don't see it</strong> for help.</div>`
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
        botReply = { sender: "bot", isHTML: true, text: orderSetSteps[0] };
      } else if (lowerInput === "back" && step > 0) {
        setStep(step - 1);
        setSubStep(null);
        setPhlebBranch(null);
        setPhlebAccessBranch(null);
        setAwaitingLegacyView(false);
        setAwaitingFinalStep(false);
        setAwaitingSpecimenOk(false);
        botReply = { sender: "bot", isHTML: true, text: orderSetSteps[step - 1] };
      } else if (lowerInput.includes("i don't see") || lowerInput.includes("not visible")) {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `<div>If you don't see the screen, make sure you're in the correct section. Try refreshing the page or check that you have the right permissions. Would you like to start over? (Type <strong>restart</strong> to begin again.)</div>`
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
          botReply = { sender: "bot", isHTML: true, text: orderSetSteps[nextStep] };
        } else if (step < orderSetSteps.length - 1) {
          setStep(nextStep);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
          botReply = { sender: "bot", isHTML: true, text: orderSetSteps[nextStep] };
        } else if (step === PHLEBOTOMIST_BRANCH_STEP) {
          setPhlebBranch(null);
          setPhlebAccessBranch(null);
          setAwaitingLegacyView(false);
          setAwaitingFinalStep(false);
          setAwaitingSpecimenOk(false);
          botReply = { sender: "bot", isHTML: true, text: "<div>Let me know if you need more help or want to restart!</div>" };
          setContext(null);
        } else {
          // THIS IS THE MAIN COMPLETION LOCATION!
          botReply = {
            sender: "bot",
            isHTML: true,
            text: "<div><strong>Order set setup is complete!</strong><br>Let me know if you need help with placing a test order with your new order set.</div>"
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
          isHTML: true,
          text: `<div>No worries! Would you like me to repeat the last step or start over? (Type <strong>back</strong> or <strong>restart</strong>.)</div>`
        };
      } else {
        botReply = {
          sender: "bot",
          isHTML: true,
          text: `<div>Let me know when you're ready to continue, or type <strong>back</strong>, <strong>restart</strong>, or <strong>I don't see it</strong> for help.</div>`
        };
      }
      setMessages([...newMessages, botReply]);
      setInput("");
      return;
    }

    botReply = {
      sender: "bot",
      isHTML: true,
      text: "<div>I'm sorry, I didn’t catch that. Please type one of the following: <strong>order set</strong>, <strong>submit an order</strong>, <strong>troubleshooting</strong>, <strong>practice ID</strong>, or <strong>department ID</strong>.</div>",
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
          {/* Always scrolls to this anchor */}
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