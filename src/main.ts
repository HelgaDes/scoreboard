import '@/styles/reset.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tokens.css';
import './styles/typography.css'
import './styles/global.css'
import { setAuthService, createHttpAuthService, createMockAuthService } from '@/services/auth'
import { ENV } from '@/env'

const app = createApp(App)
setAuthService(ENV.USE_MOCK ? createMockAuthService() : createHttpAuthService(ENV.API_BASE_URL))
app.use(router).mount('#app')