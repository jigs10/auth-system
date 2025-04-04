import './App.css'
import AdminRegistration from './pages/AdminRegistration'
import CustomerRegistration from './pages/CustomerRegistration'
import { Routes, Route } from "react-router";
import Home from './pages/Home';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/customer-registration' element={    <CustomerRegistration/>}/>
<Route path='/admin-registration' element={<AdminRegistration/>}/>
    
    </Routes>
  )
}

export default App
