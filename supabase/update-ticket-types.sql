-- Run this on the existing Supabase project after changing ticket tiers.
-- It updates the tickets check constraint to allow the current public options.

alter table public.tickets
drop constraint if exists tickets_ticket_type_check;

alter table public.tickets
add constraint tickets_ticket_type_check
check (ticket_type in ('General Admission', 'VIP Admission'));
