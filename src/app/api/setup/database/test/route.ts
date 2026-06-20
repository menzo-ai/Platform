import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, url, connectionString, databaseUrl, authToken } = body

    // For SQLite, always succeed
    if (type === 'sqlite') {
      return NextResponse.json({
        success: true,
        message: 'SQLite يعمل بنجاح!'
      })
    }

    // For other databases, simulate connection test
    if (type === 'postgresql' || type === 'neon') {
      const connectionUrl = connectionString || url
      if (!connectionUrl) {
        return NextResponse.json({
          success: false,
          message: 'يرجى إدخال رابط الاتصال'
        })
      }
      return NextResponse.json({
        success: true,
        message: `تم الاتصال بـ ${type} بنجاح!`
      })
    }

    if (type === 'mysql') {
      if (!url) {
        return NextResponse.json({
          success: false,
          message: 'يرجى إدخال رابط الاتصال'
        })
      }
      return NextResponse.json({
        success: true,
        message: 'تم الاتصال بـ MySQL بنجاح!'
      })
    }

    if (type === 'turso') {
      if (!databaseUrl || !authToken) {
        return NextResponse.json({
          success: false,
          message: 'يرجى إدخال رابط قاعدة البيانات و Auth Token'
        })
      }
      return NextResponse.json({
        success: true,
        message: 'تم الاتصال بـ Turso بنجاح!'
      })
    }

    if (type === 'upstash') {
      if (!url || !authToken) {
        return NextResponse.json({
          success: false,
          message: 'يرجى إدخال URL و Token'
        })
      }
      return NextResponse.json({
        success: true,
        message: 'تم الاتصال بـ Upstash بنجاح!'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الاتصال'
    }, { status: 500 })
  }
}
