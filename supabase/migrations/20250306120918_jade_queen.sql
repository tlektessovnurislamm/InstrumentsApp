/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `department` (text)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  department text DEFAULT 'Analytics',
  role text DEFAULT 'Analyst',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);