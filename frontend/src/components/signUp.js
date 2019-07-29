import React from 'react';
import axios from 'axios';


class signUp extends React.Component{
    constructor() {
        super();
        this.state = {username: '', password: '', fullname: ''}

        this.formSubmit = this.formSubmit.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.fullnameChange = this.fullnameChange.bind(this);
    }

    formSubmit() {
        axios.post('http://localhost:3001/user/signup', this.state) //// WWWWWHHHHHHYYYYYYYY
    }
    
    usernameChange(event) {
        this.setState({username: event.target.value, password: this.state.password, fullname: this.state.fullname})
    }

    passwordChange(event) {
        this.setState({username: this.state.username, password: event.target.value, fullname: this.state.fullname})
    }

    fullnameChange(event) {
        this.setState({username: this.state.username, password: this.state.password, fullname: event.target.value})
    }

    

    render() {
        return(
        <form onSubmit={this.formSubmit}>
    
            <label htmlFor="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" value={this.state.username} onChange={this.usernameChange} required />
        
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" value={this.state.password} onChange={this.passwordChange} required />
        
            <label htmlFor="name"><b>Full Name</b></label>
            <input type="text" placeholder="Enter Full Name" value={this.state.fullname} onChange={this.fullnameChange} required />
        
            <button type="submit">Create User</button>
          
      </form>
    )  
        } 
}

export default signUp