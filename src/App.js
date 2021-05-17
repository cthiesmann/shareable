import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'
import { Room } from './features/room/Room'
import Readable from 'readable-url-names'
import './App.css'

function App() {
	const generator = new Readable()

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path='/:roomId'>
						<Room/>
					</Route>
					<Route path='/'>
						<Redirect to={{ pathname: '/' + generator.generate() }} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App
