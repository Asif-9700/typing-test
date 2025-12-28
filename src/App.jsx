import { useEffect, useState } from "react";
import TypingBox from "./components/TypingBox";
import Stats from "./components/Stats";
import AccuracyChart from "./components/AccuracyChart";
import ThemeToggle from "./components/ThemeToggle";
import Auth from "./components/Auth";
/* 🔹 Local fallback paragraphs (used if API fails) */
const fallbackParagraphs = [
  "The foundation of the Computer Operator exam lies in understanding the internal architecture of a computer. A computer system is primarily divided into the Central Processing Unit (CPU), Memory, and Input/Output devices. The CPU, often called the brain of the computer, consists of the Arithmetic Logic Unit (ALU) and the Control Unit (CU). Understanding the hierarchy of memory is crucial: from high-speed cache and RAM (volatile memory) to secondary storage like Hard Disk Drives (HDD) and Solid State Drives (SSD). Operators must be proficient in identifying hardware components and understanding their functions, such as the motherboard's role in connecting various peripherals. Additionally, knowledge of number systems—specifically Binary, Octal, and Hexadecimal—is vital, as computers process data in these formats. Mastery of these basics ensures that an operator can troubleshoot hardware issues and optimize system performance. Familiarity with Plug and Play devices and the BIOS (Basic Input/Output System) setup is also expected, as these are the first layers of interaction when a system boots up.",
  "Operating Systems (OS) act as an interface between the user and the computer hardware. For the UP Police exam, candidates must understand the functions of popular operating systems like Windows, Unix, and Linux. Key concepts include process management, memory management, and file system structures (like NTFS or FAT32). A computer operator must know how to navigate the Command Line Interface (CLI) in Linux, as many government servers run on open-source platforms. Beyond the OS, software is categorized into System Software and Application Software. System software includes drivers and utilities that keep the hardware running, while application software includes tools like MS Office (Word, Excel, PowerPoint) which are essential for daily administrative tasks. Understanding the difference between multitasking, multithreading, and real-time operating systems is a frequent area of questioning. Furthermore, the ability to manage system updates, install patches, and handle software licenses is a practical skill required for maintaining the integrity of departmental digital records.",

  "In the modern policing environment, connectivity is everything. Networking involves the connection of multiple computers to share resources and information. Candidates must be well-versed in the types of networks, such as Local Area Networks (LAN), Wide Area Networks (WAN), and Metropolitan Area Networks (MAN). The OSI (Open Systems Interconnection) model is a critical theoretical framework, consisting of seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer has specific protocols, such as TCP/IP for transmission, HTTP/HTTPS for web browsing, and FTP for file transfers. Understanding networking hardware like routers, switches, hubs, and bridges is essential for maintaining departmental connectivity. Additionally, knowledge of network topologies—Star, Mesh, Bus, and Ring—helps in understanding how data flows within an office. With the shift toward wireless communication, familiarity with Wi-Fi standards, Bluetooth, and mobile networking (4G/5G) has become increasingly important for field operations and data synchronization.",

  "The UP Police department deals with vast amounts of data, ranging from criminal records to administrative files, making Database Management Systems (DBMS) a core subject. A DBMS is software used to store, retrieve, and run queries on data. Relational Database Management Systems (RDBMS) like MySQL, Oracle, or MS Access use tables to organize data through rows and columns. Key concepts include Primary Keys (unique identifiers), Foreign Keys (links between tables), and Normalization (the process of reducing data redundancy). Structured Query Language (SQL) is the standard language used to interact with these databases. Operators should know basic commands like SELECT, INSERT, UPDATE, and DELETE. Understanding the ACID properties (Atomicity, Consistency, Isolation, Durability) ensures that database transactions are processed reliably. In a law enforcement context, the ability to generate reports and maintain data integrity is paramount, as any error in a database could lead to significant legal or operational hurdles.",

  "As a Computer Operator, protecting sensitive data from unauthorized access is a primary responsibility. Cyber security involves defending computers, servers, mobile devices, and networks from malicious attacks. This includes understanding different types of malware such as viruses, worms, trojans, and ransomware. Implementing firewalls, using antivirus software, and enforcing strong password policies are standard preventive measures. Phishing and social engineering are common threats that operators must be trained to recognize. Equally important is the legal aspect, specifically the Information Technology (IT) Act, 2000. This act provides the legal framework for electronic governance and defines various cyber-crimes and their penalties. Knowledge of digital signatures, encryption, and the role of the Certifying Authority is essential. In the UP Police, maintaining a Chain of Custody for digital evidence is vital, ensuring that data is not tampered with during investigations. Understanding these laws helps operators stay within legal boundaries while performing their duties.",

  "The landscape of information technology is constantly evolving, and the UP Police exam often includes questions on modern trends. This includes Cloud Computing, which allows for the storage and access of data over the internet rather than on local hard drives. Concepts like IaaS (Infrastructure as a Service) and SaaS (Software as a Service) are becoming common in government infrastructure. Artificial Intelligence (AI) and Machine Learning (ML) are also being integrated into policing for pattern recognition and predictive analysis. The Internet of Things (IoT) connects physical devices to the internet, which can be seen in smart surveillance systems. Furthermore, Big Data analytics helps in processing large volumes of unstructured data to find actionable insights. Being aware of these technologies is not just about passing an exam; it is about being prepared for the future of digital governance. Understanding how these tools can improve efficiency and transparency in public service is a key trait of a modern computer operator."
];
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("loggedInUser")
  );

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);
  const [started, setStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const [bestWpm, setBestWpm] = useState(
    Number(localStorage.getItem("bestWpm")) || 0
  );
  const [bestAccuracy, setBestAccuracy] = useState(
    Number(localStorage.getItem("bestAccuracy")) || 0
  );

  const [accuracyData, setAccuracyData] = useState([]);
  const [labels, setLabels] = useState([]);

  /* Fetch paragraph */
  const fetchParagraph = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://api.quotable.io/random?minLength=150&maxLength=250"
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setText(data.content);
    } catch {
      const idx = Math.floor(Math.random() * fallbackParagraphs.length);
      setText(fallbackParagraphs[idx]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParagraph();
  }, []);

  /* Timer */
  useEffect(() => {
    let timer;
    if (started && time > 0 && !isFinished) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, time, isFinished]);

  /* Stats */
  useEffect(() => {
    if (!input || !text) return;

    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correct++;
    }

    const minutes = (60 - time) / 60;
    const wpmCalc =
      minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
    const accuracyCalc = Math.round((correct / input.length) * 100);

    setWpm(wpmCalc);
    setAccuracy(accuracyCalc);

    if (wpmCalc > bestWpm) {
      setBestWpm(wpmCalc);
      localStorage.setItem("bestWpm", wpmCalc);
    }

    if (accuracyCalc > bestAccuracy) {
      setBestAccuracy(accuracyCalc);
      localStorage.setItem("bestAccuracy", accuracyCalc);
    }

    setAccuracyData((prev) => [...prev, accuracyCalc]);
    setLabels((prev) => [...prev, 60 - time]);
  }, [input]);

  const handleChange = (e) => {
    if (!started) setStarted(true);
    setInput(e.target.value);
  };

  const finishTest = () => {
    setStarted(false);
    setIsFinished(true);
  };

  const resetTest = () => {
    fetchParagraph();
    setInput("");
    setTime(60);
    setStarted(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(0);
    setAccuracyData([]);
    setLabels([]);
  };

  const resetBestScore = () => {
    localStorage.removeItem("bestWpm");
    localStorage.removeItem("bestAccuracy");
    setBestWpm(0);
    setBestAccuracy(0);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {!isAuthenticated ? (
        <div className="auth-page">
          <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
        </div>
      ) : (
        <>
          <div className="card">
            <div className="top-bar">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <button
                className="logout"
                onClick={() => {
                  localStorage.removeItem("loggedInUser");
                  setIsAuthenticated(false);
                }}
              >
                Logout
              </button>
            </div>

            <h1>Typing Speed Test</h1>

            <div className="text-container">
              {loading ? (
                <p className="loading">Loading text...</p>
              ) : (
                <TypingBox text={text} input={input} />
              )}
            </div>

            <textarea
              value={input}
              onChange={handleChange}
              disabled={time === 0 || loading || isFinished}
              placeholder="Start typing here..."
            />

            <Stats
              time={time}
              wpm={wpm}
              accuracy={accuracy}
              bestWpm={bestWpm}
              bestAccuracy={bestAccuracy}
            />

            <div className="action-buttons">
              <button
                style={{ background: "#198754" }}
                onClick={finishTest}
                disabled={!started}
              >
                Finish Test
              </button>

              <button onClick={resetTest}>Restart</button>

              <button className="danger" onClick={resetBestScore}>
                Reset Best Score
              </button>
            </div>

          </div>

          {isFinished && (
            <div className="result-overlay">
              <div className="result-card">
                <h2>Test Results</h2>

                <Stats
                  time={60 - time}
                  wpm={wpm}
                  accuracy={accuracy}
                  bestWpm={bestWpm}
                  bestAccuracy={bestAccuracy}
                />

                <AccuracyChart labels={labels} data={accuracyData} />

                <button onClick={resetTest}>Restart Test</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;