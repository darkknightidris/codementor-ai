-- ============================================================
-- CodeMentor AI — RLS Policies
-- Run AFTER 01_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
CREATE POLICY "users_select_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── CODE REVIEWS ──
CREATE POLICY "users_select_own_reviews"
  ON code_reviews FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "users_insert_own_reviews"
  ON code_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_reviews"
  ON code_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_reviews"
  ON code_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ── USAGE LOGS ──
CREATE POLICY "users_select_own_logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── TRIGGER: Auto-create profile on signup ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── FUNCTION: Upgrade plan (run as admin) ──
-- Usage: SELECT upgrade_plan('email@example.com', 'pro');
CREATE OR REPLACE FUNCTION upgrade_plan(user_email TEXT, new_plan TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles
  SET plan = new_plan
  WHERE id = (SELECT id FROM auth.users WHERE email = user_email);
END;
$$;
