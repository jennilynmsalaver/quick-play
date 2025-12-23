import { useState, useEffect } from "react";
import "./App.css";

const games = [
  { id: "scramble", title: "Scrabble", desc: "Solve word game puzzle" },
  { id: "memory", title: "Memory Cards", desc: "Match the hidden cards" },
  { id: "number", title: "Number Guessing", desc: "Guess the correct number" },
  { id: "whack", title: "Whack A Mole", desc: "Click fast, score higher" },
  { id: "speed", title: "Typing Speed", desc: "Test your typing Speed" },
  { id: "word", title: "Hangman", desc: "Guess a secret word letter by letter" },
];

export default function App() {
  // Toggle Theme
  const [selectedGame, setSelectedGame] = useState(null);
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {setTheme((prev) => (prev === "dark" ? "light" : "dark"));};
  const WORDS = [
  "COURAGE",
  "PERSISTENCE",
  "DREAM",
  "HOPE",
  "RESILIENCE",
  "FAITH",
  "PASSION",
  "FREEDOM",
  "HAPPINESS",
  "GRATITUDE",
  "MOTIVATION",
  "STRENGTH",
  "LEARNING",
  "CONFIDENCE",
  "ADVENTURE",
  "LOVE",
  "SUCCESS",
  "BALANCE",
  "GROWTH",
  "INSPIRE"
];

//cursor
useEffect(() => {
  const dots = document.querySelectorAll(".comet-dot");

  let mouseX = 0;
  let mouseY = 0;

  let positions = Array.from(dots).map(() => ({ x: 0, y: 0 }));

  const move = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  document.addEventListener("mousemove", move);

  const animate = () => {
    if (!dots.length) return;

    positions[0].x += (mouseX - positions[0].x) * 0.25;
    positions[0].y += (mouseY - positions[0].y) * 0.25;

    for (let i = 1; i < positions.length; i++) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * 0.35;
      positions[i].y += (positions[i - 1].y - positions[i].y) * 0.35;
    }

    dots.forEach((dot, i) => {
      dot.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px)`;
    });

    requestAnimationFrame(animate);
  };

  animate();

  return () => {
    document.removeEventListener("mousemove", move);
  };
}, []);


//Scramble
 const SCRAMBLE_WORDS = [
  "PERSEVERANCE",
  "DETERMINATION",
  "RESILIENCE",
  "TRANSFORMATION",
  "MOTIVATION",
  "INSPIRATION",
  "ACHIEVEMENT",
  "SELFCONFIDENCE",
  "AMBITION",
  "DISCIPLINE"
  ];

function WordScrambleGame() {
    const [wordIndex, setWordIndex] = useState(0);
    const [guess, setGuess] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);

    const word = SCRAMBLE_WORDS[wordIndex];
    const scrambled = word.split("").sort(() => Math.random() - 0.5).join("");


const handleSubmit = (e) => {
      e.preventDefault();
      if (guess.toUpperCase() === word) {
        setIsCorrect(true);
        setTimeout(() => {
          setWordIndex((wordIndex + 1) % SCRAMBLE_WORDS.length);
          setGuess("");
          setIsCorrect(false);
        }, 800);
      } else {
        alert("Try again!");
      }
    };


    return (
    

      <div className="word-scramble-game">
        <p>Unscramble the letters: <strong>{scrambled}</strong></p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess"
          />
          <button type="submit">Submit</button>
        </form>

        {isCorrect && <p className="win-text">Correct! Next word…</p>}
      </div>
    );
  }
// Memory Cards Game
function MemoryCards() {
  const CARD_VALUES = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);

  function shuffleCards() {
    const paired = [...CARD_VALUES, ...CARD_VALUES];
    return paired
      .map((v) => ({ value: v, id: Math.random() }))
      .sort(() => Math.random() - 0.5);
  }

  const handleClick = (index) => {
    if (disabled) return;
    if (flipped.includes(index) || matched.includes(cards[index].value)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const first = cards[newFlipped[0]].value;
      const second = cards[newFlipped[1]].value;

      if (first === second) {
        setMatched([...matched, first]);
        resetFlipped();
      } else {
        setTimeout(() => {
          resetFlipped();
        }, 1000);
      }
    }
  };

  const resetFlipped = () => {
    setFlipped([]);
    setDisabled(false);
  };

  // Check for win → auto next round
  useEffect(() => {
    if (matched.length === CARD_VALUES.length) {
      setTimeout(() => {
        const newCards = shuffleCards();
        setCards(newCards);
        setMatched([]);
        setFlipped([]);
        setDisabled(false);
      }, 1500); // 1.5s delay before new round
    }
  }, [matched]);

  return (
    <div className="memory-game">
      <div className="grid">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(i) || matched.includes(card.value) ? "flipped" : ""}`}
            onClick={() => handleClick(i)}
          >
            <div className="front">?</div>
            <div className="back">{card.value}</div>
          </div>
        ))}
      </div>
      {matched.length === CARD_VALUES.length && <h3 className="win-text">🎉 Round Complete! Next round…</h3>}
    </div>
  );
}



