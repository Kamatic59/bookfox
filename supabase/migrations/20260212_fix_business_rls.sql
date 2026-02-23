-- Fix RLS policies to allow users to create businesses during onboarding

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own business" ON businesses;
DROP POLICY IF EXISTS "Users can view their own business" ON businesses;
DROP POLICY IF EXISTS "Users can update their own business" ON businesses;

-- Allow authenticated users to insert businesses
CREATE POLICY "Users can insert businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to view businesses they're a team member of
CREATE POLICY "Users can view their businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT business_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Allow users to update businesses they're a team member of
CREATE POLICY "Users can update their businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT business_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT business_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Ensure team_members policies allow insertion
DROP POLICY IF EXISTS "Users can insert team members" ON team_members;

CREATE POLICY "Users can insert team members for their businesses"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    business_id IN (
      SELECT business_id 
      FROM team_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );
