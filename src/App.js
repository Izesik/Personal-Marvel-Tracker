import "./App.css";
import ComicListDesktop from "./components/ComicListDesktop";
import AddComic from "./components/AddComic";
import AppHeader from "./components/AppHeader/AppHeader";

function App() {
  return (
    <div className="App">
      <AppHeader title="Marvel Trackr" />
      <ComicListDesktop />

      {/* 📌 Footer */}
      <footer className="App-footer">
        <p>Built on React. A Personal Marvel Comic Tracker.</p>
      </footer>
    </div>
  );
}

export default App;
