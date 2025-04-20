import './assets/main.css'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyCeG_RE2bhnWPGvC8F2aGZPSh1fxOBYVx4',
  authDomain: 'interviews-20701.firebaseapp.com',
  projectId: 'interviews-20701',
  storageBucket: 'interviews-20701.firebasestorage.app',
  messagingSenderId: '463329778528',
  appId: '1:463329778528:web:eb46cf02944e5c60a19c05',
}
initializeApp(firebaseConfig)

const app = createApp(App)
app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('app-menubar', Menubar)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-button', Button)
app.component('app-progress-spinner', ProgressSpinner)

app.mount('#app')
