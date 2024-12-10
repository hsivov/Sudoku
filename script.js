function sudokuSolver() {
    console.log('Script is loaded')
    const btnSolve = document.getElementById('solve');
    const btnClear = document.getElementById('clear');
    const inputs = document.querySelectorAll('input[data-row][data-col]');
    const result = document.getElementById('result');
    let matrix = Array(9).fill(0).map(() => Array(9).fill(0));

    const handleChange = (e) => {
        const row = parseInt(e.target.dataset.row, 10);
        const col = parseInt(e.target.dataset.col, 10);

        const value = parseInt(e.target.value, 10) || 0;

        console.log(`row: ${row}, col: ${col}, value: ${value}`)

        if (row >= 0 && col >= 0 && row < 9 && col < 9) {
            matrix[row][col] = value;
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', handleChange);
    })

    const solve = () => {
        const isNumberInRow = (number, row) => {
            return matrix[row].includes(number);
        }

        const isNumberInColumn = (number, column) => {
            return matrix.some(row => row[column] === number);
        }

        const isNumberInBox = (number, row, column) => {
            const localBoxRow = row - row % 3;
            const localBoxColumn = column - column % 3;
            for (let i = localBoxRow; i < localBoxRow + 3; i++) {
                for (let j = localBoxColumn; j < localBoxColumn + 3; j++) {
                    if (matrix[i][j] === number) {
                        return true;
                    }
                }
            }
            return false;
        }

        const isValidPlacement = (number, row, column) => {
            return (
                !isNumberInRow(number, row) &&
                !isNumberInColumn(number, column) &&
                !isNumberInBox(number, row, column)
            );
        };

        const solveBoard = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (matrix[row][col] === 0) { // Empty cell
                        for (let numberToTry = 1; numberToTry <= 9; numberToTry++) {
                            if (isValidPlacement(numberToTry, row, col)) {
                                matrix[row][col] = numberToTry;
        
                                if (solveBoard()) {
                                    return true; // Found a solution
                                }

                                matrix[row][col] = 0; // Backtrack
                            }
                        }
                        return false; // No valid number found
                    }
                }
            }
            return true; // Solved
        }

        const solved = solveBoard();

        result.innerText = solved ? 'Result: Solved successfully!' : 'Result: Unsolvable board.';
        if (solved) {
            populateBoard(); // Update the UI with the solved board
        }
    }

    const populateBoard = () => {
        let delay = 0;
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row, 10);
            const col = parseInt(input.dataset.col, 10);
            const value = matrix[row][col];

            setTimeout(() => {
                input.value = value === 0 ? '' : value;
            }, delay);

            delay += 50;
        })
    }

    const handleClear = () => {
        inputs.forEach(input => {
            input.value = '';
        });

        matrix = Array(9).fill(0).map(() => Array(9).fill(0));
        result.innerText = 'Result:';
        console.log('Grid cleared, and matrix reset');
    }

    btnSolve.addEventListener('click', solve);
    btnClear.addEventListener('click', handleClear);
}

document.addEventListener('DOMContentLoaded', sudokuSolver);
