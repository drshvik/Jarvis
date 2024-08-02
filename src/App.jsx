import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

const App = () => {
  const [content, setContent] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  useEffect(() => {
    const btn = document.querySelector(".talk");
    const handleButtonClick = () => {
      if (speaking) {
        window.speechSynthesis.cancel();
        setContent("Speech stopped.");
        setSpeaking(false);
      } else {
        setContent("Listening...");
        recognition.start();
      }
    };

    btn.addEventListener("click", handleButtonClick);
    return () => {
      btn.removeEventListener("click", handleButtonClick);
    };
  }, [speaking]);

  recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    setContent(transcript);
    takeCommand(transcript.toLowerCase());
  };

  function speak(text) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    text_speak.onstart = () => setSpeaking(true);
    text_speak.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(text_speak);
  }

  function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
      speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
      speak("Good Afternoon Master...");
    } else {
      speak("Good Evening Sir...");
    }
  }

  useEffect(() => {
    speak("Initializing JARVIS...");
    wishMe();
  }, []);

  function takeCommand(message) {
    if (
      message.includes("hey") ||
      message.includes("hello") ||
      message.includes("Jarvis")
    ) {
      speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
      window.open("https://google.com", "_blank");
      speak("Opening Google...");
    } else if (message.includes("open youtube")) {
      window.open("https://youtube.com", "_blank");
      speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
      window.open("https://facebook.com", "_blank");
      speak("Opening Facebook...");
    } else if (
      message.includes("what is") ||
      message.includes("who is") ||
      message.includes("what are")
    ) {
      window.open(
        `https://www.google.com/search?q=${message.replace(" ", "+")}`,
        "_blank"
      );
      const finalText = `This is what I found on the internet regarding ${message}`;
      speak(finalText);
    } else if (message.includes("wikipedia")) {
      window.open(
        `https://en.wikipedia.org/wiki/${message
          .replace("wikipedia", "")
          .trim()}`,
        "_blank"
      );
      const finalText = `This is what I found on Wikipedia regarding ${message}`;
      speak(finalText);
    } else if (message.includes("time")) {
      const time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      const finalText = `The current time is ${time}`;
      speak(finalText);
    } else if (message.includes("date")) {
      const date = new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
      });
      const finalText = `Today's date is ${date}`;
      speak(finalText);
    } else if (message.includes("weather")) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=4eaf634f7be6d9da9da482eb4c55290c`
      )
        .then((response) => response.json())
        .then((data) => {
          const temp = (data.main.temp - 273.15).toFixed(1);
          const finalText = `The current temperature is ${temp}°C with ${data.weather[0].description}.`;
          speak(finalText);
        })
        .catch((error) =>
          speak("Sorry, I could not fetch the weather information.")
        );
    } else if (message.includes("set a timer for")) {
      const timeInMinutes = parseInt(message.match(/\d+/)[0]);
      setTimeout(() => {
        speak(`Your timer for ${timeInMinutes} minutes is up.`);
      }, timeInMinutes * 60000);
      speak(`Setting a timer for ${timeInMinutes} minutes.`);
    } else if (message.includes("tell me a joke")) {
      fetch("https://official-joke-api.appspot.com/random_joke")
        .then((response) => response.json())
        .then((data) => {
          speak(`${data.setup}... ${data.punchline}`);
        })
        .catch((error) => speak("Sorry, I could not find a joke for you."));
    } else if (message.includes("news")) {
      fetch(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=a93bd2e181344ebc97e003bb14ed3368"
      )
        .then((response) => response.json())
        .then((data) => {
          const articles = data.articles.slice(0, 5);
          articles.forEach((article) => {
            speak(article.title);
          });
        })
        .catch((error) => speak("Sorry, I could not fetch the news for you."));
    } else if (message.includes("calculate")) {
      try {
        const calculation = message.replace("calculate", "").trim();
        const result = eval(calculation);
        speak(`The result is ${result}`);
      } catch (error) {
        speak("Sorry, I could not perform the calculation.");
      }
    } else if (message.includes("motivate me")) {
      fetch("https://api.quotable.io/random")
        .then((response) => response.json())
        .then((data) => {
          speak(data.content);
        })
        .catch((error) =>
          speak("Sorry, I could not find a motivational quote for you.")
        );
    } else if (message.includes("fact of the day")) {
      fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then((response) => response.json())
        .then((data) => {
          speak(data.text);
        })
        .catch((error) =>
          speak("Sorry, I could not find an interesting fact for you.")
        );
    } else if (message.includes("play")) {
      const query = message.replace("play", "").trim();
      searchAndPlayYouTube(query);
    } else if (
      message.includes("cricket score") ||
      message.includes("football score")
    ) {
      fetchSportsScore(message);
    } else {
      window.open(
        `https://www.google.com/search?q=${message.replace(" ", "+")}`,
        "_blank"
      );
      const finalText = `I found some information for ${message} on Google`;
      speak(finalText);
    }
  }

  function searchAndPlayYouTube(query) {
    speak(`Searching and playing ${query} from YouTube.`);
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank"
    );
  }

  function fetchSportsScore(query) {
    speak(`Fetching ${query} scores...`);
    fetch(`https://api.example.com/sports/scores?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.scores) {
          data.scores.forEach((score) => {
            speak(`Match: ${score.match}, Score: ${score.score}`);
          });
        } else {
          speak("Sorry, I couldn't find any scores for that match.");
        }
      })
      .catch((error) =>
        speak("Sorry, I could not fetch the scores at the moment.")
      );
  }

  return (
    <div className="app">
      <section className="content-section">
        <div className="text-container">
          <h1 className="title">J A R V I S</h1>
          <p className="description">
            I'm a Virtual Assistant JARVIS, How may I help you?
          </p>
        </div>
        <div className="controls">
          <button className="talk">
            <i className="fas fa-microphone-alt"></i>
          </button>
          <h1 className="content">{content || "Click here to speak"}</h1>
        </div>
      </section>
    </div>
  );
};

export default App;
