-- ============================================================
-- CodeMentor AI — Supabase Schema
-- Run this in Supabase SQL Editor (fresh project)
-- ============================================================

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'unlimited')),
  review_count_this_month INT NOT NULL DEFAULT 0,
  review_reset_date TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CODE REVIEWS
CREATE TABLE code_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('beginner', 'standard', 'senior')),
  original_code TEXT NOT NULL,
  review_result JSONB,
  score INT CHECK (score >= 0 AND score <= 100),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USAGE LOGS
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_code_reviews_user_id ON code_reviews(user_id);
CREATE INDEX idx_code_reviews_created_at ON code_reviews(created_at DESC);
CREATE INDEX idx_code_reviews_share_token ON code_reviews(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
