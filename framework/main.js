const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// ==================== App Component ====================
const App = {
  template: `
    <div>
      <!-- Navbar (show only if authenticated) -->
      <nav v-if="isAuthenticated" class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item is-size-5 has-text-weight-bold">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-dumbbell"></i></span>
              <span>FitTrack</span>
            </span>
          </router-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
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
            <router-link v-if="isAdmin" to="/admin" class="navbar-item">
              <span class="icon-text">
                <span class="icon"><i class="fas fa-cog"></i></span>
                <span>Admin</span>
              </span>
            </router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <span class="is-size-7">
                Welcome, <strong>{{ currentUser.name }}</strong> ({{ currentUser.role }})
              </span>
            </div>
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
  data() {
    return {
      store
    };
  },
  computed: {
    isAuthenticated() {
      return store.isAuthenticated();
    },
    currentUser() {
      return store.currentUser || {};
    },
    isAdmin() {
      return store.hasRole('admin');
    }
  },
  methods: {
    logout() {
      store.logout();
      this.$router.push('/login');
    }
  }
};

// ==================== Home Component ====================
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

// ==================== Login Component ====================
const Login = {
  template: `
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5">
            <div class="box">
              <h1 class="title">Login to FitTrack</h1>
              
              <!-- Error Message -->
              <div v-if="errorMessage" class="notification is-danger is-light">
                <button class="delete" @click="errorMessage = ''"></button>
                {{ errorMessage }}
              </div>

              <!-- Demo Credentials Info -->
              <div class="notification is-info is-light mb-3">
                <p><strong>Demo Accounts:</strong></p>
                <p class="is-size-7">admin / admin123 (Admin role)</p>
                <p class="is-size-7">john / john123 (User role)</p>
                <p class="is-size-7">jane / jane123 (User role)</p>
                <p class="is-size-7">trainer / trainer123 (Trainer role)</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input 
                      class="input" 
                      type="text" 
                      placeholder="Enter username" 
                      v-model="username"
                      :disabled="isLoading"
                      autofocus
                    >
                    <span class="icon is-left"><i class="fas fa-user"></i></span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left">
                    <input 
                      class="input" 
                      type="password" 
                      placeholder="Enter password" 
                      v-model="password"
                      :disabled="isLoading"
                    >
                    <span class="icon is-left"><i class="fas fa-lock"></i></span>
                  </div>
                </div>
                <div class="field is-grouped">
                  <div class="control">
                    <button class="button is-primary" :loading="isLoading" :disabled="isLoading">
                      <span v-if="isLoading" class="icon">
                        <i class="fas fa-spinner fa-spin"></i>
                      </span>
                      <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
                    </button>
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
      password: '',
      errorMessage: '',
      isLoading: false,
      store
    };
  },
  methods: {
    handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;

      // Simulate network delay
      setTimeout(() => {
        if (!this.username || !this.password) {
          this.errorMessage = 'Please enter both username and password';
          this.isLoading = false;
          return;
        }

        const result = store.login(this.username, this.password);
        
        if (result.success) {
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = result.error;
          this.password = '';
        }
        
        this.isLoading = false;
      }, 500);
    }
  }
};

// ==================== Dashboard Component (Placeholder) ====================
const Dashboard = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Dashboard</h1>
        <p class="subtitle">Your personal fitness overview</p>
        <div class="box">
          <p>Dashboard content coming soon...</p>
        </div>
      </div>
    </section>
  `
};

// ==================== Activities Component (Placeholder) ====================
const Activities = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Activities</h1>
        <p class="subtitle">Manage your fitness activities</p>
        <div class="box">
          <p>Activities management coming soon...</p>
        </div>
      </div>
    </section>
  `
};

// ==================== Friends Component (Placeholder) ====================
const Friends = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Friends</h1>
        <p class="subtitle">View your friends' activities</p>
        <div class="box">
          <p>Friends area coming soon...</p>
        </div>
      </div>
    </section>
  `
};

// ==================== Admin Component (Placeholder) ====================
const Admin = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Admin Panel</h1>
        <p class="subtitle">Manage users and system settings</p>
        <div class="box">
          <p>Admin panel coming soon...</p>
        </div>
      </div>
    </section>
  `
};

// ==================== Router Configuration ====================
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', component: Login },
    { 
      path: '/', 
      component: Home,
      meta: { requiresAuth: true }
    },
    { 
      path: '/dashboard', 
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    { 
      path: '/activities', 
      component: Activities,
      meta: { requiresAuth: true }
    },
    { 
      path: '/friends', 
      component: Friends,
      meta: { requiresAuth: true }
    },
    { 
      path: '/admin', 
      component: Admin,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
});

// ==================== Route Guards ====================
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.isAuthenticated();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route
    next('/login');
  } else if (requiresAdmin && !store.hasRole('admin')) {
    // Redirect to dashboard if admin tries to access admin route without permission
    next('/dashboard');
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already logged in and visiting login
    next('/dashboard');
  } else {
    next();
  }
});

// ==================== App Creation ====================
const app = createApp(App);
app.use(router);
app.mount('#app');
