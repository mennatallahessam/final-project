const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

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

// ==================== Activities Component ====================
const Activities = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">My Activities</h1>
        <p class="subtitle">Track and manage your fitness activities</p>

        <!-- Success Message -->
        <div v-if="successMessage" class="notification is-success is-light">
          <button class="delete" @click="successMessage = ''"></button>
          {{ successMessage }}
        </div>

        <!-- Add New Activity Button -->
        <div class="mb-3">
          <button class="button is-primary" @click="showAddForm = !showAddForm">
            <span class="icon"><i class="fas fa-plus"></i></span>
            <span>{{ showAddForm ? 'Cancel' : 'Add New Activity' }}</span>
          </button>
        </div>

        <!-- Add Activity Form -->
        <div v-if="showAddForm" class="box mb-3">
          <h3 class="title is-5">Log New Activity</h3>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Activity Type</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="newActivity.type">
                      <option>Running</option>
                      <option>Gym</option>
                      <option>Yoga</option>
                      <option>Cycling</option>
                      <option>Swimming</option>
                      <option>Walking</option>
                      <option>Sports</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Date</label>
                <div class="control">
                  <input class="input" type="date" v-model="newActivity.date">
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="newActivity.duration" placeholder="30" min="1">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Calories Burned</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="newActivity.calories" placeholder="300" min="1">
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Distance (km) - Optional</label>
                <div class="control">
                  <input class="input" type="number" step="0.1" v-model.number="newActivity.distance" placeholder="5.0">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Notes</label>
                <div class="control">
                  <input class="input" type="text" v-model="newActivity.notes" placeholder="How did you feel?">
                </div>
              </div>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-success" @click="addActivity">Log Activity</button>
            </div>
          </div>
        </div>

        <!-- Activities Table -->
        <div v-if="activities.length > 0" class="box">
          <h3 class="title is-5">Activity History ({{ activities.length }})</h3>
          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="activity in sortedActivities" :key="activity.id">
                  <td>{{ formatDate(activity.date) }}</td>
                  <td>
                    <span class="tag is-light">{{ activity.type }}</span>
                  </td>
                  <td>{{ activity.duration }} min</td>
                  <td>{{ activity.distance ? activity.distance + ' km' : '—' }}</td>
                  <td><strong>{{ activity.calories }}</strong> kcal</td>
                  <td>{{ activity.notes || '—' }}</td>
                  <td>
                    <button class="button is-small is-info" @click="editActivity(activity)">
                      <span class="icon"><i class="fas fa-edit"></i></span>
                    </button>
                    <button class="button is-small is-danger" @click="deleteActivity(activity.id)">
                      <span class="icon"><i class="fas fa-trash"></i></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="box has-text-centered">
          <p class="is-size-6">No activities logged yet. Start by adding your first activity!</p>
        </div>

        <!-- Edit Activity Modal -->
        <div v-if="editingActivity" class="modal is-active">
          <div class="modal-background" @click="editingActivity = null"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Edit Activity</p>
              <button class="delete" @click="editingActivity = null"></button>
            </header>
            <section class="modal-card-body">
              <div class="field">
                <label class="label">Activity Type</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="editingActivity.type">
                      <option>Running</option>
                      <option>Gym</option>
                      <option>Yoga</option>
                      <option>Cycling</option>
                      <option>Swimming</option>
                      <option>Walking</option>
                      <option>Sports</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label">Date</label>
                <div class="control">
                  <input class="input" type="date" :value="editingActivity.date.split('T')[0]" @input="editingActivity.date = $event.target.value">
                </div>
              </div>
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="editingActivity.duration" min="1">
                </div>
              </div>
              <div class="field">
                <label class="label">Calories Burned</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="editingActivity.calories" min="1">
                </div>
              </div>
              <div class="field">
                <label class="label">Distance (km)</label>
                <div class="control">
                  <input class="input" type="number" step="0.1" v-model.number="editingActivity.distance">
                </div>
              </div>
              <div class="field">
                <label class="label">Notes</label>
                <div class="control">
                  <input class="input" type="text" v-model="editingActivity.notes">
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="editingActivity = null">Cancel</button>
              <button class="button is-primary" @click="saveEdit">Save Changes</button>
            </footer>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      store,
      showAddForm: false,
      editingActivity: null,
      successMessage: '',
      newActivity: {
        type: 'Running',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        calories: '',
        distance: '',
        notes: ''
      }
    };
  },
  computed: {
    activities() {
      return store.getUserActivities(store.currentUser.id);
    },
    sortedActivities() {
      return [...this.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  methods: {
    addActivity() {
      if (!this.newActivity.duration || !this.newActivity.calories) {
        alert('Please fill in duration and calories');
        return;
      }
      store.addActivity(store.currentUser.id, {
        type: this.newActivity.type,
        date: this.newActivity.date,
        duration: this.newActivity.duration,
        calories: this.newActivity.calories,
        distance: this.newActivity.distance || 0,
        notes: this.newActivity.notes
      });
      this.successMessage = `Activity logged successfully!`;
      this.newActivity = {
        type: 'Running',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        calories: '',
        distance: '',
        notes: ''
      };
      this.showAddForm = false;
    },
    editActivity(activity) {
      this.editingActivity = { ...activity };
    },
    saveEdit() {
      if (this.editingActivity) {
        store.updateActivity(this.editingActivity.id, this.editingActivity);
        this.successMessage = `Activity updated successfully!`;
        this.editingActivity = null;
      }
    },
    deleteActivity(activityId) {
      if (confirm('Are you sure you want to delete this activity?')) {
        store.deleteActivity(activityId);
        this.successMessage = `Activity deleted!`;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
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

// ==================== Admin Component ====================
const Admin = {
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title">Admin Panel</h1>
        <p class="subtitle">Manage users in the system</p>

        <!-- Success Message -->
        <div v-if="successMessage" class="notification is-success is-light">
          <button class="delete" @click="successMessage = ''"></button>
          {{ successMessage }}
        </div>

        <!-- Add New User Button -->
        <div class="mb-3">
          <button class="button is-primary" @click="showAddForm = !showAddForm">
            <span class="icon"><i class="fas fa-plus"></i></span>
            <span>{{ showAddForm ? 'Cancel' : 'Add New User' }}</span>
          </button>
        </div>

        <!-- Add User Form -->
        <div v-if="showAddForm" class="box mb-3">
          <h3 class="title is-5">Add New User</h3>
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input class="input" type="text" v-model="newUser.username" placeholder="Username">
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" v-model="newUser.password" placeholder="Password">
            </div>
          </div>
          <div class="field">
            <label class="label">Full Name</label>
            <div class="control">
              <input class="input" type="text" v-model="newUser.name" placeholder="Full Name">
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="newUser.email" placeholder="Email">
            </div>
          </div>
          <div class="field">
            <label class="label">Role</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="newUser.role">
                  <option>user</option>
                  <option>trainer</option>
                  <option>admin</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-success" @click="addUser">Create User</button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="box">
          <h3 class="title is-5">All Users ({{ users.length }})</h3>
          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td><strong>{{ user.username }}</strong></td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="tag" :class="getRoleClass(user.role)">{{ user.role }}</span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>
                    <button class="button is-small is-info" @click="editUser(user)">
                      <span class="icon"><i class="fas fa-edit"></i></span>
                    </button>
                    <button v-if="user.id !== store.currentUser.id" class="button is-small is-danger" @click="deleteUser(user.id)">
                      <span class="icon"><i class="fas fa-trash"></i></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div v-if="editingUser" class="modal is-active">
          <div class="modal-background" @click="editingUser = null"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Edit User: {{ editingUser.name }}</p>
              <button class="delete" @click="editingUser = null"></button>
            </header>
            <section class="modal-card-body">
              <div class="field">
                <label class="label">Full Name</label>
                <div class="control">
                  <input class="input" type="text" v-model="editingUser.name">
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="email" v-model="editingUser.email">
                </div>
              </div>
              <div class="field">
                <label class="label">Role</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="editingUser.role">
                      <option>user</option>
                      <option>trainer</option>
                      <option>admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="editingUser = null">Cancel</button>
              <button class="button is-primary" @click="saveEdit">Save Changes</button>
            </footer>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      store,
      showAddForm: false,
      editingUser: null,
      successMessage: '',
      newUser: {
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'user'
      }
    };
  },
  computed: {
    users() {
      return store.getAllUsers();
    }
  },
  methods: {
    addUser() {
      if (!this.newUser.username || !this.newUser.password || !this.newUser.name || !this.newUser.email) {
        alert('Please fill in all fields');
        return;
      }
      store.addUser(this.newUser);
      this.successMessage = `User "${this.newUser.name}" has been created!`;
      this.newUser = { username: '', password: '', name: '', email: '', role: 'user' };
      this.showAddForm = false;
    },
    editUser(user) {
      this.editingUser = { ...user };
    },
    saveEdit() {
      if (this.editingUser) {
        store.updateUser(this.editingUser.id, this.editingUser);
        this.successMessage = `User "${this.editingUser.name}" has been updated!`;
        this.editingUser = null;
      }
    },
    deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        const user = store.users.find(u => u.id === userId);
        store.deleteUser(userId);
        this.successMessage = `User "${user.name}" has been deleted!`;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getRoleClass(role) {
      const classes = {
        admin: 'is-danger',
        trainer: 'is-info',
        user: 'is-success'
      };
      return classes[role] || 'is-light';
    }
  }
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
