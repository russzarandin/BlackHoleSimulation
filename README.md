# 🌌 Black Hole Light Ray Simulation

This project simulates light rays spiraling around a black hole using [Three.js](https://threejs.org/), demonstrating effects like gravitational attraction and spaghettification.

## 💽 Demo

assets/image.png

## 🚀 How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Server

This project uses [`http-server`](https://www.npmjs.com/package/http-server) to serve the simulation:

```bash
npx http-server
```

Then visit the local URL shown in the terminal (usually [http://127.0.0.1:8080](http://127.0.0.1:8080))

> You can also install it globally with:
>
> ```bash
> npm install -g http-server
> ```

### 3. Project Structure

```
3DBlackHoleSimulation/
┣ assets/
┃ ┗ image.png
┣ node_modules/
┣ src/
┃ ┣ animate.js
┃ ┣ controls.js
┃ ┣ main.js
┃ ┣ rays.js
┃ ┣ sceneSetup.js
┃ ┗ utils.js
┣ .gitignore
┣ index.html
┣ package-lock.json
┣ package.json
┣ README.md
┗ style.css
```

* All simulation logic is split across modular files
* Configuration is tweakable in `rays.js` for velocity, pull strength, spawn radius, etc.

## ⚙️ Dependencies

* [Three.js](https://threejs.org/)
* [http-server](https://www.npmjs.com/package/http-server)

## 📦 .gitignore Example

```
node_modules/
dist/
.DS_Store
.env
*.log
.vscode/
*.bak
*.tmp
```

## 📚 License

MIT
