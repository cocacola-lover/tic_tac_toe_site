const TicTacToeGame = (() => {
    const TicTacToe = (() => {
    const cross = "cross";
    const circle = "circle";
    const blank = "blank";

    return {cross, circle, blank};
    })();

    const GameLogic = (()=> {

    const arr = [];
    let turn = TicTacToe.cross;
    for (let i = 0; i < 9; i++) arr.push(TicTacToe.blank);

    const reset = () => {
        turn = TicTacToe.cross;
        for (let i = 0; i < 9; i++) arr[i] = TicTacToe.blank;
    }
    const getField = () => JSON.parse(JSON.stringify(arr));
    const makeMoveBySymbol = (symbol, index) => {
        if (arr[index] != TicTacToe.blank) return false;
        arr[index] = symbol;
        return true;
    };
    const checkWin = () => {
        for (let i = 0; i < 3; i++){
            if (arr[i * 3 + 0] === arr[i * 3 + 1] && arr[i*3 + 1] === arr[i * 3 + 2]) return arr[i*3];
            if (arr[0 * 3 + i] === arr[1 * 3 + i] && arr[1*3 + i] === arr[2*3 + i]) return arr[i];
        }
        if (arr[0] === arr[4] && arr[4] === arr[8]) return arr[0];
        if (arr[2] === arr[4] && arr[4] === arr[6]) return arr[2];
        return TicTacToe.blank;
    };
    const getTurn = () => turn;

    return {getField, checkWin, getTurn, reset, makeMove: (index) => {
            if (makeMoveBySymbol(turn, index)) {
            turn = (turn == TicTacToe.cross ? TicTacToe.circle : TicTacToe.cross);
            return true;
        }
        return false;
    }};

    })();

    const WindowManager = (()=>{
        const tiles = Array.from(document.querySelectorAll(".playing-field .field-cell"));
        const buttons = Array.from(document.querySelectorAll(".top-panel > *"));

        const paintTile = (index, symbol) => {
            tiles[index].classList.remove(TicTacToe.cross, TicTacToe.circle);
            if (symbol === TicTacToe.circle || symbol === TicTacToe.cross) tiles[index].classList.toggle(symbol);
        };
        const changeHighLightTurn = () => {
            buttons.map((b) => b.classList.toggle("vibrant"));
        };
        const reset = () => {
            tiles.map((t) => t.classList.remove(TicTacToe.cross, TicTacToe.circle));
            if (buttons[1].classList.contains("vibrant")) changeHighLightTurn();
        };
        const displayWinner = (symbol) => {
            if (TicTacToe.blank === symbol) return;
            const main = document.querySelector("main");
            const icon = document.querySelector(".winning-screen .winning-icon");
            const display = document.querySelector(".winning-screen");

            icon.style.backgroundImage = TicTacToe.cross === symbol ? 
                'url("icons/close.svg"': 'url("icons/checkbox-blank-circle-outline.svg")';
            display.style.display = "flex";
            main.classList.toggle("blur");
        };
        return {paintTile, changeHighLightTurn, reset, displayWinner};
    })();

    const fullReset = () => {
        GameLogic.reset(); WindowManager.reset();
    }
    const tieTiles = () => {
        const tiles = Array.from(document.querySelectorAll(".playing-field .field-cell"));
        tiles.map((tile, index) => {
            tile.addEventListener("click", () => {
                if (GameLogic.makeMove(index)) {
                    WindowManager.paintTile(
                        index, GameLogic.getTurn() === TicTacToe.cross ? TicTacToe.circle : TicTacToe.cross
                        );
                    WindowManager.changeHighLightTurn();
                }
                WindowManager.displayWinner(GameLogic.checkWin());
            });
        });
    };
    const tieWinningScreen = () => {
        const display = document.querySelector(".winning-screen");
        display.addEventListener("click", () => {
            fullReset();
            display.style.display = "none"; 
            const main = document.querySelector("main");
            main.classList.toggle("blur");
        });
    }
    const tieReset = () => {
        const resetButton = document.querySelector(".bottom-panel > button");
        resetButton.addEventListener("click", fullReset);
    };
    return {start : () => {tieReset(); tieTiles(); tieWinningScreen();}}

})();

TicTacToeGame.start();