// Number Guessing
function NumberGuessing() {
  const [number, setNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  ); // Random 1-100
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Enter a number between 1-100");
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  const handleGuess = () => {
    const g = parseInt(guess);
    if (isNaN(g)) return;

    setAttempts(attempts + 1);

    if (g === number) {
      setMessage(`🎉 Correct! You guessed in ${attempts + 1} tries.`);
      setWon(true);

      // auto next number after 1.5s
      setTimeout(() => {
        const newNumber = Math.floor(Math.random() * 100) + 1;
        setNumber(newNumber);
        setGuess("");
        setMessage("Enter a number between 1-100");
        setAttempts(0);
        setWon(false);
      }, 1500);
    } else if (g < number) {
      setMessage("⬆️ Too low, try again");
    } else {
      setMessage("⬇️ Too high, try again");
    }
    setGuess("");
  };

  return (
    <div className="number-game">
      <p>{message}</p>

      {!won && (
        <div className="guess-input">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Your guess"
          />
          <button onClick={handleGuess}>Guess</button>
        </div>
      )}

      {won && <p className="won-text">🎉 Next number coming...</p>}
    </div>
  );
}





  // Whack-A-Mole Game
function WhackAMole() {
  const [active, setActive] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;

    const moleTimer = setInterval(() => {
      setActive(Math.floor(Math.random() * 9));
    }, 800);

    const countdown = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => {
      clearInterval(moleTimer);
      clearInterval(countdown);
    };
  }, [playing]);

  useEffect(() => {
    if (time <= 0) {
      setPlaying(false);
      setActive(null);
    }
  }, [time]);

  const hitMole = (index) => {
    if (index === active) {
      setScore((s) => s + 1);
      setActive(null);
    }
  };

  return (
    <div className="whack-game">
      <p>Score: {score} | Time: {time}s</p>

      <div className="grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`hole ${active === i ? "active" : ""}`}
            onClick={() => hitMole(i)}
          >
            {active === i && <div className="mole" />}
          </div>
        ))}
      </div>

      {!playing && <h3 className="game-over">Game Over</h3>}
    </div>
  );
}


