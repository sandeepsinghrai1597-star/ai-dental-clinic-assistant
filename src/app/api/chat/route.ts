import { NextRequest, NextResponse } from "next/server";

const OLLAMA_API = process.env.OLLAMA_API || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "mistral";

const SYSTEM_PROMPT = `You are PearlCare Dental Clinic's AI Assistant - a friendly, knowledgeable, and professional dental health advisor. Your role is to:

1. Answer general dental health questions accurately and clearly
2. Help patients understand dental conditions and treatments
3. Provide preventive dental care tips
4. Guide patients toward booking appointments for personalized care
5. Be empathetic about dental anxiety and pain concerns
6. Always recommend professional consultation for specific diagnoses

Guidelines:
- Respond in a warm, professional tone
- Use simple language that patients understand
- Provide evidence-based dental health information
- Never diagnose conditions definitively - always suggest professional evaluation
- Encourage patients to book appointments with our doctors for detailed assessments
- When patients mention tooth pain or emergencies, strongly recommend same-day appointments
- Keep responses concise but informative (2-3 sentences typically)
- For complex questions, break down information into clear points
- Always end service-related queries with a call-to-action for booking

Dental Services Available:
- Emergency exams and pain relief
- Scaling and polishing (cleaning)
- Teeth whitening
- Cavities and fillings
- Root canals
- Dental implants
- Braces and aligners
- Veneers and cosmetic dentistry
- Gum disease treatment

Remember: You are a helpful assistant, not a substitute for professional dental care. When in doubt, recommend an appointment with our dentist.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    // Format messages for Ollama
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.text || msg.content,
    }));

    // Call Ollama API with streaming
    const response = await fetch(`${OLLAMA_API}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...formattedMessages,
        ],
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Ollama API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            const lines = text.split("\n");

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const json = JSON.parse(line);
                  if (json.message?.content) {
                    controller.enqueue(json.message.content);
                  }
                } catch {
                  // Skip invalid JSON lines
                }
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
