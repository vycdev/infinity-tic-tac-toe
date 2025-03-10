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
        ["X", "O", ""],
        ["", "X", ""],
        ["", "", "X"]
    ]);

    const size = 100; // Box size
    const padding = 2; // Small padding to remove outer borders

    // Handle mouse movement
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the starting position to center the grid
        const gridWidth = size * 3 + padding * 2;
        const gridHeight = size * 3 + padding * 2;
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

            const gridWidth = size * 3 + padding * 2;
            const gridHeight = size * 3 + padding * 2;
            const startX = (canvas.width - gridWidth) / 2;
            const startY = (canvas.height - gridHeight) / 2;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Draw grid
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const x = startX + col * size + padding;
                    const y = startY + row * size + padding;

                    // Highlight the hovered cell
                    if (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Highlight color
                        ctx.fillRect(x, y, size, size);

                        if (grid[hoveredCell.row][hoveredCell.col] === "")
                            ctx.fillText(nextMove, x + size / 2, y + size / 2);
                    }

                    // Draw cell (but avoid outer borders)
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "white";
                    if (col > 0) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x, y + size), ctx.stroke(); // Left border
                    if (row > 0) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x + size, y), ctx.stroke(); // Top border

                    // Draw "X" or "O"
                    if (grid[row][col] === "X" || grid[row][col] === "O") {
                        ctx.fillText(grid[row][col], x + size / 2, y + size / 2);
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