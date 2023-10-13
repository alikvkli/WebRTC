import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Provider } from 'react-redux';
import { store } from './store';
//import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    {/* <PersistGate persistor={persistor} loading={null}> */}
      <RouterProvider router={router} />
    {/* </PersistGate> */}
  </Provider>
);