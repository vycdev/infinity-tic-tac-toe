import { useEffect, useState, useRef } from 'react';
import './App.css';

const App = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    const [pointsX, setPointsX] = useState(0);
    const [pointsO, setPointsO] = useState(0);
    const [timeLeftX, setTimeLeftX] = useState(60);
    const [timeLeftO, setTimeLeftO] = useState(60);
    const [nextMove, setNextMove] = useState("X");
    const [hoveredCell, setHoveredCell] = useState(null);
    const [grid, setGrid] = useState([
        ["X", "O", "X"],
        ["", "X", "X"],
        ["", "", "X"]
    ]);

    const size = 100; // Box size

    // Handle mouse movement
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the starting position to center the grid
        const gridWidth = size * 3;
        const gridHeight = size * 3;
        const startX = (canvas.width - gridWidth) / 2;
        const startY = (canvas.height - gridHeight) / 2;

        // Calculate row and column based on mouse position
        const col = Math.floor((mouseX - startX) / size);
        const row = Math.floor((mouseY - startY) / size);

        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            setHoveredCell({ row, col });
        } else {
            setHoveredCell(null); // If not over a cell, reset
        }
    };

    const getCellCoords = (row, col) => {
        const canvas = canvasRef.current;

        // Calculate the starting position to center the grid
        const gridWidth = size * 3;
        const gridHeight = size * 3;
        const startX = (canvas.width - gridWidth) / 2;
        const startY = (canvas.height - gridHeight) / 2;

        // Calculate the coordinates
        const x = startX + col * size + size / 2;
        const y = startY + row * size + size / 2;

        return { x, y };
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

        // Game Loop
        let lastTime = 0;

        const Update = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            const gridWidth = size * 3;
            const gridHeight = size * 3;
            const startX = (canvas.width - gridWidth) / 2;
            const startY = (canvas.height - gridHeight) / 2;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = "40px Kode Mono";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 2;
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
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = "red";
                    if (grid[row][col] !== "") {
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

            // Request next frame
            animationRef.current = requestAnimationFrame(Update);
        }

        animationRef.current = requestAnimationFrame(Update);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [hoveredCell, grid]);

    return (
        <div id="content" className="kode-mono">
            <h1 className="fade-away">Infinity Tic Tac Toe</h1>
            <div className="scoreBoard">
                <div>
                    <span>Player X: {pointsX}</span>
                    {" | "}
                    <span>Time Left X: {timeLeftX}</span>
                </div>
                <div>
                    <span>Player O: {pointsO}</span>
                    {" | "}
                    <span>Time Left O: {timeLeftO}</span>
                </div>
                <div>Next Move: {nextMove}</div>
            </div>
            <canvas className="canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default App;