const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Import components
const App = {
  template: `
    <div>
      <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item is-size-5 has-text-weight-bold">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-dumbbell"></i></span>
              <span>FitTrack</span>
            </span>
          </router-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <router-link to="/" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-home"></i></span>
                <span>Home</span>
              </span>
            </router-link>
            <router-link to="/dashboard" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-chart-line"></i></span>
                <span>Dashboard</span>
              </span>
            </router-link>
            <router-link to="/activities" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-list"></i></span>
                <span>Activities</span>
              </span>
            </router-link>
            <router-link to="/friends" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-users"></i></span>
                <span>Friends</span>
              </span>
            </router-link>
            <router-link to="/admin" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-cog"></i></span>
                <span>Admin</span>
              </span>
            </router-link>
            <div class="navbar-item">
              <button class="button is-danger is-light" @click="logout">
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <router-view></router-view>
    </div>
  `,
  methods: {
    logout() {
      console.log('Logout clicked');
      // Will implement in next step
    }
  }
};

// Home Component
const Home = {
  template: `
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="box">
              <h1 class="title">Welcome to FitTrack</h1>
              <p class="subtitle">Your personal fitness tracking companion</p>
              <div class="content">
                <p>Track your workouts, monitor your progress, and connect with friends to stay motivated!</p>
                <ul>
                  <li>📊 Track your daily activities</li>
                  <li>👥 Connect with friends and view their achievements</li>
                  <li>📈 Monitor your fitness statistics</li>
                  <li>⚙️ Manage your profile and settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};

// Login Component
const Login = {
  template: `
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5">
            <div class="box">
              <h1 class="title">Login to FitTrack</h1>
              <form @submit.prevent="handleLogin">
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input class="input" type="text" placeholder="Enter username" v-model="username">
                    <span class="icon is-left"><i class="fas fa-user"></i></span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left">
                    <input class="input" type="password" placeholder="Enter password" v-model="password">
                    <span class="icon is-left"><i class="fas fa-lock"></i></span>
                  </div>
                </div>
                <div class="field is-grouped">
                  <div class="control">
                    <button class="button is-primary">Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      console.log('Login attempt:', this.username);
      // Will implement authentication in next step
    }
  }
};

// Placeholder Components
const Dashboard = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Dashboard</h1>
        <p class="subtitle">Your personal fitness overview (coming soon)</p>
      </div>
    </section>
  `
};

const Activities = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Activities</h1>
        <p class="subtitle">Manage your fitness activities (coming soon)</p>
      </div>
    </section>
  `
};

const Friends = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Friends</h1>
        <p class="subtitle">View your friends' activities (coming soon)</p>
      </div>
    </section>
  `
};

const Admin = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Admin Panel</h1>
        <p class="subtitle">Manage users and system settings (coming soon)</p>
      </div>
    </section>
  `
};

// Router configuration
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/activities', component: Activities },
    { path: '/friends', component: Friends },
    { path: '/admin', component: Admin }
  ]
});

// Create and mount app
const app = createApp(App);
app.use(router);
app.mount('#app');
