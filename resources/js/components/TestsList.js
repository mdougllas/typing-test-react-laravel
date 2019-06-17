import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default class TestsList extends Component {
    constructor ( props ) {
        super ( props );
        this.state = {
            tests: [],
        };
    }

    componentDidMount(){
        axios.get('/api/tests').then(response => {
            this.setState({
                tests: response.data
            })
        })
    }

    render() {
        const { tests } = this.state
        return (
            <div className='container text-center'>
                <div className='card margin-bottom'>
                    <div className='card-header'>Congratulation. You finished the test. These are all recorded results.</div>
                    <div className='card-body'>
                        <div>
                            {tests.map((elem, idx) => (
                                <div key={idx+1}>
                                    <span >Name: { elem.name } | </span>
                                    <span> Time (seconds): { elem.time } | </span>
                                    <span> Errors: { elem.errors } </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Link to='/'><button className = "margin-bottom-large">GO BACK TO THE TEST</button></Link>
          </div>
        );
    }
}

if (document.getElementById('tests-list')) {
    ReactDOM.render( <TestsList />, document.getElementById('test-list'));
}
