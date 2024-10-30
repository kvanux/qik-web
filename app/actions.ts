'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateExpenses() {
  revalidatePath('/')
}