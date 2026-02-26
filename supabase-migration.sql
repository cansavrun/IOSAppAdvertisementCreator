-- ============================================
-- Reels Creator - Supabase Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. PROFILES (synced from Firebase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 3. MEDIA ITEMS (every generated/edited piece of content)
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'screenshot')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'generating', 'completed', 'failed')),
  prompt TEXT,
  fal_model TEXT NOT NULL,
  fal_request_id TEXT,
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB,
  result_url TEXT,
  storage_path TEXT,
  thumbnail_path TEXT,
  parent_id UUID REFERENCES media_items(id),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_media_items_project_id ON media_items(project_id);
CREATE INDEX IF NOT EXISTS idx_media_items_fal_request_id ON media_items(fal_request_id);

-- 4. CHAT MESSAGES (conversation history per project)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  media_item_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);

-- 5. UPLOADED FILES (user uploads)
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  fal_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_project_id ON uploaded_files(project_id);

-- ============================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard > Storage
-- ============================================
-- Bucket: uploads    (private) - user uploaded images
-- Bucket: generations (private) - AI generated media
-- Bucket: exports    (private) - exported screenshots
