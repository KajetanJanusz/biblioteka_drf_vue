import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen'; 
import RegisterScreen from './screens/RegisterScreen'; 
import LogoutScreen from './screens/LogoutScreen'; 
import DashboardCustomer from './screens/DashboardCustomer'; 
import DashboardEmployee from './screens/DashboardEmployee'; 
import ManageUsers from './screens/ManageUsers'; 
import AddUser from './screens/AddUser'; 
import AddBook from './screens/AddBook'; 
import DetailsUsers from './screens/DetailsUsers'; 
import ListBooks from './screens/ListBooks'; 
import DetailsBook from './screens/DetailsBook'; 
import DetailsBookEmployee from './screens/DetailsBookEmployee'; 
import ManageBooks from './screens/ManageBooks'; 
import ReturnBook from './screens/ReturnBook'; 
import ReturnApprove from './screens/ReturnApprove'; 
import EditBook from './screens/EditBook';

const App = () => { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard-customer" element={<DashboardCustomer />} />
        <Route path="/dashboard-employee" element={<DashboardEmployee />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/user/:userId" element={<DetailsUsers />} />
        <Route path="/books" element={<ListBooks />} />
        <Route path="/book/:bookId" element={<DetailsBook />} />
        <Route path="/book-employee/:bookId" element={<DetailsBookEmployee />} />
        <Route path="/manage-books" element={<ManageBooks />} />
        <Route path="/return-book/:rentalId" element={<ReturnBook />} />
        <Route path="/return-approve/:rentalId" element={<ReturnApprove />} />
        <Route path="/edit-book/:bookId" element={<EditBook />} />
      </Routes>
    </Router>
  ); 
};

export default App;