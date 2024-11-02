const startRecordBtn = document.getElementById("start-record-btn");
const translateBtn = document.getElementById("translate-btn");
const speakBtn = document.getElementById("speak-btn");
const transcriptTextarea = document.getElementById("transcript");
const translationTextarea = document.getElementById("translation");
const inputLang = document.getElementById("input-lang");
const outputLang = document.getElementById("output-lang");

let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = inputLang.value;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    transcriptTextarea.value = speechResult;
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
} else {
  alert("Speech Recognition not supported in this browser.");
}

startRecordBtn.addEventListener("click", () => {
  recognition.lang = inputLang.value;
  recognition.start();
});

translateBtn.addEventListener("click", () => {
  const text = transcriptTextarea.value;
  const targetLang = outputLang.value;

  fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text, targetLang: targetLang }),
  })
    .then((response) => response.json())
    .then((data) => {
      const translatedText = data.translations[0].text;
      translationTextarea.value = translatedText;
    })
    .catch((error) => console.error("Translation error:", error));
});

speakBtn.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(translationTextarea.value);
  utterance.lang = outputLang.value;
  speechSynthesis.speak(utterance);
});
