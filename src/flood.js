var app = app || {};
app.Flood = (function(localStorage) {
	var colors = ["red", "orange", "yellow", "green", "blue", "violet"];
	var dimension = 14;
	var table = null, state = null;

	function State(init) {
		init = init || {};
		this.currentColor = init.currentColor || 0;
		this.step = init.step || 0;
		this.expectedSteps = init.expectedSteps || 25;
		this.record = init.record || null;
		this.isFinished = init.isFinished || false;
	}
	State.prototype.getBackGroundColor = function() {
		return colors[this.currentColor];
	};

	function createTable(dimension) {
		var table = new Array(dimension);
		for (var i = 0; i < dimension; i++) {
			table[i] = new Array(dimension);
			for (var j = 0; j < dimension; j++) {
				table[i][j] = {
					color: Math.floor((Math.random() * colors.length)),
					isCaught: false
				}
			}
		}
		table[0][0].isCaught = true;
		return table;
	}

	function save() {
		localStorage.setItem('floodState', JSON.stringify(state));
		localStorage.setItem('floodTable', JSON.stringify(table));
	}

	function catchNew(row, col, newColor) {
		var caughtElements = 0;
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (table[i][j].isCaught) {
					if (i > 0) {
						var up = table[i - 1][j];
						if (up.color === newColor) {
							up.isCaught = true;
						}
					}
					if (i < (dimension - 1)) {
						var down = table[i + 1][j];
						if (down.color == newColor) {
							down.isCaught = true;
						}
					}
					if (j > 0) {
						var left = table[i][j - 1];
						if (left.color == newColor) {
							left.isCaught = true;
						}
					}
					if (j < (dimension - 1)) {
						var right = table[i][j + 1];
						if (right.color == newColor) {
							right.isCaught = true;
						}
					}
					table[i][j].color = newColor;
					caughtElements++;
				}
			}
		}
		return caughtElements;
	}

	function init() {
		var localState = JSON.parse(localStorage.getItem('floodState'));
		var localTable = JSON.parse(localStorage.getItem('floodTable'));
		start(localState, localTable);
	}

	function reStart() {
		start({record: state.record});
	}

	function start(localState, localTable) {
		state = new State(localState);
		table = localTable || createTable(dimension);
		state.currentColor = table[0][0].color;
		save();
	}

	function getElementColor(row, col) {
		return colors[table[row][col].color];
	}

	function getStepInfo() {
		return state;
	}

	function makeMove(row, col) {
		var newColor = table[row][col].color;
		if (newColor !== state.currentColor) {
			var caughtElements = catchNew(row, col, newColor);
			state.currentColor = newColor;
			state.step++;
			if (caughtElements === dimension * dimension) {
				state.isFinished = true;
				state.record = (state.record && state.record < state.step) ? state.record : state.step;
			}
			save();
			return true;
		}
	}

	return {
		dimension: dimension,
		init: init,
		restart: reStart,
		makeMove: makeMove,
		getElementColor: getElementColor,
		getStepInfo: getStepInfo
	};
})(localStorage);