import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './Header'
import TypingForm from './TypingForm'
import TestsList from './TestsList';

class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <div>
                    <Header />
                    <Switch>
                        <Route exact path='/' component={TypingForm} />
                        <Route exact path='/all' component={TestsList} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
if (document.getElementById('app')) {
    ReactDOM.render( <App />, document.getElementById('app'));
}
