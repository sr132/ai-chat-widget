# AI Study Assistant

A beautifully styled, translucent chat widget (HTML/CSS/JS) with conversation memory, backed by a small Node/Express server that securely calls the Google Gemini API.

## Tech Used
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express
- **AI Engine:** Google Gemini API (`gemini-3.6-flash`)

## Why There's a Backend at All
An API key is a private password. If your web browser called Google's AI servers directly, your secret token would live inside your public JavaScript file. Anyone could open browser DevTools and steal your key to use your account balance.

To keep it safe, this project uses a backend setup:
- **`index.html`, `style.css`, `script.js`** — The frontend. Runs in the visitor's browser. It never handles secret keys.
- **`server.js`** — The backend. Runs on a secure server you control. This is the only place your `GEMINI_API_KEY` is allowed to exist. The browser sends prompts to your local `/api/chat` route, and your server securely handles the Google request.

## How the Request Flows
1. User types a message → `script.js` appends it to a local `conversationHistory` memory array.
2. `script.js` sends the whole history array to `/api/chat` (your own Node server, not Google).
3. `server.js` reads your private secret key from `.env` and proxies the content arrays out to Google's SDK engine.
4. Gemini's response returns to `server.js`, which securely forwards the text payload string back to the browser.
5. `script.js` displays the text bubble on your custom wallpaper layout.

## Local Setup

1. Open your project terminal and install your local tracking dependencies:
   ```bash
   npm install express cors dotenv @google/genai
   ```
2. Create a file named `.env` at the root of your project directory and add your private Google key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```
3. Start up your backend server:
   ```bash
   node server.js
   ```
4. Open your web browser and navigate to: **`http://localhost:3000`**

## Deploying Live
The `.env` configuration file is ignored by Git for security. When deploying live to a cloud platform like **Render** or **Railway**, do not upload your `.env` file. Instead, manually add `GEMINI_API_KEY` as an **Environment Variable** inside their web dashboard settings panel. 

*Note: Static file hosts like GitHub Pages **will not work** because they cannot execute backend Node processes (`server.js`).*
