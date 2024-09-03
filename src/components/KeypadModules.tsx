import React, { useState, useEffect } from 'react';
import './KeypadModules.css';

// Define the columns as per the reference image
const columns = [
  ['Ѧ', 'Э', 'Ω', 'Ё', 'ʘ', 'ϗ', 'Җ'],
  ['Ψ', 'Ѿ', 'Ж', 'Ю', 'λ', 'Ƥ', '∏'],
  ['©', 'Ƥ', 'Ц', 'Ҩ', 'Ϙ', 'Ω', 'Ю'],
  ['Ϟ', 'Ю', 'Ψ', '∅', 'Ц', 'Ё', 'Ω'],
  ['Ɖ', 'Ψ', 'Ю', 'Ѿ', 'Ж', 'Ц', 'Ω'],
];

const getRandomColumnAndSymbols = () => {
  // Select a random column
  const randomColumn = columns[Math.floor(Math.random() * columns.length)];

  // Pick 4 unique random symbols from the selected column
  const selectedSymbols = [];
  const usedIndices = new Set();

  while (selectedSymbols.length < 4) {
    const randomIndex = Math.floor(Math.random() * randomColumn.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedSymbols.push(randomColumn[randomIndex]);
    }
  }

  // Keep the correct order
  const sortedSymbols = [...selectedSymbols].sort((a, b) => randomColumn.indexOf(a) - randomColumn.indexOf(b));

  // Shuffle the initial keypad symbols for display
  const shuffledSymbols = [...selectedSymbols].sort(() => Math.random() - 0.5);

  return { shuffledSymbols, sortedSymbols };
};

const KeypadModules: React.FC = () => {
  const [clickedSymbols, setClickedSymbols] = useState<string[]>([]);
  const [initialKeypadSymbols, setInitialKeypadSymbols] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'error' | 'correct'>('playing');
  const [buttonStatus, setButtonStatus] = useState<string[]>([]);

  useEffect(() => {
    const { shuffledSymbols, sortedSymbols } = getRandomColumnAndSymbols();
    setInitialKeypadSymbols(shuffledSymbols);
    setCorrectOrder(sortedSymbols);
    setButtonStatus(new Array(4).fill(''));
  }, []);

  const handleClick = (symbol: string, index: number) => {
    if (status !== 'playing' || clickedSymbols.includes(symbol)) return;

    const newClickedSymbols = [...clickedSymbols, symbol];

    if (symbol === correctOrder[clickedSymbols.length]) {
      // Correct symbol
      const newButtonStatus = [...buttonStatus];
      newButtonStatus[index] = 'correct';
      setButtonStatus(newButtonStatus);

      if (newClickedSymbols.length === 4) {
        setStatus('correct');
      }
    } else {
      // Incorrect symbol
      const newButtonStatus = [...buttonStatus];
      newButtonStatus[index] = 'incorrect';
      setButtonStatus(newButtonStatus);
      setStatus('error');

      // Restart the game after delay
      setTimeout(() => {
        setClickedSymbols([]);
        setButtonStatus(new Array(4).fill(''));
        setStatus('playing');
      }, 1000);
      return;
    }

    setClickedSymbols(newClickedSymbols);
  };

  return (
     <div className="game-container">
      <span className={`game-container_status-circle ${status}`}></span>
      <div className="container">
        <h2>Keypad Game</h2>
        <div className="keypad">
          {initialKeypadSymbols.map((symbol, index) => (
            <button
              key={index}
              className="keypad-button"
              onClick={() => handleClick(symbol, index)}
            >
              {symbol}
              <span className={`status-circle ${buttonStatus[index]}`}></span>
            </button>
          ))}
        </div>
        <div className="output">
          <h3>Selected Order:</h3>
          <div>{clickedSymbols.join(' ')}</div>
          {status === 'correct' && <div style={{ color: 'green' }}>Bomb defuse!!! nice guy</div>}
          {status === 'error' && <div style={{ color: 'red' }}>HaHa noob!!!. Try Again!</div>}
        </div>
      </div>
    </div>
  );
};

export default KeypadModules;
