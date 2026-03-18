(function() {
    'use strict';

    const DIFFICULTIES = {
        beginner: { rows: 8, cols: 8, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 }
    };

    const game = {
        board: [],
        revealed: [],
        flagged: [],
        mines: [],
        rows: 8,
        cols: 8,
        minesCount: 10,
        flagsUsed: 0,
        gameOver: false,
        gameWon: false,
        timer: 0,
        timerInterval: null,
        firstClick: true,
        difficulty: 'beginner'
    };

    const elements = {
        board: document.getElementById('gameBoard'),
        mineCounter: document.getElementById('mineCounter'),
        timer: document.getElementById('timer'),
        faceBtn: document.getElementById('faceBtn'),
        faceBtnTop: document.getElementById('faceBtnTop'),
        modal: document.getElementById('gameModal'),
        animationContainer: document.getElementById('animationContainer'),
        closeModal: document.getElementById('closeModal'),
        diffButtons: document.querySelectorAll('.diff-btn')
    };

    function init() {
        initI18n();
        updateLanguageDisplay();
        setupEventListeners();
        startGame('beginner');
    }

    function setupEventListeners() {
        elements.faceBtn.addEventListener('click', resetGame);
        elements.faceBtnTop.addEventListener('click', resetGame);
        elements.closeModal.addEventListener('click', closeModal);

        elements.diffButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                elements.diffButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                startGame(level);
            });
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setLanguage(btn.dataset.lang);
            });
        });

        elements.board.addEventListener('mousedown', handleMouseDown);
        elements.board.addEventListener('mouseup', handleMouseUp);
        elements.board.addEventListener('contextmenu', e => e.preventDefault());
    }

    function handleMouseDown(e) {
        if (game.gameOver || !e.target.classList.contains('cell')) return;
        setFace('😮');
    }

    function handleMouseUp(e) {
        if (game.gameOver) return;
        setFace('😊');

        if (e.button === 0 && e.target.classList.contains('cell')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            handleClick(row, col);
        } else if (e.button === 2 && e.target.classList.contains('cell')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            handleRightClick(row, col);
        }
    }

    function startGame(difficulty) {
        game.difficulty = difficulty;
        const config = DIFFICULTIES[difficulty];
        game.rows = config.rows;
        game.cols = config.cols;
        game.minesCount = config.mines;

        game.board = [];
        game.revealed = [];
        game.flagged = [];
        game.mines = [];
        game.flagsUsed = 0;
        game.gameOver = false;
        game.gameWon = false;
        game.firstClick = true;
        game.timer = 0;

        stopTimer();
        updateMineCounter();
        updateTimer();
        setFace('😊');

        for (let r = 0; r < game.rows; r++) {
            game.board[r] = [];
            game.revealed[r] = [];
            game.flagged[r] = [];
            for (let c = 0; c < game.cols; c++) {
                game.board[r][c] = 0;
                game.revealed[r][c] = false;
                game.flagged[r][c] = false;
            }
        }

        renderBoard();
    }

    function resetGame() {
        startGame(game.difficulty);
    }

    function placeMines(excludeRow, excludeCol) {
        let placed = 0;
        while (placed < game.minesCount) {
            const r = Math.floor(Math.random() * game.rows);
            const c = Math.floor(Math.random() * game.cols);

            const isExcluded = Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1;

            if (!game.mines.includes(`${r},${c}`) && !isExcluded) {
                game.mines.push(`${r},${c}`);
                game.board[r][c] = -1;
                placed++;
            }
        }

        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c] !== -1) {
                    game.board[r][c] = countAdjacentMines(r, c);
                }
            }
        }
    }

    function countAdjacentMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
                    if (game.board[nr][nc] === -1) count++;
                }
            }
        }
        return count;
    }

    function renderBoard() {
        elements.board.innerHTML = '';
        elements.board.style.gridTemplateColumns = `repeat(${game.cols}, 30px)`;
        elements.board.style.gridTemplateRows = `repeat(${game.rows}, 30px)`;

        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                elements.board.appendChild(cell);
            }
        }
    }

    function handleClick(row, col) {
        if (game.flagged[row][col] || game.revealed[row][col] || game.gameOver) return;

        if (game.firstClick) {
            placeMines(row, col);
            game.firstClick = false;
            startTimer();
        }

        if (game.board[row][col] === -1) {
            revealMine(row, col);
            gameOver(false);
        } else {
            revealCell(row, col);
            checkWin();
        }
    }

    function handleRightClick(row, col) {
        if (game.revealed[row][col] || game.gameOver) return;

        const cell = getCell(row, col);
        if (game.flagged[row][col]) {
            game.flagged[row][col] = false;
            cell.classList.remove('flagged');
            game.flagsUsed--;
        } else {
            game.flagged[row][col] = true;
            cell.classList.add('flagged');
            game.flagsUsed++;
        }
        updateMineCounter();
    }

    function revealCell(row, col) {
        if (row < 0 || row >= game.rows || col < 0 || col >= game.cols) return;
        if (game.revealed[row][col] || game.flagged[row][col]) return;

        game.revealed[row][col] = true;
        const cell = getCell(row, col);
        cell.classList.add('revealed');

        const value = game.board[row][col];
        if (value > 0) {
            cell.textContent = value;
            cell.dataset.num = value;
            cell.classList.add('number');
        } else if (value === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    revealCell(row + dr, col + dc);
                }
            }
        }
    }

    function revealMine(row, col) {
        for (const pos of game.mines) {
            const [r, c] = pos.split(',').map(Number);
            const cell = getCell(r, c);
            cell.classList.add('revealed', 'mine');
            if (r === row && c === col) {
                cell.style.background = 'radial-gradient(circle, red, darkred)';
            }
        }
    }

    function getCell(row, col) {
        return elements.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    function checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.revealed[r][c]) revealedCount++;
            }
        }

        if (revealedCount === game.rows * game.cols - game.minesCount) {
            gameOver(true);
        }
    }

    function gameOver(won) {
        game.gameOver = true;
        game.gameWon = won;
        stopTimer();

        if (won) {
            setFace('😎');
            showModal('success');
        } else {
            setFace('😵');
            showModal('fail');
        }
    }

    function setFace(face) {
        elements.faceBtn.textContent = face;
        elements.faceBtnTop.textContent = face;
    }

    function startTimer() {
        stopTimer();
        game.timerInterval = setInterval(() => {
            game.timer++;
            if (game.timer > 999) game.timer = 999;
            updateTimer();
        }, 1000);
    }

    function stopTimer() {
        if (game.timerInterval) {
            clearInterval(game.timerInterval);
            game.timerInterval = null;
        }
    }

    function updateTimer() {
        elements.timer.textContent = String(game.timer).padStart(3, '0');
    }

    function updateMineCounter() {
        const remaining = game.minesCount - game.flagsUsed;
        elements.mineCounter.textContent = String(remaining).padStart(3, '0');
    }

    function showModal(type) {
        elements.animationContainer.innerHTML = '';

        if (type === 'fail') {
            const failDiv = document.createElement('div');
            failDiv.className = 'fail-animation';
            failDiv.innerHTML = '<div class="explosion"></div><div class="trump"></div><div class="fail-text">' + t('failTitle') + '</div>';
            elements.animationContainer.appendChild(failDiv);
        } else {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-animation';
            successDiv.innerHTML = '<div class="text">🎉 ' + t('successTitle') + ' 🎉</div><div class="ship"></div><div class="waves"></div>';
            elements.animationContainer.appendChild(successDiv);
        }

        elements.modal.classList.add('show');
    }

    function closeModal() {
        elements.modal.classList.remove('show');
        resetGame();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
