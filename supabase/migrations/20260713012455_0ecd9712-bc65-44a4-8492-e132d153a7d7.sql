
-- profiles: explicit DELETE policy (master only). No INSERT policy => client inserts blocked;
-- profile rows are created by the SECURITY DEFINER handle_new_user trigger which bypasses RLS.
CREATE POLICY "Master can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'master'));

-- user_roles: allow admins to manage non-master roles. Master-role rows still require master.
CREATE POLICY "Admins can insert non-master roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin(auth.uid())
  AND role <> 'master'
);

CREATE POLICY "Admins can update non-master roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid())
  AND role <> 'master'
)
WITH CHECK (
  public.is_admin(auth.uid())
  AND role <> 'master'
);

CREATE POLICY "Admins can delete non-master roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
  AND role <> 'master'
);
