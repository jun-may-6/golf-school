// import './App.css';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './layouts/MainLayout';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectRouter } from './layouts/ProtectRouter';
import { AppLayout } from './layouts/AppLayout';
import { FindPasswordPage } from './pages/FindePasswordPage';
import { GateLayout } from './layouts/GateLayout';
import { FindUserIdPage } from './pages/FindUserIdPage';

function App(): JSX.Element {

  return (
    <div className='mobile-view'>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/gate" element={<GateLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="find-id" element={<FindUserIdPage />} />
              <Route path="find-pwd" element={<FindPasswordPage />} />
            </Route>
            <Route path='/' element={<ProtectRouter />}>
              <Route path='/' element={<MainPage />} >
              <Route path='schedule/:id' element={<></>} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </div>
  );
}
export default App;
