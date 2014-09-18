/** @jsx React.DOM */
app = app || {};
app.FloodView = (function(React) {
	var FloodView = {};
	FloodView.Element = React.createClass({
		render: function() {
			var classes = "flood-element " + this.props.color;
			return (<div className={classes} onClick={this.handleClick}></div>);
		},
		handleClick: function() {
			if (this.props.flood.makeMove(this.props.row, this.props.col)) {
				this.props.onMove();
			}
		}
	});

	FloodView.Row = React.createClass({
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
			return (<div className="flood-row">{rowElements}</div>);
		}
	});

	FloodView.Board = React.createClass({
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
			return (<div className="flood-board">{rows}</div>);
		}
	});

	FloodView.Status = React.createClass({
		render: function() {
			var stepInfo = this.props.flood.getStepInfo();
			var steps = stepInfo.step + ' / ' + stepInfo.expectedSteps;
			var stepClasses = ((stepInfo.step > stepInfo.expectedSteps) ? 'red-text' : '');
			var recordMessage = "Record: " + stepInfo.record + " steps";
			var finishMessage = "Well done!";
			return (
				<div className="flood-status">
					<span className={stepClasses}>{steps}</span>
					<img src='img/restart.svg' className="flood-status-button" onClick={this.handleRestart}></img>
					<div>{stepInfo.record ? (<span>{recordMessage}</span>) : null}</div>
					<div>{stepInfo.isFinished ? (<span>{finishMessage}</span>) : null}</div>
				</div>
			);
		},
		handleRestart: function() {
			this.props.onRestart();
		}
	});

	FloodView.Game = React.createClass({
		getInitialState: function() {
			return { 'flood': this.props.game };
		},
		render: function() {
			return (
				<div className="game flood">
					<FloodView.Board flood={this.state.flood} onMove={this.handleMove}/>
					<FloodView.Status flood={this.state.flood} onRestart={this.handleRestart}/>
				</div>
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