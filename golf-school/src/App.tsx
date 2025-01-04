import './App.css'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { MainPage } from './pages/main';
import "./App.css"
import { RegisterPage } from './pages/register';
import { GateLayout } from './components/gateLayout/gateLayout';

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/gate" element={<GateLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/home" element={<MainPage />}/>
      </Routes>
    </HashRouter>
  )
}

export default App
