import React from 'react';
import axios from 'axios';


class addAuthor extends React.Component{
    constructor() {
        super();
        this.state = {title: '', isbn: '', edition: '', authorId: ''}
        this.formSubmit = this.formSubmit.bind(this);
        this.nameChange = this.nameChange.bind(this);
    }

    formSubmit() {
        axios.post('http://localhost:3001/author/add', this.state, {params: {token: window.localStorage.getItem('Authentication_Token')}}) //// WWWWWHHHHHHYYYYYYYY
    }
    
    nameChange(event) {
        this.setState({name: event.target.value})
    }
    

    render() {
        return(
    <form onSubmit={this.formSubmit}>
    
        <label htmlFor="fullname"><b>Name</b></label>
        <input type="text" placeholder="Enter Name" value={this.state.name} onChange={this.nameChange} required />

        <button type="submit">Add Author</button>
    
    </form>
    )  
        } 
}

export default addAuthor