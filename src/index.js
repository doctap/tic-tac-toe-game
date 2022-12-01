import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className='square' onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
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
	constructor(props) {
		super(props);
		this.name1 = props.name1 || 'X';
		this.name2 = props.name2 || 'O';
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Перейти к ходу #' + move :
				'К началу игры';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		});

		let status;
		if (winner === 'X') {
			status = 'Выиграл ' + this.name1;
		} else if (winner === 'O') {
			status = 'Выиграл ' + this.name2;
		} else {
			status = 'Следующий ход: ' + (this.state.xIsNext ? this.name1 : this.name2);
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(getGameBoards());

function getGameBoards() {
	const gamers = prompt('Введите игроков через пробел!').split(' ');
	return (
		<div className='main'>
			{getMatrix(gamers, 2).map(p => <Game name1={p[0]} name2={p[1]} />)}
		</div>
	)
}

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

function getMatrix(a, splitter) {
	let matrix = [], i, k;

	for (i = 0, k = -1; i < a.length; i++) {
		if (i % splitter === 0) {
			k++;
			matrix[k] = [];
		}
		matrix[k].push(a[i])
	}
	return matrix;
}