import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashborad from './components/dashborad'
import Create from './components/create.jsx'
import Update from './components/update.jsx'
import View from './components/View.jsx'
import LoginSign from './loginSign.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginSign/>}/>
        <Route path='/dashborad' element={<Dashborad/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path='/view/:id' element={<View/>}/>
        <Route path='/update/:id' element={<Update/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App