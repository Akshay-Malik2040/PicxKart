# PicxKart 🎬
**PicxKart** is a modern, responsive, and intelligent stock footage aggregation platform. It helps content creators, video editors, and designers seamlessly find, collect, and download the perfect high-quality photos and videos for their projects. 

Equipped with an advanced **AI-powered Script Analyzer**, PicxKart takes the guesswork out of finding footage. Simply paste your script, and let our AI extract the most impactful keywords to instantly surface relevant media!

---

## ✨ Features

- 🧠 **AI-Powered Script Analysis**: Paste your video script, and integrated Google Gemini AI will intelligently extract visually descriptive keywords for direct searching.
- 🎞️ **Multi-format Media Search**: Search for both stunning Photos and cinematic Videos through a unified, glassmorphism-inspired interface.
- 🛒 **Media Collections (Cart)**: Add your favorite photos and videos into a persistent "Cart" to review later. Data is persistently synced using LocalStorage.
- 📐 **Global Resolution Downloader**: Seamlessly choose and enforce your desired download resolution (High / Medium / Low) globally across your entire cart or individually for each item.
- 🧱 **Masonry Grid Layout**: Enjoy a beautiful, pinterest-style masonry layout that adapts beautifully to any image or video aspect ratio.
- 📱 **Fully Responsive**: Crafted with a mobile-first approach. Includes custom mobile navigations, hamburger menus, and touch-friendly controls.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API (`CartContext`)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Layouts**: `react-masonry-css`

---

## 📂 Project Structure

```text
PicxKart/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── assets/             # Images, icons, and local media assets
│   ├── components/         # Reusable UI React components
│   │   ├── AiScriptUploader.jsx  # Handles script input & Gemini AI integration
│   │   ├── Body.jsx              # Main feed / Masonry grid showcasing media
│   │   ├── CartDrawer.jsx        # Slide-out drawer for selected media downloads
│   │   ├── Header.jsx            # Hero banner and introductory section
│   │   ├── ImageCard.jsx         # Individual media card (photo/video renderer)
│   │   ├── NavBar.jsx            # Top navigation bar & mobile menu
│   │   └── ScriptUploader.jsx    # Legacy / Base script uploader
│   ├── context/
│   │   └── CartContext.jsx       # Global state for cart & resolution settings
│   ├── App.jsx             # Main Application layout and state assembly
│   ├── index.css           # Global CSS and Tailwind directives
│   └── main.jsx            # React root entry point
├── .env                    # Environment variables (API keys)
├── package.json            # Project dependencies and deployment scripts
├── vite.config.js          # Vite configuration
└── README.md               # You are here!
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Clone the Repository

```bash
git clone https://github.com/Akshay-Malik2040/PicxKart.git
cd PicxKart
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` file in the root directory and configure necessary API keys. At a minimum, you'll need a Google Gemini API Key and API keys for the stock media providers you are fetching from (like Pexels or Pixabay):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_PEXELS_API_KEY=your_pexels_api_key_here
VITE_PIXABAY_API_KEY=your_pixabay_api_key_here
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 🧑‍💻 Contributing

Contributions are always welcome! Feel free to fork the repository, make your changes in a separate branch, and submit a Pull Request.

---

## 📄 License

This project is privately owned. Feel free to use to learn but ask for permission prior to commercial distribution.
