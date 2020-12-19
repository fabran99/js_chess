const ROOK_CLASS = "fas fa-chess-rook";
const KNIGHT_CLASS = "fas fa-chess-knight";
const BISHOP_CLASS = "fas fa-chess-bishop";
const KING_CLASS = "fas fa-chess-king";
const QUEEN_CLASS = "fas fa-chess-queen";
const PAWN_CLASS = "fas fa-chess-pawn";

const teamInitialPieces = {
  white: {
    [ROOK_CLASS]: {
      rows: [1],
      columns: ["a", "h"],
    },
    [KNIGHT_CLASS]: {
      rows: [1],
      columns: ["b", "g"],
    },
    [BISHOP_CLASS]: {
      rows: [1],
      columns: ["c", "f"],
    },
    [QUEEN_CLASS]: {
      rows: [1],
      columns: ["d"],
    },
    [KING_CLASS]: {
      rows: [1],
      columns: ["e"],
    },
    [PAWN_CLASS]: {
      rows: [2],
      columns: "abcdefgh".split(""),
    },
  },
  black: {
    [ROOK_CLASS]: {
      rows: [8],
      columns: ["a", "h"],
    },
    [KNIGHT_CLASS]: {
      rows: [8],
      columns: ["b", "g"],
    },
    [BISHOP_CLASS]: {
      rows: [8],
      columns: ["c", "f"],
    },
    [QUEEN_CLASS]: {
      rows: [8],
      columns: ["d"],
    },
    [KING_CLASS]: {
      rows: [8],
      columns: ["e"],
    },
    [PAWN_CLASS]: {
      rows: [7],
      columns: "abcdefgh".split(""),
    },
  },
};

class BasePiece {
  constructor(row, column, team, board, iconClass, hasMoved = false) {
    this.row = row;
    this.column = column;
    this.team = team;
    this.alive = true;
    this.board = board;
    this.iconClass = iconClass;
    this.hasMoved = hasMoved;

    this.element = null;
    this.icon = null;

    this.init();
  }

  init() {
    // Creo contenedor
    let element = document.createElement("div");
    this.element = element;
    element.onclick = this.checkMoves.bind(this);
    element.className = `piece piece--${this.column} piece--${this.row} piece--${this.team}`;

    // Creo icono
    let icon = document.createElement("i");
    this.icon = icon;
    icon.className = this.iconClass;
    element.appendChild(icon);
    this.board.pieceContainer.appendChild(element);
  }

  onDead() {
    console.log("Pieza muerta");
    this.board.pieces = this.board.pieces.filter((el) => el != this);
    this.element.remove();
  }

  checkMoves(e) {
    console.log("moves");
  }

  updatePosition(newRow, newColumn) {
    // Chequeo si hay una pieza en ese lugar
    let deadPiece = this.board.getPieceAt(newRow, newColumn);
    if (deadPiece) {
      deadPiece.onDead();
    }

    this.row = newRow;
    this.column = newColumn;
    if (!this.hasMoved) {
      this.hasMoved = true;
    }
    this.element.className = `piece piece--${this.column} piece--${this.row} piece--${this.team}`;
  }

  isEnemyPiece(piece) {
    return piece.team != this.team;
  }
}

class Pawn extends BasePiece {
  getMovements() {
    let movements = [];

    if (this.team == "white") {
      // Reviso movimiento de una casilla hacia arriba
      let pieceExistsOneAbove = this.board.getPieceAt(
        this.row + 1,
        this.column
      );
      if (this.row < 8 && !pieceExistsOneAbove) {
        movements.push({
          row: this.row + 1,
          column: this.column,
        });
      }

      // Reviso movimiento de dos casillas hacia arriba
      if (!this.hasMoved && !pieceExistsOneAbove) {
        let pieceExistsTwoAbove = this.board.getPieceAt(
          this.row + 2,
          this.column
        );
        if (!pieceExistsTwoAbove) {
          movements.push({
            row: this.row + 2,
            column: this.column,
          });
        }
      }

      // Reviso si puedo comer una pieza del rival
      let pieceExistsDiagonalRight = this.board.getPieceAt(
        this.row + 1,
        moveColumn(this.column, 1)
      );
      if (
        pieceExistsDiagonalRight &&
        this.isEnemyPiece(pieceExistsDiagonalRight)
      ) {
        movements.push({
          column: moveColumn(this.column, 1),
          row: this.row + 1,
        });
      }
      let pieceExistsDiagonalLeft = this.board.getPieceAt(
        this.row + 1,
        moveColumn(this.column, -1)
      );
      if (pieceExistsDiagonalLeft && isEnemyPiece(pieceExistsDiagonalLeft)) {
        movements.push({
          column: moveColumn(this.column, -1),
          row: this.row + 1,
        });
      }
    } else {
      // Reviso movimiento de una casilla hacia abajo
      let pieceExistsOneBelow = this.board.getPieceAt(
        this.row + -1,
        this.column
      );
      if (this.row > 1 && !pieceExistsOneBelow) {
        movements.push({
          row: this.row - 1,
          column: this.column,
        });
      }

      // Reviso movimiento de dos casillas hacia abajo
      if (!this.hasMoved && !pieceExistsOneBelow) {
        let pieceExistsTwoBelow = this.board.getPieceAt(
          this.row - 2,
          this.column
        );
        if (!pieceExistsTwoBelow) {
          movements.push({
            row: this.row - 2,
            column: this.column,
          });
        }
      }

      // Reviso si puedo comer una pieza del rival

      let pieceExistsDiagonalRight = this.board.getPieceAt(
        this.row - 1,
        moveColumn(this.column, 1)
      );
      if (
        pieceExistsDiagonalRight &&
        pieceExistsDiagonalRight.team != this.team
      ) {
        movements.push({
          column: moveColumn(this.column, 1),
          row: this.row - 1,
        });
      }
      let pieceExistsDiagonalLeft = this.board.getPieceAt(
        this.row - 1,
        moveColumn(this.column, -1)
      );
      if (
        pieceExistsDiagonalLeft &&
        pieceExistsDiagonalLeft.team != this.team
      ) {
        movements.push({
          column: moveColumn(this.column, -1),
          row: this.row - 1,
        });
      }
    }

    return movements;
  }

  checkMoves(e) {
    let pieceSquare = getSquareByPosition(this.row, this.column);
    if (this.board.turn == this.team) {
      // Quito la clase selected a todas las piezas y se la agrego a la pieza actual
      normalizeSquares();
      pieceSquare.className = "square square--selected_piece";

      // ==================================================
      // Reviso que movimientos tengo disponibles
      // ==================================================
      var movements = this.getMovements();

      // Asigno funcion a cada movimiento posible
      movements.forEach((movement) => {
        let square = getSquareByPosition(movement.row, movement.column);
        square.className = "square square--posible_movement";
        square.onclick = (e) => {
          this.updatePosition(movement.row, movement.column);
          normalizeSquares();
          this.board.setNextTurn();
        };
      });
    } else {
      // Reviso si clickee en una pieza matable
      if (pieceSquare.classList.contains("square--posible_movement")) {
        pieceSquare.onclick();
      }
    }
  }
}
