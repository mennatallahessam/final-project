-- Create Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'trainer')),
  friends UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Exercise Types Table
CREATE TABLE exercise_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  default_calories_per_minute FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_type_id UUID REFERENCES exercise_types(id),
  duration INT NOT NULL,
  distance FLOAT,
  date DATE NOT NULL,
  calories FLOAT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
