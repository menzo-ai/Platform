import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const {
      isEnabled,
      service,
      model,
      apiKey,
      searchEngine,
      searchApiKey,
      customPrompt,
      testPrompt,
      showTestPage
    } = data

    // Upsert settings
    const settings = await prisma.aISettings.upsert({
      where: { id: 'default' },
      update: {
        isEnabled,
        service,
        model,
        apiKey,
        searchEngine,
        searchApiKey,
        customPrompt,
        testPrompt,
        showTestPage,
      },
      create: {
        id: 'default',
        isEnabled,
        service,
        model,
        apiKey,
        searchEngine,
        searchApiKey,
        customPrompt,
        testPrompt,
        showTestPage,
      }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error saving AI settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.aISettings.findUnique({
      where: { id: 'default' }
    })

    return NextResponse.json(settings || {
      isEnabled: true,
      service: 'openai',
      model: 'gpt-4o-mini',
      searchEngine: 'none',
      showTestPage: true
    })
  } catch (error) {
    console.error('Error fetching AI settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}