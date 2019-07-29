import React from 'react';
import axios from 'axios';

class login extends React.Component{
    constructor() {
        super();
        this.state = {username: '', password: ''}

        this.formSubmit = this.formSubmit.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }

    formSubmit(event) {
        event.preventDefault()
        axios.post('http://localhost:3001/user/login', this.state) //// WWWWWHHHHHHYYYYYYYY
            .then(token => {
                window.localStorage.setItem('Authentication_Token', token.data)
                this.setState({username: '', password: ''})
            });

    }
    
    usernameChange(event) {
        this.setState({username: event.target.value, password: this.state.password})
    }

    passwordChange(event) {
        this.setState({username: this.state.username, password: event.target.value})
    }

    

    render() {
        return(
        <form onSubmit={this.formSubmit}>
    
            <label htmlFor="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" value={this.state.username} onChange={this.usernameChange} required />
        
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" value={this.state.password} onChange={this.passwordChange} required />
        
            <button type="submit">Login</button>
          
      </form>
    )  
        } 
}

export default login