// Typing Speed Game
function TypingSpeed() {
  const SENTENCES = [
  "Keep pushing forward no matter the obstacles",
  "Failure is just a step toward success",
  "Every challenge is an opportunity to grow",
  "Persistence beats talent when talent gives up",
  "Believe in yourself and take the next step",
  "Small progress is still progress every day",
  "Courage is continuing even when afraid",
  "Never stop learning and improving yourself"
  ];

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [text, setText] = useState(SENTENCES[0]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    if (time <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, time, finished]);

  const handleFinish = () => {
    setFinished(true);
    setStarted(false);
    const words = input.split(" ").length;
    const minutes = (30 - time) / 60;
    setWpm(Math.round(words / minutes));
    setTimeout(() => {
      const nextIndex = (sentenceIndex + 1) % SENTENCES.length;
      setSentenceIndex(nextIndex);
      setText(SENTENCES[nextIndex]);
      setInput("");
      setTime(30);
      setStarted(false);
      setFinished(false);
      setWpm(0);
    }, 1500);
  };

  const handleChange = (e) => {
    if (!started) setStarted(true);
    const val = e.target.value;
    setInput(val);

    if (val === text) {
      handleFinish();
    }
  };

  return (
    <div className="typing-game">
      <p>Time Left: {time}s</p>

      <div className="text-display">{text}</div>

      <input
        type="text"
        value={input}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing here..."
      />

      {finished && <h3 className="wpm-result">Your speed: {wpm} WPM</h3>}
    </div>
  );
}





  // HangmanGame
  function HangmanGame() {const [wordIndex, setWordIndex] = useState(0);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);

  const maxWrong = 6;
  const word = WORDS[wordIndex];

  const isWinner = word.split("").every((l) => guessed.includes(l));
  const isLoser = wrong >= maxWrong;

  const guess = (letter) => {
    if (guessed.includes(letter) || isWinner || isLoser) return;

    setGuessed([...guessed, letter]);
    if (!word.includes(letter)) {
      setWrong(wrong + 1);
    }
  };

  if (isWinner && !isLoser) {
    setTimeout(() => {
      setWordIndex((wordIndex + 1) % WORDS.length);
      setGuessed([]);
      setWrong(0);
    }, 700);
  }

  if (isLoser) {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <div className="hangman-game">
      <p>Lives: {maxWrong - wrong}</p>

      <div className="hangman">
        <div className="pole" />
        {wrong > 0 && <div className="head" />}
        {wrong > 1 && <div className="body" />}
        {wrong > 2 && <div className="arm left" />}
        {wrong > 3 && <div className="arm right" />}
        {wrong > 4 && <div className="leg left" />}
        {wrong > 5 && <div className="leg right" />}
      </div>

      <div className="word">
        {word.split("").map((l, i) => (
          <span key={i}>
            {guessed.includes(l) || isLoser ? l : "_"}
          </span>
        ))}
      </div>

      {!isLoser && (
        <div className="keyboard">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
            <button
              key={l}
              onClick={() => guess(l)}
              disabled={guessed.includes(l)}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {isWinner && <h2 className="win">Correct! Next word…</h2>}
      {isLoser && <h2 className="lose">You lost. Returning home…</h2>}

     
    </div>

 
  );
}






  // Toggle Theme
  return (
    

   <div className={`app ${theme}`}>
        <div className="comet">
          <div className="comet-dot head"></div>
          <div className="comet-dot"></div>
          <div className="comet-dot"></div>
          <div className="comet-dot"></div>
          <div className="comet-dot"></div>
          <div className="comet-dot"></div>
        </div>

       {!selectedGame && (
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </div>
        )}


      {selectedGame ? (
        <div className="game-page">
          <h1>{selectedGame.title}</h1>
          <p>{selectedGame.desc}</p>

              {selectedGame.id === "scramble" && <WordScrambleGame />}
              {selectedGame.id === "memory" && <MemoryCards />}
              {selectedGame.id === "whack" && <WhackAMole />}
              {selectedGame.id === "word" && <HangmanGame />}
              {selectedGame.id === "speed" && <TypingSpeed />}
              {selectedGame.id === "number" && <NumberGuessing />}

              {selectedGame.id !== "scramble" && selectedGame.id !== "word" && selectedGame.id !== "whack" && selectedGame.id !== "speed" && selectedGame.id !== "number" && selectedGame.id !== "memory" && (
                <div className="placeholder">Game UI goes here</div>
              )}




          <button className="back-btn" onClick={() => setSelectedGame(null)}>
            ← Back to Games
          </button>
        </div>
      ) : (
        <div className="intro">
          <h1 className="title">🎮 QUICK PLAY</h1>
          <p className="subtitle">Choose a game and start playing</p>

          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-card"
                onClick={() => setSelectedGame(game)}
              >
                <h2>{game.title}</h2>
                <p>{game.desc}</p>
              </div>
            ))}
          </div>

        <footer className="footer">
            <p className="footer-text">
              © {new Date().getFullYear()} Jennilyn Salaver. All rights reserved.
            </p>
          
        </footer> 


        </div>
      )}
    </div>
  );
}
