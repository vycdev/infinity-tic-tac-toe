import { useEffect, useState } from 'react';
import './App.css';

const App = () => {

    useEffect(() => {

    }, []);

    return (
        <div id="content">
            <h1 className="fade-away">Infinity Tic Tac Toe</h1>
            <canvas className="canvas"></canvas>
        </div>
    );
}

export default App;