-- Data for table `Account`
INSERT INTO public.account(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- Update data accoub-type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete data from record/table
DELETE FROM public.account
WHERE account_id = 1;

--Replace data in 'inventory table'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description,' small interior','huge interior' )
WHERE inv_id = 10;


--inner Join Select
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM public.inventory inv
INNER JOIN public.classification cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- update image and thumnail path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

