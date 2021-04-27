import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      selectedMark: null,
      validMoves: [
        [1,3,4], [0,2,3,4,5], [1,4,5],
        [0,1,4,6,7], [0,1,2,3,5,6,7,8], [1,2,4,7,8],
        [3,4,7], [3,4,5,6,8], [4,5,7]
      ],
      log: ''
    };
  }

  handleClick(i) {
    console.log("Selected: "+i)
    const squares = this.state.squares.slice();
    let numberOfMarks = 0
    for (let j = 0; j < 9; j++) {
      if (squares[j]) {
        numberOfMarks++
      }
    }
    const mark = this.state.xIsNext ? 'X' : 'O'
    if (numberOfMarks === 6) {            //moving mark (second step or first step)
      console.log("===================================")
      if (!this.state.selectedMark && this.state.selectedMark !== 0) {     //have not selected mark to move yet
        if (mark === squares[i]) {        //valid selection
          this.setState({selectedMark: i})
          console.log("Selected: "+i+" of mark "+mark)
          this.setState({log: mark+' selected the mark in block#'+i+' to move'})
        }
        else {
          alert('INVALID SELECTION')
          return
        }
      }
      else {                                        //have selected the mark to move
        const tempSquare = squares.slice()
        tempSquare[this.state.selectedMark] = null
        tempSquare[i] = mark
        if (calculateWinner(tempSquare)) {          //if won the game
          this.setState({squares: tempSquare})
          alert(mark+' WIN!')
          return
        }
        else if (this.state.selectedMark !== 4 && this.state.squares[4] === mark) {  //if has center but not moving center
          alert('INVALID MOVE: You must move center mark')
          this.setState({selectedMark: null})
          return
        }
        else if (!this.state.validMoves[this.state.selectedMark].includes(i) || squares[i] !== null) {
          alert('INVALID MOVE')
          return
        }
        else {  //valid move
          this.setState({
            squares: tempSquare, 
            xIsNext: !this.state.xIsNext, 
            selectedMark: null})
        }
        this.setState({log: mark+' moved the mark to block#'+i})
      }
    }
    else {
      if (!squares[i]) {
        squares[i] = mark
        if (calculateWinner(squares)) {
          alert(mark+' WIN!')
        }
        this.setState({
          squares: squares,
          xIsNext: !this.state.xIsNext,
        })
        this.setState({log: mark+' placed a mark in block#'+i})
      }
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="status">{this.state.log}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
