import Image from 'next/image';
import { useEffect, useState, useRef, SyntheticEvent } from 'react';
import { generate } from 'random-words';
const NUM_WORDS = 100;
const SECONDS = 60;

export default function Home() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [started, setStarted] = useState(false);
  const [currInput, setCurrInput] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState('waiting');
  const textInput = useRef(null);
  useEffect(() => {
    setWords(generate(NUM_WORDS));
    textInput.current.focus();
  }, []);

  const start = () => {
    //reset condition
    if (status === 'finished') {
      setWords(generate(NUM_WORDS));
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar('');
      textInput.current.focus();
    }
    if (status !== 'Started') {
      setStatus('started');

      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus('finished');
            setCurrInput('');
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  };
  const detectKeyDown = (e) => {
    if (!started) {
      //if (e.keyCode == 32) {
      start();
      setStarted(true);
      // }
    }
  };
  const handleKeyDown = ({ keyCode, key }) => {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput('');
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar('');
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  };
  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== 'finished'
    ) {
      if (char === currChar) {
        return 'bg-green-400';
      } else {
        return 'bg-red-400';
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return 'bg-red-400';
    } else {
      return '';
    }
  }
  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  return (
    <main
      onKeyDown={(e) => detectKeyDown(e)}
      className=' text-primaryYellow text-2xl text-center flex flex-col justify-center items-center m-32 '
    >
      <div className='my-12 font-bold'>
        <h1>Typing Speed Test</h1>
        <p
          className='text-sm py-6
        '
        >
          begin typing to start the test.
        </p>
        <p>{countDown} seconds remaining</p>
      </div>
      <div>
        <input
          ref={textInput}
          type='text'
          className='input bg-slate-800 border-white border-2 text-white text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block mb-8 pb-4 w-96 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>
      <div>
        {words.map((word, i) => (
          <span key={i}>
            <span>
              {word.split('').map((char, idx) => (
                <span className={getCharClass(i, idx, char)} key={idx}>
                  {char}
                </span>
              ))}
            </span>
            <span> </span>
          </span>
        ))}
      </div>
      {status === 'finished' && (
        <div className='mt-6 flex flex-col'>
          <button
            class='bg-primaryYellow hover:bg-slate-800 text-white font-bold py-2 px-4 my-6 border border-yellow-800 rounded'
            onClick={start}
          >
            Retry!
          </button>
          <div className=''>
            <div className=''>
              <p className=''>WPM:</p>
              <p className=''>{correct}</p>
            </div>
            <div className=''>
              <p className=''>Accuracy:</p>
              {correct !== 0 ? (
                <p className=''>
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className=''>0%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
