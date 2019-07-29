import React from 'react';
import './addBook.css'
import axios from 'axios';


class addBook extends React.Component{
    constructor() {
        super();
        this.state = {title: '', isbn: '', edition: '', authorId: ''}

        this.formSubmit = this.formSubmit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.isbnChange = this.isbnChange.bind(this);
        this.editionChange = this.editionChange.bind(this);
        this.authorIdChange = this.authorIdChange.bind(this);
    }

    formSubmit() {
        axios.post('http://localhost:3001/book/add', this.state, {params: {token: window.localStorage.getItem('Authentication_Token')}}) //// WWWWWHHHHHHYYYYYYYY
    }
    
    titleChange(event) {
        this.setState({title: event.target.value, isbn: this.state.isbn, edition: this.state.edition, authorId: this.state.authorId})
    }

    isbnChange(event) {
        this.setState({title: this.state.title, isbn: event.target.value, edition: this.state.edition, authorId: this.state.authorId})
    }

    editionChange(event) {
        this.setState({title: this.state.title, isbn: this.state.isbn, edition: event.target.value, authorId: this.state.authorId})
    }

    authorIdChange(event) {
        this.setState({title: this.state.title, isbn: this.state.isbn, edition: this.state.edition, authorId: event.target.value})
    }
    

    render() {
        return(
    <form onSubmit={this.formSubmit}>
    
        <label htmlFor="title"><b>Title</b></label>
        <input type="text" placeholder="Enter Title" value={this.state.title} onChange={this.titleChange} required />

        <label htmlFor="isbn"><b>ISBN</b></label>
        <input type="text" placeholder="Enter ISBN" value={this.state.isbn} onChange={this.isbnChange} required />

        <label htmlFor="edition"><b>Edition</b></label>
        <input type="text" placeholder="Enter Edition" value={this.state.edition} onChange={this.editionChange} />

        <label htmlFor="authorId"><b>Author ID</b></label>
        <input type="number" placeholder="Enter Author ID" value={this.state.authorId} onChange={this.authorIdChange} required />

        <button type="submit">Add Book</button>
    
    </form>
    )  
        } 
}

export default addBook