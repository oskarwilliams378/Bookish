import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import AddBook from './components/addBook';
import AddAuthor from './components/addAuthor';
import BookList from './components/bookList';
import SignUp from './components/signUp';
import Login from './components/login';


function App() {
  return (
    <Router>
    <div className="App">
        <nav>
          <ul className='navigation'>
            <li> <Link to='/'>Books</Link> </li>
            <li> <Link to='/add/'>Add Book</Link> </li>
            <li> <Link to='/author/'>Add Author</Link> </li>
            <li> <Link to='/login/'>Login</Link> </li>
            <li> <Link to='/signup/'>Sign Up</Link> </li>
          </ul>
        </nav>
      
      <Route path='/' exact component={BookList} />
      <Route path='/add/' component={AddBook} />  
      <Route path='/author/' component={AddAuthor} />  
      <Route path='/signup/' component={SignUp} />    
      <Route path='/login/' component={Login} />
    </div>
    </Router>
  );
}

export default App;
