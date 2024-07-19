-- Update the account_type of the Employee account to "Employee"
UPDATE public.account
SET account_type = 'Employee'
WHERE account_email = 'happy@340.edu';

-- Update the account_type of the Manager account to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';
