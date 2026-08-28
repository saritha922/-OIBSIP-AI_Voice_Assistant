// ==========================================
// ELEMENTS
// ==========================================

const micButton = document.getElementById("micButton");
const userText = document.getElementById("userText");
const aiText = document.getElementById("aiText");
const status = document.getElementById("status");

const historyButton = document.getElementById("historyButton");
const answerBackButton = document.getElementById("answerBackButton");
const historyBackButton = document.getElementById("historyBackButton");

const mainContent = document.getElementById("mainContent");
const historyContent = document.getElementById("historyContent");
const historyList = document.getElementById("historyList");


// ==========================================
// HIDE BACK BUTTON INITIALLY
// ==========================================

answerBackButton.style.display = "none";


// ==========================================
// SPEECH RECOGNITION
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    status.innerText =
        "❌ Speech recognition is not supported in this browser.";

} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;


    // ==========================================
    // MICROPHONE BUTTON
    // ==========================================

    micButton.addEventListener("click", () => {

        status.innerText = "🎤 Listening... Speak now";

        try {
            recognition.start();
        } catch (error) {
            console.log("Recognition error:", error);
        }

    });


    // ==========================================
    // VOICE RECOGNIZED
    // ==========================================

    recognition.onresult = async (event) => {

        const transcript =
            event.results[0][0].transcript;

        console.log("User said:", transcript);

        userText.innerText = transcript;

        status.innerText = "🤖 Thinking...";


        try {

            // Send question to Flask

            const response = await fetch("/ask", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: transcript
                })

            });


            const data = await response.json();

            console.log("AI response:", data);


            // ==========================================
            // AI ANSWER
            // ==========================================

            if (data.answer) {

                aiText.innerText = data.answer;

                status.innerText =
                    "✅ Answer received";


                // SHOW BACK BUTTON AFTER ANSWER

                answerBackButton.style.display = "block";


                // ==========================================
                // SAVE HISTORY
                // ==========================================

                saveConversation(
                    transcript,
                    data.answer
                );


                // ==========================================
                // TEXT TO SPEECH
                // ==========================================

                const speech =
                    new SpeechSynthesisUtterance(
                        data.answer
                    );

                speech.lang = "en-IN";
                speech.rate = 0.95;
                speech.pitch = 1;

                window.speechSynthesis.cancel();

                window.speechSynthesis.speak(speech);

            } else {

                aiText.innerText =
                    "❌ No answer received.";

                status.innerText =
                    "❌ AI Error";

            }

        } catch (error) {

            console.error("Fetch error:", error);

            status.innerText =
                "❌ Could not connect to AI";

        }

    };


    // ==========================================
    // SPEECH ERROR
    // ==========================================

    recognition.onerror = (event) => {

        console.log(
            "Speech recognition error:",
            event.error
        );

        status.innerText =
            "❌ " + event.error;

    };

}


// ==========================================
// HISTORY
// ==========================================

let conversationHistory =
    JSON.parse(
        localStorage.getItem("aiVoiceHistory")
    ) || [];


// ==========================================
// SAVE CONVERSATION
// ==========================================

function saveConversation(question, answer) {

    conversationHistory.push({

        question: question,
        answer: answer,
        time: new Date().toLocaleString()

    });


    localStorage.setItem(
        "aiVoiceHistory",
        JSON.stringify(conversationHistory)
    );

}


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    if (conversationHistory.length === 0) {

        historyList.innerHTML =
            "📭 No conversations yet.";

        return;

    }


    historyList.innerHTML = "";


    conversationHistory.forEach((item) => {

        const conversation =
            document.createElement("div");


        conversation.style.marginBottom = "20px";


        conversation.innerHTML = `

            <strong>👤 You:</strong>

            <p>${item.question}</p>


            <strong>🤖 AI:</strong>

            <p>${item.answer}</p>


            <small>🕒 ${item.time}</small>

            <hr>

        `;


        historyList.appendChild(conversation);

    });

}


// ==========================================
// OPEN HISTORY
// ==========================================

historyButton.addEventListener("click", () => {

    mainContent.style.display = "none";

    historyContent.style.display = "block";

    displayHistory();

});


// ==========================================
// BACK FROM HISTORY
// ==========================================

historyBackButton.addEventListener("click", () => {

    historyContent.style.display = "none";

    mainContent.style.display = "block";

});


// ==========================================
// BACK AFTER AI ANSWER
// ==========================================

answerBackButton.addEventListener("click", () => {

    // Stop AI voice

    window.speechSynthesis.cancel();


    // Clear question

    userText.innerText =
        "Your question will appear here...";


    // Clear answer

    aiText.innerText =
        "Your AI answer will appear here...";


    // Reset status

    status.innerText =
        "Click the microphone and speak";


    // Hide Back button again

    answerBackButton.style.display = "none";

});