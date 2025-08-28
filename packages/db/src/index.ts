// packages/db/src/index.ts
import { PrismaClient as SupabasePrisma } from '../prisma/generated/supabase-client';
import { PrismaClient as TimescalePrisma } from '../prisma/generated/timescale-client';

export const supabaseDb = new SupabasePrisma();
export const timescaleDb = new TimescalePrisma();
export const prismaClient = supabaseDb; // Legacy support
