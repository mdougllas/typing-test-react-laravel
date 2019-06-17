import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Header extends Component {
    render() {
        return (
            <section className="jumbotron text-center">
                <div className="container">
                    <h1 className="display-4">
                        Welcome to the Typing Test
                    </h1>
                    <h2 className="margin-bottom">Assessment for Vohra</h2>
                </div>
            </section>
        );
    }
}

if (document.getElementById('header')) {
    ReactDOM.render(<Header />, document.getElementById('header'));
}
