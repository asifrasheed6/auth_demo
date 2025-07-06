import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

const socket = io("link", {
  transports: ["websocket"],
});

type Stage = "form" | "qr" | "result";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signature, setSignature] = useState("");
  const [number, setNumber] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    socket.on("registered", ({ signature, number }) => {
      setSignature(signature);
      setNumber(number);
      setStage("qr");
    });

    socket.on("verification_result", ({ verification_result }) => {
      setIsVerified(verification_result);
      setStage("result");
    });

    return () => {
      socket.off("registered");
      socket.off("verification_result");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      socket.emit("register", phone);
    }
  };

  const smsUri = `sms:${number}?body=${signature}`;

  const renderForm = () => (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Verify Your Identity</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Your Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <button type="submit">Continue</button>
    </form>
  );

  const renderQR = () => (
    <div className="card animate-slide">
      <h2>Scan to Verify</h2>
      <QRCodeCanvas value={smsUri} size={200} />
      <p>Scan this QR code to send an SMS.</p>
      <a href={smsUri} className="link">Click here if on your phone</a>
    </div>
  );

  const renderResult = () => (
    <div className="card animate-slide">
      <div
        className={`status-circle ${
          isVerified ? "success" : "error"
        }`}
      >
        {isVerified ? "✓" : "✗"}
      </div>
      <h2>{isVerified ? "Verified!" : "Verification Failed"}</h2>
      {!isVerified && (
        <button onClick={() => setStage("qr")}>Try Again</button>
      )}
    </div>
  );

  return (
    <div className="container">
      {stage === "form" && renderForm()}
      {stage === "qr" && renderQR()}
      {stage === "result" && renderResult()}
    </div>
  );
}

export default App;
