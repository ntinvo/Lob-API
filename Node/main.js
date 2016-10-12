import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
	render() {
		return (
			<div className="container">
				<Inputs />
			</div>
		);
	}
}


class Inputs extends React.Component {

	render() {
		const style = {
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
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="Address line 2" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="City" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="State" />
					
					<input style={ inputStyle } type="text" required="true" className="form-control" placeholder="Zipcode" />

					<textarea style={ inputStyle } className="form-control" required="true" rows="7" placeholder="Message to the legislator ..."></textarea>
					
					<div style={ style }>
						<button type="submit" className="btn btn-primary">Send</button>
					</div>
				</form>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));