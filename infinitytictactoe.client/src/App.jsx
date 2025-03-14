import { useEffect, useState, useRef } from 'react';
import './App.css';

const App = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    const [pointsX, setPointsX] = useState(0);
    const [pointsO, setPointsO] = useState(0);

    const [timeLeft, setTimeLeft] = useState(60);

    const [timeStart, setTimeStart] = useState(null);

    const [nextMove, setNextMove] = useState("X");
    const [hoveredCell, setHoveredCell] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [grid, setGrid] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]);

    // Box size
    const [size, setSize] = useState(100);
    // Font size for X and 0
    const [fontSize, setFontSize] = useState(40);
    // Box line width
    const [boxLineWidth, setBoxLineWidth] = useState(2);
    // Cross line width
    const [crossLineWidth, setCrossLineWidth] = useState(5);

    // Handle mouse movement
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the starting position to center the grid
        const gridWidth = size * grid.length;
        const gridHeight = size * grid.length;
        const startX = (canvas.width - gridWidth) / 2;
        const startY = (canvas.height - gridHeight) / 2;

        // Calculate row and column based on mouse position
        const col = Math.floor((mouseX - startX) / size);
        const row = Math.floor((mouseY - startY) / size);

        if (row >= 0 && row < grid.length && col >= 0 && col < grid.length) {
            setHoveredCell({ row, col });
        } else {
            setHoveredCell(null); // If not over a cell, reset
        }
    };

    // Handle mouse movement
    const handleMouseClick = (e) => {
        if (timeLeft == 0)
            return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the starting position to center the grid
        const gridWidth = size * grid.length;
        const gridHeight = size * grid.length;
        const startX = (canvas.width - gridWidth) / 2;
        const startY = (canvas.height - gridHeight) / 2;

        // Calculate row and column based on mouse position
        const col = Math.floor((mouseX - startX) / size);
        const row = Math.floor((mouseY - startY) / size);

        // Check if its within grid 
        if (row >= 0 && row < grid.length && col >= 0 && col < grid.length) {
            // Check if cell is free
            if (grid[row][col] === "") {
                let newGrid = grid;
                newGrid[row][col] = nextMove;

                // Increase grid size if grid size reached 
                let totalUnfilled = 0;
                for (let row = 0; row < newGrid.length; row++) {
                    for (let col = 0; col < newGrid.length; col++) {
                        if (newGrid[row][col] === "")
                            totalUnfilled++;
                    }
                }

                if (totalUnfilled < grid.length * grid.length * 0.2) {
                    newGrid.unshift(new Array(newGrid[0].length).fill(""));
                    newGrid.push(new Array(newGrid[0].length).fill(""));

                    newGrid = newGrid.map(row => ["", ...row, ""]);
                }

                let newSize = size;
                let stepSize = 0.9;

                while (newSize * newGrid.length > canvas.height - 100 || newSize * newGrid.length > canvas.width - 100) {
                    if (newSize * stepSize > 0) {
                        setSize(newSize * stepSize);
                        newSize *= stepSize;
                    }

                    if (fontSize * stepSize > 0)
                        setFontSize(fontSize * stepSize);

                    if (boxLineWidth * stepSize > 0)
                        setBoxLineWidth(boxLineWidth * stepSize);

                    if (crossLineWidth * stepSize > 0)
                        setCrossLineWidth(crossLineWidth * stepSize);
                }

                setGrid(newGrid);
                calculatePoints(newGrid);

                // Set next move 
                if (nextMove === "X") {
                    setNextMove("O");
                } else {
                    setNextMove("X");
                }


                if (!gameStarted) {
                    setTimeStart(new Date());
                    setGameStarted(true);
                }
            }
        }
    };

    const calculatePoints = (grid) => {
        let newPointsX = 0;
        let newPointsO = 0;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
                if (grid[row][col] === "")
                    continue;

                let point = 0;
                if (row - 1 >= 0 && row + 1 < grid.length)
                    if (grid[row][col] == grid[row - 1][col] && grid[row][col] == grid[row + 1][col])
                        point++;

                if (col - 1 >= 0 && col + 1 < grid.length)
                    if (grid[row][col] == grid[row][col - 1] && grid[row][col] == grid[row][col + 1])
                        point++;

                if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < grid.length && col + 1 < grid.length)
                    if (grid[row][col] == grid[row - 1][col - 1] && grid[row][col] == grid[row + 1][col + 1])
                        point++;

                if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < grid.length && col + 1 < grid.length)
                    if (grid[row][col] == grid[row - 1][col + 1] && grid[row][col] == grid[row + 1][col - 1])
                        point++;

                if (grid[row][col] === "X")
                    newPointsX += point;
                if (grid[row][col] === "O")
                    newPointsO += point;
            }
        }

        setPointsX(newPointsX);
        setPointsO(newPointsO);
    }

    const getCellCoords = (row, col) => {
        const canvas = canvasRef.current;

        // Calculate the starting position to center the grid
        const gridWidth = size * grid.length;
        const gridHeight = size * grid.length;
        const startX = (canvas.width - gridWidth) / 2;
        const startY = (canvas.height - gridHeight) / 2;

        // Calculate the coordinates
        const x = startX + col * size + size / 2;
        const y = startY + row * size + size / 2;

        return { x, y };
    };

    const restart = () => {
        setTimeout(() => {
            setPointsX(0);
            setPointsO(0);

            setTimeLeft(60);
            setTimeStart(null);
            setNextMove("X");
            setGameStarted(false);
            setGrid([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ]);

            setSize(100);
            setFontSize(40);
            setBoxLineWidth(2);
            setCrossLineWidth(5);
        }, 200);
    }

    const handleKeyDown = (e) => {
        if (e.key === "r" || e.key === "R") {
            restart();
        }
    };

    useEffect(() => {
        // Variables 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        // Events
        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleMouseClick);
        window.addEventListener("keydown", handleKeyDown);

        // Game Loop (God forgive me for the atrocities I have brought upon this world)
        const Update = (timestamp) => {
            const gridWidth = size * grid.length;
            const gridHeight = size * grid.length;
            const startX = (canvas.width - gridWidth) / 2;
            const startY = (canvas.height - gridHeight) / 2;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = fontSize + "px Kode Mono";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = boxLineWidth;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.lineCap = "round";

            // Draw grid
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid.length; col++) {
                    const x = startX + col * size;
                    const y = startY + row * size;

                    // Highlight the hovered cell
                    if (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Highlight color
                        ctx.fillRect(x, y, size, size);

                        if (grid[hoveredCell.row][hoveredCell.col] === "")
                            ctx.fillText(nextMove, x + size / 2, y + size / 2);
                    }

                    ctx.fillStyle = "white";

                    // Draw cell (but avoid outer borders)
                    if (col > 0) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x, y + size), ctx.stroke(); // Left border
                    if (row > 0) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x + size, y), ctx.stroke(); // Top border

                    // Draw "X" or "O"
                    if (grid[row][col] === "X" || grid[row][col] === "O") {
                        ctx.fillText(grid[row][col], x + size / 2, y + size / 2 + 4);
                    }
                }
            }

            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid.length; col++) {
                    ctx.lineWidth = crossLineWidth;
                    if (grid[row][col] !== "") {
                        if (grid[row][col] === "X")
                            ctx.strokeStyle = "#fe3232";
                        if (grid[row][col] === "O")
                            ctx.strokeStyle = "#3299fe";

                        if (row - 1 >= 0 && row + 1 < grid.length)
                            if (grid[row][col] == grid[row - 1][col] && grid[row][col] == grid[row + 1][col]) {
                                // - X -
                                // - X -
                                // - X -

                                let start = getCellCoords(row - 1, col);
                                let end = getCellCoords(row + 1, col);

                                ctx.beginPath();
                                ctx.moveTo(start.x, start.y);
                                ctx.lineTo(end.x, end.y);
                                ctx.stroke();
                            }

                        if (col - 1 >= 0 && col + 1 < grid.length)
                            if (grid[row][col] == grid[row][col - 1] && grid[row][col] == grid[row][col + 1]) {
                                // - - -
                                // X X X
                                // - - -

                                let start = getCellCoords(row, col - 1);
                                let end = getCellCoords(row, col + 1);

                                ctx.beginPath();
                                ctx.moveTo(start.x, start.y);
                                ctx.lineTo(end.x, end.y);
                                ctx.stroke();
                            }

                        if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < grid.length && col + 1 < grid.length)
                            if (grid[row][col] == grid[row - 1][col - 1] && grid[row][col] == grid[row + 1][col + 1]) {
                                // X - -
                                // - X -
                                // - - X

                                let start = getCellCoords(row - 1, col - 1);
                                let end = getCellCoords(row + 1, col + 1);

                                ctx.beginPath();
                                ctx.moveTo(start.x, start.y);
                                ctx.lineTo(end.x, end.y);
                                ctx.stroke();
                            }

                        if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < grid.length && col + 1 < grid.length)
                            if (grid[row][col] == grid[row - 1][col + 1] && grid[row][col] == grid[row + 1][col - 1]) {
                                // - - X
                                // - X -
                                // X - -

                                let start = getCellCoords(row - 1, col + 1);
                                let end = getCellCoords(row + 1, col - 1);

                                ctx.beginPath();
                                ctx.moveTo(start.x, start.y);
                                ctx.lineTo(end.x, end.y);
                                ctx.stroke();
                            }
                    }
                }
            }

            if (timeStart != null && timeLeft > 0) {
                let newTime = Math.floor(((((new Date(timeStart.getTime() + 60 * 1000))) - new Date()) / 1000) * 100) / 100;

                setTimeLeft(newTime > 0 ? newTime : 0);
            }

            // Request next frame
            animationRef.current = requestAnimationFrame(Update);
        }

        animationRef.current = requestAnimationFrame(Update);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleMouseClick);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [timeStart, hoveredCell, grid]);

    const getWinner = () => {
        if (pointsX > pointsO) {
            return <h1>Player <span className="red redShadow">X</span> won the game!</h1>
        } else if (pointsO > pointsX) {
            return <h1>Player <span className="blue blueShadow">O</span> won the game!</h1>
        } else {
            return <h1>Tie!</h1>
        }
    }

    return (
        <div id="content" className="kode-mono">
            <h1 className="fade-away strokeme">Infinity Tic Tac Toe</h1>
            <div className="win-screen strokeme" style={{ display: timeLeft > 0 ? "none" : "block" }}>
                {getWinner()}
                <h2 className="restartButton" onClick={restart}>Press R to restart</h2>
            </div>
            <div className="scoreBoard">
                <div>
                    <span>Player <span className="red">X</span>: {pointsX}</span>
                </div>
                <div>
                    <span>Player <span className="blue">O</span>: {pointsO}</span>
                </div>
                <div>
                    <span>Time Left: {timeLeft}</span>
                </div>
            </div>
            <div className="credits" onClick={() => window.open("https://vycdev.com", "_blank")}>Made by vycdev</div>
            <canvas className="canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default App;