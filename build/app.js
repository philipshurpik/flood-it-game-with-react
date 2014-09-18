/** @jsx React.DOM */
var app = app || {};
if (!app.Flood || !app.FloodView) {
	throw new Error("Can't find Flood Game!");
}

app.GameView = (function (React, InnerGameView) {
	var GameView = React.createClass({displayName: 'GameView',
		getInitialState: function() {
			return { backgroundColor: 'white' };
		},
		render: function() {
			var wrapperClass = "game-wrapper " + this.state.backgroundColor;
			return (
				React.DOM.div({className: wrapperClass}, 
					InnerGameView.Game({game: this.props.game, onUpdate: this.handleUpdate})
				)
			);
		},
		handleUpdate: function(properties) {
			this.setState({
				backgroundColor: properties.backgroundColor
			});
		}
	});
	return GameView;
})(React, app.FloodView);

(function(React, GameView, Flood) {
	Flood.init();
	React.renderComponent(GameView({game: Flood}), document.getElementById('main'));
})(React, app.GameView, app.Flood);
