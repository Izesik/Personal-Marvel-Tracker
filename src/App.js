import './App.css';
import ComicListDesktop from './components/ComicListDesktop';
import AddComic from './components/AddComic';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Isaac's Marvel Collection</h1>
      </header>
      <ComicListDesktop/>
    </div>
  );
}

export default App;
