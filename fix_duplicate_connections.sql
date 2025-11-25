-- 1. Remove duplicate connections, keeping the oldest one
DELETE FROM public.user_connections a USING (
      SELECT MIN(ctid) as ctid, user_id_1, user_id_2
      FROM public.user_connections 
      GROUP BY user_id_1, user_id_2 HAVING COUNT(*) > 1
      ) b
      WHERE a.user_id_1 = b.user_id_1 
      AND a.user_id_2 = b.user_id_2 
      AND a.ctid <> b.ctid;

-- 2. Add a unique constraint to prevent future duplicates
ALTER TABLE public.user_connections
ADD CONSTRAINT unique_user_connection UNIQUE (user_id_1, user_id_2);
