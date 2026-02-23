-- Fix RLS policies to allow business creation during onboarding
-- The original schema only had SELECT/UPDATE policies for businesses

-- Allow authenticated users to create businesses
CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to add themselves as team members
CREATE POLICY "Users can add themselves to businesses"
  ON team_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Note: ai_settings is auto-created by trigger, but just in case:
CREATE POLICY "Users can create AI settings for their businesses"
  ON ai_settings FOR INSERT
  WITH CHECK (business_id IN (SELECT get_user_business_ids()));
