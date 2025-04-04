import { Link } from 'react-router'

const Home = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded shadow-md flex gap-5'>
        <Link to="/customer-registration" className="text-white bg-blue-400 p-2">Customer Registration</Link>
        <Link to="/admin-registration" className="text-white bg-blue-400 p-2">Admin Registration</Link>
        </div>
    </div>
  )
}

export default Home