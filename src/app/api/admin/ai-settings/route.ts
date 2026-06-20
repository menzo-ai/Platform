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
      freeModels,
      apiKey,
      searchEngine,
      searchApiKey,
      customPrompt,
      testPrompt,
      showTestPage,
      deepThinkingModels
    } = data

    // Upsert settings
    const settings = await prisma.aISettings.upsert({
      where: { id: 'default' },
      update: {
        isEnabled,
        service,
        model,
        freeModels,
        apiKey,
        searchEngine,
        searchApiKey,
        customPrompt,
        testPrompt,
        showTestPage,
        deepThinkingModels
      },
      create: {
        id: 'default',
        isEnabled,
        service,
        model,
        freeModels: freeModels || JSON.stringify([]),
        apiKey,
        searchEngine,
        searchApiKey,
        customPrompt,
        testPrompt,
        showTestPage,
        deepThinkingModels: deepThinkingModels || JSON.stringify([])
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
      freeModels: JSON.stringify(['gpt-4o-mini', 'gpt-4o']),
      searchEngine: 'none',
      showTestPage: true,
      deepThinkingModels: JSON.stringify([])
    })
  } catch (error) {
    console.error('Error fetching AI settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}