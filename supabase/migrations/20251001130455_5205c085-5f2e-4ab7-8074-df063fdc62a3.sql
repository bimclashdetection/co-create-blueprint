-- Fix the profile name for Sheth Dhamrik
UPDATE profiles 
SET full_name = 'Sheth Dhamrik', 
    updated_at = NOW()
WHERE email = 'dharmik.sheth@teslacadd.com' 
  AND full_name = 'dharmik.sheth@teslacadd.com';