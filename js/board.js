class Board {
  constructor() {
    this.boardContainer = getEl("board");
    this.pieceContainer = getEl("pieces");

    this.gameOver = false;
    this.turn = "white";
    this.winner = null;

    this.whiteOnCheck = false;
    this.blackOnCheck = false;

    this.pieces = [];

    this.resetGame();
  }

  getPieceAt(row, column) {
    return this.pieces.find(
      (piece) => piece.row == row && piece.column == column
    );
  }

  setNextTurn() {
    this.turn = this.turn == "white" ? "black" : "white";
  }
  setWinner() {
    this.winner = this.turn;
    this.gameOver = true;
  }

  resetGame() {
    this.gameOver = false;
    this.turn = "white";
    this.winner = null;
    this.resetPieces();
  }

  resetPieces() {
    clearDiv(this.pieceContainer);
    let pieces = [];
    let self = this;

    // Creo las piezas
    Object.keys(teamInitialPieces).forEach((team) => {
      Object.keys(teamInitialPieces[team]).forEach((piece_type) => {
        let currentPieceType = teamInitialPieces[team][piece_type];

        currentPieceType.columns.forEach((column) => {
          currentPieceType.rows.forEach((row) => {
            let newPiece;
            if (piece_type == PAWN_CLASS) {
              newPiece = new Pawn(row, column, team, self, piece_type);
            } else {
              newPiece = new BasePiece(row, column, team, self, piece_type);
            }
            pieces.push(newPiece);
          });
        });
      });
    });

    this.pieces = pieces;
  }
}

const board = new Board();
