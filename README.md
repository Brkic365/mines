# 💣 Mines – Provably Fair Gambling Game

A simple but secure Mines-style gambling game built with **Next.js**, **Zustand**, and **Upstash Redis**. Avoid the mines, reveal gems, and cash out before you explode!

---

## ⚙️ Features

- 🎲 **Provably fair**: server + client seed with SHA-256
- 🔐 **Secure backend validation** (no client-side mine logic)
- 💼 **Wallet integration**: balance, bet, cashout
- 💣 **Minesweeper gameplay** with increasing multiplier
- ⚡ **Fast UX**: framer-motion animations + sound effects
- ☁️ **State stored in Redis** for server-side trust

---

## 📦 Stack

- **Next.js** – App and API routes
- **Zustand** – Game state and wallet store
- **Redis (Upstash)** – Store server seeds + mine positions
- **Framer Motion** – Animations
- **use-sound** – Sound effects
- **seedrandom** – Deterministic random mines
- **SHA-256** – Provable fairness

---

## 🚀 Getting Started

- **npm install**
- **npm dev**

---

## ENV Local File

- **UPSTASH_REDIS_REST_URL**=your-url
- **UPSTASH_REDIS_REST_TOKEN**=your-token

---

## 🔐 Provably Fair Logic

- **Mine generation:** sha256(serverSeed + clientSeed + nonce)

---

## 🧪 API Routes

- **POST /api/game/start-game** → Starts game, returns gameId & seed hash

- **POST /api/game/reveal-tile** → Validates tile (mine or not)

- **POST /api/game/cashout** → Reveals board, returns payout + new balance

---

## 📁 Project Structure

- **/app/api**         ← Game API routes
- **/app/game**        ← Game UI components
- **/app/game/hooks**  ← Zustand Game Store, payout calculator, sound effect hook
- **/app/game/utils**  ← Board and mine generators
- **/app/hooks**       ← Wallet Store
- **/lib**             ← Redis store, wallet API logic
