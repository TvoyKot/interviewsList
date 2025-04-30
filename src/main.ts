import './assets/main.css'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice';
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Toast from 'primevue/toast';
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import Message from 'primevue/message';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import RadioButton from 'primevue/radiobutton';



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
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('app-menubar', Menubar)
app.component('app-input-text', InputText)
app.component('app-input-number', InputNumber)
app.component('app-toast', Toast)
app.component('app-button', Button)
app.component('app-radio-button', RadioButton)
app.component('app-progress-spinner', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-float-label', FloatLabel)
app.component('app-textarea', Textarea)
app.component('app-calendar', DatePicker)
app.mount('#app')
