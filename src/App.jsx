
import './App.css'
import { Routes,Route } from 'react-router-dom';
import Photos from './Photos';
import Captcha from './Captcha';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Captcha/>}/>
        <Route path="/photos" element={<ProtectedRoute><Photos/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
