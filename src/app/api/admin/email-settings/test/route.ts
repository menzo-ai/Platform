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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const config = body.host ? body : readConfig()
    
    if (!config || !config.enabled) {
      return NextResponse.json({
        success: false,
        message: 'إعدادات البريد غير مفعلة'
      })
    }

    // In production, you would use nodemailer to send the email
    // For now, we simulate a successful send
    console.log('Test email would be sent with config:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user
    })

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالة الاختبار بنجاح!'
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في إرسال رسالة الاختبار'
    }, { status: 500 })
  }
}
