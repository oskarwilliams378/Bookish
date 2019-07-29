import React, { useState, useEffect } from 'react';
import './bookList.css'
import axios from 'axios';


function BookList() {

    let [books, setBooks] = useState('Loading');

    useEffect(()=>{
        axios.get('http://localhost:3001/book', {params: {token: window.localStorage.getItem('Authentication_Token')}})
            .then(bookList => setBooks(bookList.data))
    },[])
    

    if (books !== 'Loading'){
        return (
            <table className='bookList'>
                <tbody>
                    {books.map(book => (<tr key={book.id}>
                        <td className='title'><p className='category'>Title</p><p className='data'>{book.title}</p></td>
                        <td className='author'><p className='category'>Author</p><p className='data'>{book.bookauthor.author.fullname}</p></td>
                        </tr>
                        ))}
                </tbody>
            </table>
        )

    }

    return (
        <p>Loading</p>
        )

}


export default BookList