-- Reinstall the zero-argument staff snapshot RPC so PostgREST schema cache
-- and fresh database deployments always expose the exact signature used by
-- web/src/app/api/admin/staff/route.ts.

create or replace function public.admin_get_staff_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  can_view boolean := public.has_permission('staff.view') or public.has_permission('staff.manage') or public.has_permission('staff.invite') or public.has_permission('staff.groups.view') or public.has_permission('staff.groups.manage') or public.has_permission('settings.permissions');
  can_manage boolean := public.has_permission('staff.manage') or public.has_permission('settings.permissions');
  can_invite boolean := public.has_permission('staff.invite') or public.has_permission('settings.permissions');
  can_groups_view boolean := public.has_permission('staff.groups.view') or public.has_permission('staff.groups.manage') or public.has_permission('settings.permissions');
  can_groups_manage boolean := public.has_permission('staff.groups.manage') or public.has_permission('settings.permissions');
  can_permission_admin boolean := public.has_permission('settings.permissions');
  result jsonb;
begin
  if not can_view then raise exception 'Permission denied'; end if;

  select jsonb_build_object(
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
        'user_id',sm.user_id,
        'status',sm.status,
        'title',sm.title,
        'department',sm.department,
        'staff_notes',sm.staff_notes,
        'created_at',sm.created_at,
        'updated_at',sm.updated_at,
        'display_name',coalesce(up.display_name,c.name,sm.user_id::text),
        'email',coalesce(c.email,''),
        'customer_id',c.id,
        'customer_number',c.customer_number,
        'is_customer',(c.id is not null),
        'profile_status',up.status,
        'profile_role',up.role,
        'group_ids',coalesce((select jsonb_agg(sg.id order by smg.is_primary desc,sg.sort_order,sg.name) from public.staff_member_groups smg join public.staff_groups sg on sg.id=smg.group_id where smg.user_id=sm.user_id),'[]'::jsonb),
        'primary_group_id',(select smg.group_id from public.staff_member_groups smg join public.staff_groups sg on sg.id=smg.group_id where smg.user_id=sm.user_id order by smg.is_primary desc,sg.sort_order,sg.name limit 1),
        'group_names',coalesce((select jsonb_agg(sg.name order by smg.is_primary desc,sg.sort_order,sg.name) from public.staff_member_groups smg join public.staff_groups sg on sg.id=smg.group_id where smg.user_id=sm.user_id),'[]'::jsonb),
        'effective_permissions',coalesce((select jsonb_agg(k order by k) from (select distinct e.key as k from public.staff_member_groups smg join public.staff_groups sg on sg.id=smg.group_id cross join lateral jsonb_each_text(sg.permissions) e where smg.user_id=sm.user_id and e.value='true') q),'[]'::jsonb)
      ) order by sm.status desc,coalesce(up.display_name,c.name,c.email,sm.user_id::text))
      from public.staff_members sm
      left join public.user_profiles up on up.id=sm.user_id
      left join lateral (select c1.* from public.customers c1 where c1.auth_user_id=sm.user_id order by c1.created_at desc nulls last limit 1) c on true
    ),'[]'::jsonb),
    'groups',coalesce((select jsonb_agg(to_jsonb(sg) order by sg.sort_order,sg.name) from public.staff_groups sg),'[]'::jsonb),
    'availableCustomers',case when can_invite then coalesce((
      select jsonb_agg(jsonb_build_object('id',c.id,'auth_user_id',c.auth_user_id,'email',c.email,'name',c.name,'status',c.status,'customer_number',c.customer_number) order by coalesce(c.name,c.email))
      from public.customers c
      where c.auth_user_id is not null and not exists(select 1 from public.staff_members sm where sm.user_id=c.auth_user_id)
    ),'[]'::jsonb) else '[]'::jsonb end,
    'can',jsonb_build_object('view',can_view,'manage',can_manage,'invite',can_invite,'groupsView',can_groups_view,'groupsManage',can_groups_manage,'permissionAdmin',can_permission_admin)
  ) into result;
  return result;
end;
$$;

grant execute on function public.admin_get_staff_snapshot() to anon, authenticated, service_role;
notify pgrst, 'reload schema';
