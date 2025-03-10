import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [pointsX, setPointsX] = useState(0);
    const [pointsO, setPointsO] = useState(0);

    useEffect(() => {

    }, []);

    return (
        <div id="content" className="kode-mono">
            <h1 className="fade-away">Infinity Tic Tac Toe</h1>
            <div className="scoreBoard">
                <div>Player X: {pointsX}</div>
                <div>Player O: {pointsO}</div>
            </div>
            <canvas className="canvas"></canvas>
        </div>
    );
}

export default App;