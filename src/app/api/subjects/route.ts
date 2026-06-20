import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    // Return default subjects if table doesn't exist
    return NextResponse.json([
      { id: '1', name: 'الفيزياء - الباب الأول', description: 'الكهرباء والتيار' },
      { id: '2', name: 'الفيزياء - الباب الثاني', description: 'المجالات الكهرومغناطيسية' },
      { id: '3', name: 'الفيزياء - الباب الثالث', description: 'الفيزياء النووية' },
      { id: '4', name: 'الفيزياء - الباب الرابع', description: 'الضوء والأمواج' },
      { id: '5', name: 'الفيزياء - الباب الخامس', description: 'الحرارة والديناميكا' },
      { id: '6', name: 'الفيزياء - الباب السادس', description: 'الميكانيكا' },
    ])
  }
}
