import store from '@redux/store'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
