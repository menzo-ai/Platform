import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'database-config.json')

interface DatabaseConfig {
  type: string
  url?: string
  apiKey?: string
  jwtSecret?: string
  publishableKey?: string
  secretKey?: string
  connectionString?: string
  authToken?: string
  databaseUrl?: string
  isConfigured: boolean
  createdAt: string
}

function readConfig(): DatabaseConfig | null {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading config:', error)
  }
  return null
}

function writeConfig(config: DatabaseConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export async function GET() {
  const config = readConfig()
  
  if (!config) {
    return NextResponse.json({ configured: false, type: null })
  }

  return NextResponse.json({
    configured: true,
    type: config.type,
    isConfigured: config.isConfigured
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const config: DatabaseConfig = {
      type: body.type || 'sqlite',
      url: body.url,
      apiKey: body.apiKey,
      jwtSecret: body.jwtSecret,
      publishableKey: body.publishableKey,
      secretKey: body.secretKey,
      connectionString: body.connectionString,
      authToken: body.authToken,
      databaseUrl: body.databaseUrl,
      isConfigured: true,
      createdAt: new Date().toISOString()
    }

    // Write config to file
    writeConfig(config)

    // If changing database type and not confirmed, return warning
    if (body.confirmed !== true && body.type !== 'sqlite') {
      const existingConfig = readConfig()
      if (existingConfig && existingConfig.type !== body.type) {
        return NextResponse.json({
          success: true,
          warning: true,
          message: 'سيتم حذف جميع البيانات السابقة'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات قاعدة البيانات بنجاح'
    })
  } catch (error) {
    console.error('Error saving database config:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حفظ الإعدادات' },
      { status: 500 }
    )
  }
}
