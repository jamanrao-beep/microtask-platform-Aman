// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed,
        wallet: { create: { pending: 0, approved: 0, withdrawn: 0 } },
      },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
