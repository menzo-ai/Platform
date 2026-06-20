import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, attachments, isDeepThinking, conversationId, model } = await request.json()

    // Get AI settings
    const aiSettings = await prisma.aISettings.findFirst()
    
    if (!aiSettings?.isEnabled) {
      return NextResponse.json({ error: 'AI is disabled' }, { status: 403 })
    }

    // Get or create conversation
    let conversation = conversationId 
      ? await prisma.aIConversation.findFirst({ where: { id: conversationId, userId: session.user.id } })
      : null

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
        }
      })
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        userId: session.user.id,
        role: 'user',
        content: message,
        attachments: attachments ? JSON.stringify(attachments) : null,
        isDeepThinking
      }
    })

    // Update conversation
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: {
        updatedAt: new Date()
      }
    })

    // Call AI API (placeholder - implement based on settings)
    const responseContent = generateAIResponse(message, aiSettings, isDeepThinking)

    // Save AI response
    const aiMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        userId: session.user.id,
        role: 'assistant',
        content: responseContent,
        isDeepThinking
      }
    })

    return NextResponse.json({
      content: responseContent,
      conversationId: conversation.id,
      title: conversation.title,
      messageId: aiMessage.id,
      isDeepThinking
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}

function generateAIResponse(message: string, settings: any, isDeepThinking: boolean): string {
  // This is a placeholder - in production, call actual AI API
  const deepThinkingPrefix = isDeepThinking 
    ? '🔍 *التفكير العميق:*\n\n'
    : ''
  
  const prompt = settings.customPrompt || 'أنت مساعد تعليمي ذكي.'
  
  // Simple response logic (replace with actual AI call)
  if (message.includes('قانون') || message.includes('نيوتن')) {
    return `${deepThinkingPrefix}قوانين نيوتن للحركة هي من أهم قوانين الفيزياء:

*القانون الأول (قانون القصور الذاتي):*
كل جسم يبقى في حالته من السكون أو الحركة المنتظمة في خط مستقيم ما لم تؤثر عليه قوة خارجية تدفعه لتغيير حالته.

*القانون الثاني (قانون الحركة):*
القوة المؤثرة على جسم = الكتلة × العجلة
F = m × a

*القانون الثالث (فعل ورد الفعل):*
لكل فعل قوة مساوية لها في المقدار ومضادة لها في الاتجاه.

هل تريد شرحاً أكثر تفصيلاً؟`
  }

  if (message.includes('طاقة') || message.includes('شغل')) {
    return `${deepThinkingPrefix}الطاقة والشغل مفاهيم أساسية في الفيزياء:

*الشغل (W):*
الشغل = القوة × المسافة × جيب الزاوية
W = F × d × cos(θ)

*الطاقة الحركية (KE):*
KE = ½ × m × v²

*الطاقة الكامنة (PE):*
PE = m × g × h

*مبدأ حفظ الطاقة:*
الطاقة لا تفنى ولا تُستحدث، بل تتحول من شكل إلى آخر.

هل تريد أمثلة حسابية؟`
  }

  if (message.includes('كهرباء') || message.includes('تيار')) {
    return `${deepThinkingPrefix}الدوائر الكهربائية هي أساس فهم الكهرباء:

*قانون أوم:*
V = I × R
(الجهد = التيار × المقاومة)

*القدرة الكهربية:*
P = V × I = I² × R = V² / R

*التوصيل على التوازي:*
V ثابت، التيار يتقسم
1/R_total = 1/R₁ + 1/R₂ + ...

*التوصيل على التوازي:*
I ثابت، الجهد يتقسم
R_total = R₁ + R₂ + ...

هل تريد حل مسائل على هذا الموضوع؟`
  }

  return `${deepThinkingPrefix}مرحباً! 👋

أنا **مساعدك الذكي** في الفيزياء.

${prompt.slice(0, 100)}...

يمكنني مساعدتك في:
• شرح المفاهيم الفيزيائية
• حل المسائل خطوة بخطوة
• إعداد الاختبارات
• تلخيص الدروس

اسأل سؤالك وسأساعدك فوراً! 🚀`
}
