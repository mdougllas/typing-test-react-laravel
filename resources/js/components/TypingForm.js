import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

var handlers = require('react-handlers');

const
    textsToType =
        [
            "This is a very fast typing test. Intuitive, clever and user friendly.",
            "Very good! Now keep practicing. You have to keep going and doing a great job!",
            "This test is very useful if you want to get better with your typing skills.",
            "Don't stop, no! You can't stop while you're practicing typing on the computer!",
            "Are you tired already? Ok, let's finish the test right now."
        ]
;

let
    n = 0,
    renderingArray = [],
    typed,
    errors = 0,
    iteration = 0,
    finished = false,
    timeStarted = false
;

export default class TypingForm extends Component {
    constructor ( props ) {
        super ( props );
        this.state = {
            name: '',
            value: '',
            iteration: iteration,
            expected: '',
            textArray: '',
            time: 0,
            errors: errors,
            redirect: false,
            loading: true,
            show: true,
        }
        this.handleChange = this.handleChange.bind ( this )
        this.handleErrors = this.handleErrors.bind ( this )
        this.handleKeys = this.handleKeys.bind ( this )
        this.handleMouseTypingBox = this.handleMouseTypingBox.bind ( this )
        this.handleMouseNameBox = this.handleMouseNameBox.bind ( this )
        this.handleName = this.handleName.bind ( this );
        this.validateName = this.validateName.bind ( this );
        this.stickFocus = this.stickFocus.bind ( this )
        this.textInput = React.createRef ()
        this.nameInput = React.createRef ()
    }

    firstRender(){
        renderingArray = this.createTextToType(this.handleTextsToType())
        this.setState({loading: false, expected: renderingArray[n].letter, textArray: renderingArray})
    }

    startTimer() {
        if (!timeStarted){
            this.timer = setInterval(() => this.setState({
                time: this.state.time + 1
            }), 1000)
            timeStarted = true
        }
    }

    stopTimer() {
        clearInterval(this.timer)
        timeStarted = false;
    }

    resetTimer() {
        this.setState({time: 0})
    }

    createTextToType(str){
        let arr = str.split("")
        let newArr = arr.map((e, i) => {
            let obj = {}
            obj.letter = e
            obj.color = 'white'
            return obj
        })
        return newArr
    }

    handleTextsToType() {
        return textsToType[this.state.iteration]
    }

    handleName ( event ) {
        this.setState({ name: event.target.value })
    }

    validateName () {
        if ( this.state.name.length < 3 ) {
            this.nameInput.current.focus()
        }
    }

    handleMouseTypingBox( event ) {
        event.preventDefault()
        this.textInput.current.focus()
    }

    handleMouseNameBox( event ) {
        event.preventDefault()
        this.nameInput.current.focus()
    }

    stickFocus () {
        this.textInput.current.focus()
    }

    handleChange ( event ) {
        this.startTimer()
        this.setState({ value: event.target.value })
    }

    handleKeys (event) {
        typed = event.key

        if(finished) {
            event.preventDefault()
            n = 0
            renderingArray = this.createTextToType(this.handleTextsToType())
            this.setState({value: '', expected: renderingArray[0].letter, textArray: renderingArray})
            finished = false
        }

        if(this.state.value.length === renderingArray.length && event.key !== 'Backspace'){
            event.preventDefault()
        }

        if(this.state.value.length === n && n < renderingArray.length){
            this.setState({expected: renderingArray[this.state.value.length].letter })
        }

        if(event.key === 'Backspace' && this.state.value.length > 0 && this.state.value.length <= renderingArray.length){
            renderingArray[this.state.value.length - 1].color = 'white'
            n = this.state.value.length - 1
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Home'){
            event.preventDefault ( )
            alert('Invalid key. Please try again.')
        }
    }

    handleErrors() {
        this.setState({textArray: renderingArray})
        if (typed === this.state.expected && this.state.value.length <= renderingArray.length){

            if(this.state.value.length === renderingArray.length - 1){
                if(this.state.iteration === textsToType.length - 1 ){
                    this.stopTimer()
                    this.setState({iteration:0, redirect: true})

                    const test = {
                        name: this.state.name,
                        time: this.state.time,
                        errors: this.state.errors
                    }
                    axios.post('/api/tests', test)
                        .then(response => {
                        })
                        .catch(error => {
                        })

                } else {
                    this.stopTimer()
                    iteration ++;
                    this.setState({value: "Congratulations! Press any key when you're ready for the next text.", iteration: iteration})
                    finished = true;
                }
            }

            n++;
            this.setState({expected: renderingArray[this.state.value.length].letter })
            renderingArray[this.state.value.length].color = 'green'

        } else if (typed !== 'Backspace') {
            errors ++;
            this.setState({expected: null })
            this.setState({errors: errors})
        }
    }

    renderingTextToType(){
        let textToType = this.state.textArray
        let renderingText =
            <div className="badge badge-primary big margin-bottom width">
                { textToType.map((item, index) => {
                    return <span key = { index + 1 } className={ item.color }>{ item.letter }</span>
                })}
            </div>
        ;
        return renderingText;
    }

    renderRedirect() {
        if (this.state.redirect) {
          window.location.href = '/all'
        }
    }

    componentDidMount(){
        this.firstRender()
    }

    render() {
        if(this.state.loading){
            return '<h1 className="content text-center">Loading...</h1>'
        }
        return (
            <div className="container-fluid text-center">
                <div className = "container margin-bottom-large">
                <h3 className="lead">
                    This Typing Test will test your accuracy and speed while typing. Your test will start when you start typing the highlighted text in the Typing Box. You will have limited access to your keyboard's keys and your mouse. You only need to use the letter keys and the backspace to correct errors. Between each step of the test, you may take a break for as long as you like. The timer will start only when you start typing. Your time and number of errors are displayed below. At the end you will see all registered results.
                </h3>
                </div>
                <h3>Enter your full name and press the TAB key</h3>
                <div className = "container">
                    <input ref = { this.nameInput } autoFocus = { true } className = "form-control form-control-lg text-center margin-bottom" type = "text" placeholder = "Enter your full name and press TAB" value = { this.state.name } onChange = { this.handleName } onPointerDown = { this.handleMouse } required = { true } minLength = { 3 } onBlur = { this.validateName } />
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <h2>Type the text below in the Typing Box</h2>
                        <div>
                            { this.renderingTextToType() }
                        </div>
                    </div>
                </div>
                <div className="container margin-bottom">
                    {this.renderRedirect()}
                    <input autoComplete="off" ref = { this.textInput } name = "typing-box" className = "form-control form-control-lg text-center" type = "text" placeholder = "Typing Box. Type the highlighted text here." value = { this.state.value } onChange = { handlers(this.handleChange, this.handleErrors) } onKeyDown = { this.handleKeys } onPointerDown = { this.handleMouseTypingBox } onBlur = { this.stickFocus } />
                </div>
                <div className="container text-center">
                    <h3>Timer (seconds): { this.state.time }</h3>
                </div>
                <div className="container text-center">
                    <h3>Errors: {this.state.errors}</h3>
                </div>
            </div>
        );
    }
}

if (document.getElementById('typing-form')) {
    ReactDOM.render( <TypingForm />, document.getElementById('typing-form'))
}
