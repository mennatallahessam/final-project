// Store - In-memory data management
const store = {
  // Current logged-in user
  currentUser: null,

  // All users in the system
  users: [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      email: 'admin@fittrack.com',
      role: 'admin',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 2,
      username: 'john',
      password: 'john123',
      name: 'John Doe',
      email: 'john@fittrack.com',
      role: 'user',
      createdAt: new Date('2026-01-15'),
      friends: [3]
    },
    {
      id: 3,
      username: 'jane',
      password: 'jane123',
      name: 'Jane Smith',
      email: 'jane@fittrack.com',
      role: 'user',
      createdAt: new Date('2026-01-20'),
      friends: [2]
    },
    {
      id: 4,
      username: 'trainer',
      password: 'trainer123',
      name: 'Mike Trainer',
      email: 'trainer@fittrack.com',
      role: 'trainer',
      createdAt: new Date('2026-02-01')
    }
  ],

  // Activities for each user
  activities: [
    {
      id: 1,
      userId: 2,
      type: 'Running',
      distance: 5,
      duration: 30,
      calories: 300,
      date: new Date('2026-03-07'),
      notes: 'Morning run at the park'
    },
    {
      id: 2,
      userId: 2,
      type: 'Gym',
      duration: 60,
      calories: 400,
      date: new Date('2026-03-06'),
      notes: 'Chest and triceps workout'
    },
    {
      id: 3,
      userId: 3,
      type: 'Yoga',
      duration: 45,
      calories: 150,
      date: new Date('2026-03-07'),
      notes: 'Relaxation and stretching'
    },
    {
      id: 4,
      userId: 3,
      type: 'Cycling',
      distance: 15,
      duration: 45,
      calories: 350,
      date: new Date('2026-03-05'),
      notes: 'Evening bike ride'
    }
  ],

  // Authentication methods
  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      // Don't store password in session
      this.currentUser = { ...user };
      delete this.currentUser.password;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return { success: true, user: this.currentUser };
    }
    return { success: false, error: 'Invalid username or password' };
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  },

  // Check if user is logged in
  isAuthenticated() {
    return this.currentUser !== null;
  },

  // Check if current user has a specific role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  },

  // Restore session from localStorage
  restoreSession() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      return true;
    }
    return false;
  },

  // User management (for admin)
  getAllUsers() {
    return this.users.map(u => ({ ...u, password: undefined }));
  },

  addUser(userData) {
    const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date(),
      friends: []
    };
    this.users.push(newUser);
    return newUser;
  },

  updateUser(userId, updates) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return null;
  },

  deleteUser(userId) {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  },

  // Activity management
  getUserActivities(userId) {
    return this.activities.filter(a => a.userId === userId);
  },

  addActivity(userId, activityData) {
    const newId = Math.max(...this.activities.map(a => a.id), 0) + 1;
    const newActivity = {
      id: newId,
      userId,
      ...activityData,
      date: new Date(activityData.date)
    };
    this.activities.push(newActivity);
    return newActivity;
  },

  updateActivity(activityId, updates) {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      Object.assign(activity, updates);
      return activity;
    }
    return null;
  },

  deleteActivity(activityId) {
    const index = this.activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      this.activities.splice(index, 1);
      return true;
    }
    return false;
  },

  // Friends management
  addFriend(userId, friendId) {
    const user = this.users.find(u => u.id === userId);
    if (user && !user.friends.includes(friendId)) {
      user.friends.push(friendId);
      return true;
    }
    return false;
  },

  removeFriend(userId, friendId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.friends = user.friends.filter(id => id !== friendId);
      return true;
    }
    return false;
  },

  getFriends(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.friends) {
      return this.users.filter(u => user.friends.includes(u.id));
    }
    return [];
  },

  // Get friend activities
  getFriendsActivities(userId) {
    const friends = this.getFriends(userId);
    const friendIds = friends.map(f => f.id);
    return this.activities.filter(a => friendIds.includes(a.userId));
  },

  // Statistics
  getUserStats(userId) {
    const userActivities = this.getUserActivities(userId);
    return {
      totalActivities: userActivities.length,
      totalCalories: userActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
      totalDistance: userActivities.reduce((sum, a) => sum + (a.distance || 0), 0),
      totalDuration: userActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
      activityTypes: [...new Set(userActivities.map(a => a.type))]
    };
  }
};

// Initialize session on page load
store.restoreSession();
