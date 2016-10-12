import React from 'react';
import ReactDOM from 'react-dom';

'use strict';

var lobFactory = require('./lib/index.js');

class App extends React.Component {
	render() {
		return (
			<div className="container">
				<Logo />
				<Inputs />
			</div>
		);
	}
}

class Logo extends React.Component {
	render() {
		return (
			<div>
				<img className="img-responsive center-block" src="img/Lob-Logo.png" alt="Lob Logo" />
			</div>
		);
	}
}

class Inputs extends React.Component {
	render() {
		const buttonStyle = {
			textAlign: 'center',
			paddingTop: '20px'
		};
		const inputStyle = {
			marginTop: '20px'
		};
		return (
			<div>
				<form>
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="Name"  />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="Address line 1" />
					
					<input style={ inputStyle } type="text" className="form-control" placeholder="Address line 2 (optional)" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="City" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="State" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="Zipcode" />

					<textarea style={ inputStyle } className="form-control" required="true" rows="5" placeholder="Message to the legislator ..."></textarea>
					
					<div style={ buttonStyle }>
						<button type="submit" className="btn btn-primary">Send</button>
					</div>
				</form>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));