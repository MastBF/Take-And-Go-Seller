import './App.css';
import { useRoutes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import App from './App';

function Root() {
  const element = useRoutes([

    {
      path: '/',
      element: <LoginPage />,
    },
    {
        path: '/orders', 
        element: <App/>
    }
  ]);

  return <div className="App">{element}</div>;
}

export default Root;