function TypingBox({ text, input }) {
  return (
    <p className="highlight-text">
      {text.split("").map((char, index) => {
        let className = "";
        if (index < input.length) {
          className =
            char === input[index] ? "correct" : "incorrect";
        }
        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      })}
    </p>
  );
}

export default TypingBox;
