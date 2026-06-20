import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'email-config.json')

interface EmailConfig {
  enabled: boolean
  host: string
  port: string
  secure: boolean
  user: string
  password: string
  fromEmail: string
  fromName: string
}

function readConfig(): EmailConfig | null {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
    }
  } catch (error) {
    console.error('Error reading email config:', error)
  }
  return null
}

function writeConfig(config: EmailConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export async function GET() {
  const config = readConfig()
  
  if (!config) {
    return NextResponse.json({
      enabled: false,
      host: '',
      port: '587',
      secure: false,
      user: '',
      password: '',
      fromEmail: '',
      fromName: 'GELVANO'
    })
  }

  return NextResponse.json(config)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const config: EmailConfig = {
      enabled: body.enabled ?? false,
      host: body.host || '',
      port: body.port || '587',
      secure: body.secure ?? false,
      user: body.user || '',
      password: body.password || '',
      fromEmail: body.fromEmail || '',
      fromName: body.fromName || 'GELVANO'
    }

    writeConfig(config)

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات البريد الإلكتروني بنجاح'
    })
  } catch (error) {
    console.error('Error saving email config:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حفظ الإعدادات' },
      { status: 500 }
    )
  }
}
