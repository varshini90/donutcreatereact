import { useState, useEffect } from 'react';

const useTypewriter = (text: string, speed: number = 50) => {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (text) {
      let index = 0;
      const intervalId = setInterval(() => {
        index++;
        setTypedText(text.substring(0, index));

        if (index === text.length) {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return typedText;
};

export default useTypewriter;
