import './App.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { MainPage } from './components/layout/mainLayout';
import "./App.css";
import { RegisterPage } from './pages/register';
import { GateLayout } from './components/gateLayout/gateLayout';
import { ProtectRouter } from './components/layout/protectRouter';
import { AppLayout } from './components/layout/appLayout';

function App(): JSX.Element {

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/gate" element={<GateLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path='/' element={<ProtectRouter />}>
          <Route index element={<Navigate to="/home" replace />} />
            <Route
              path="home"
              element={<MainPage />}>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default App;
