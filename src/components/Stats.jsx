function Stats({ time, wpm, accuracy, bestWpm, bestAccuracy }) {
  return (
    <>
      <div className="stats">
        <p>⏱ {time}s</p>
        <p>⚡ WPM: {wpm}</p>
        <p>🎯 Accuracy: {accuracy}%</p>
      </div>

      <div className="best-stats">
        <p>🏆 Best WPM: {bestWpm}</p>
        <p>🥇 Best Accuracy: {bestAccuracy}%</p>
      </div>
    </>
  );
}

export default Stats;
