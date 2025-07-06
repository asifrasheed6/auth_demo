# 📱 Frontend — Stateless SMS Verification Demo

This is the React-based frontend for the Stateless [SMS Verification proof of concept](https://github.com/asifrasheed6/auth).  

It demonstrates a new approach to phone verification — flipping the flow so that **users send an SMS with a cryptographic signature**, rather than receiving a one-time code.

---

## 🔍 What It Does

- Generates a signed SMS payload using a user-provided phone number
- Displays a **QR code** for desktop users to scan and send from their phone
- Shows a **"tap to send SMS"** link for mobile users
- Communicates with a stateless backend that validates the signature without storing sessions

---

More information about this project on the [main repo](https://github.com/asifrasheed6/auth).