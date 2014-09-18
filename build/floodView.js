/** @jsx React.DOM */
app = app || {};
app.FloodView = (function(React) {
	var FloodView = {};
	FloodView.Element = React.createClass({displayName: 'Element',
		render: function() {
			var classes = "flood-element " + this.props.color;
			return (React.DOM.div({className: classes, onClick: this.handleClick}));
		},
		handleClick: function() {
			if (this.props.flood.makeMove(this.props.row, this.props.col)) {
				this.props.onMove();
			}
		}
	});

	FloodView.Row = React.createClass({displayName: 'Row',
		render: function() {
			var rowElements = [];
			var dimension = this.props.flood.dimension;
			var rowNumber = this.props.rowNumber;
			for (var j = 0; j < dimension; j++) {
				rowElements.push(FloodView.Element({
					flood: this.props.flood,
					color: this.props.flood.getElementColor(rowNumber, j),
					row: rowNumber,
					col: j,
					onMove: this.props.onMove,
					key: rowNumber.toString() + j
				}));
			}
			return (React.DOM.div({className: "flood-row"}, rowElements));
		}
	});

	FloodView.Board = React.createClass({displayName: 'Board',
		render: function() {
			var rows = [];
			var dimension = this.props.flood.dimension;
			for (var i = 0; i < dimension; i++) {
				rows.push(FloodView.Row({
					flood: this.props.flood,
					rowNumber: i,
					onMove: this.props.onMove,
					key: i
				}));
			}
			return (React.DOM.div({className: "flood-board"}, rows));
		}
	});

	FloodView.Status = React.createClass({displayName: 'Status',
		render: function() {
			var stepInfo = this.props.flood.getStepInfo();
			var steps = stepInfo.step + ' / ' + stepInfo.expectedSteps;
			var stepClasses = ((stepInfo.step > stepInfo.expectedSteps) ? 'red-text' : '');
			var recordMessage = "Record: " + stepInfo.record + " steps";
			var finishMessage = "Well done!";
			return (
				React.DOM.div({className: "flood-status"}, 
					React.DOM.span({className: stepClasses}, steps), 
					React.DOM.img({src: "img/restart.svg", className: "flood-status-button", onClick: this.handleRestart}), 
					React.DOM.div(null, stepInfo.record ? (React.DOM.span(null, recordMessage)) : null), 
					React.DOM.div(null, stepInfo.isFinished ? (React.DOM.span(null, finishMessage)) : null)
				)
			);
		},
		handleRestart: function() {
			this.props.onRestart();
		}
	});

	FloodView.Game = React.createClass({displayName: 'Game',
		getInitialState: function() {
			return { 'flood': this.props.game };
		},
		render: function() {
			return (
				React.DOM.div({className: "game flood"}, 
					FloodView.Board({flood: this.state.flood, onMove: this.handleMove}), 
					FloodView.Status({flood: this.state.flood, onRestart: this.handleRestart})
				)
			);
		},
		componentDidMount: function() {
			this.updateBackGround();
		},
		handleMove: function() {
			this.setState({"flood": this.props.game });
			this.updateBackGround();
		},
		handleRestart: function() {
			this.props.game.restart();
			this.setState({"flood": this.props.game });
			this.updateBackGround();
		},
		updateBackGround: function() {
			var stepInfo = this.props.game.getStepInfo();
			var backGroundColor = stepInfo.getBackGroundColor();
			this.props.onUpdate({ backgroundColor: backGroundColor });
		}
	});
	return FloodView;
})(React);