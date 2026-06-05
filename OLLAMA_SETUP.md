# 🤖 Real-Time AI Chatbot Setup Guide

This dental clinic chatbot now uses **Ollama** for real-time AI conversations. Ollama runs locally, so no external API keys are needed.

## 📋 Prerequisites

- Ollama installed on your system
- Node.js and npm (already set up)
- 4GB+ RAM recommended

## 🚀 Quick Start

### 1. Install Ollama

Download and install Ollama from: **https://ollama.ai**

### 2. Download an AI Model

Open terminal and download a model (default is Mistral, but you can use others):

```bash
ollama pull mistral
```

**Alternative Models:**
- `ollama pull neural-chat` - Optimized for chat (faster)
- `ollama pull llama2` - Meta's LLaMA 2 (larger, more capable)
- `ollama pull phi` - Smaller, very fast

### 3. Start Ollama Service

```bash
ollama serve
```

Ollama will run on `http://localhost:11434` (default)

### 4. Run Your Dental App

In a new terminal:

```bash
cd "e:\open ai codex projects\dental-clinic-ai-assistant"
npm run dev
```

Visit: `http://localhost:3000`

### 5. Test the Chatbot

Click the chat icon and try asking:
- "I have a toothache"
- "Do you offer braces?"
- "Book a cleaning appointment"
- "What are dental care tips?"

The AI will stream real-time responses!

---

## 🔧 Configuration

### Use Different Model

Edit `src/app/api/chat/route.ts`:

```typescript
const MODEL = process.env.OLLAMA_MODEL || "mistral";
```

Or set environment variable in `.env.local`:

```env
OLLAMA_MODEL=neural-chat
OLLAMA_API=http://localhost:11434
```

### Adjust AI Behavior

Edit the `SYSTEM_PROMPT` in `src/app/api/chat/route.ts` to customize:
- Tone and personality
- How the AI handles questions
- Appointment booking guidance
- Services information

### Temperature Setting

In `src/app/api/chat/route.ts`, adjust:

```typescript
temperature: 0.7,  // 0 = deterministic, 1 = creative
```

---

## 🐛 Troubleshooting

### "Failed to get response from AI"

- Ensure Ollama is running: `ollama serve`
- Check Ollama is accessible at `http://localhost:11434`
- Try: `curl http://localhost:11434/api/tags`

### Slow Responses

- Use a smaller model: `ollama pull neural-chat`
- Increase RAM available to Ollama
- Ensure your system isn't running heavy processes

### Model Download Stuck

- Check internet connection
- Try: `ollama pull mistral` again
- Models are 4-13GB, may take time

### Port Already in Use

If port 11434 is taken:

```bash
ollama serve --addr 127.0.0.1:11435
```

Update `.env.local`:

```env
OLLAMA_API=http://localhost:11435
```

---

## 📊 Performance Tips

| Model | Speed | Quality | Size | RAM Needed |
|-------|-------|---------|------|------------|
| neural-chat | ⚡⚡⚡ | Good | 4GB | 8GB |
| mistral | ⚡⚡ | Very Good | 4GB | 8GB |
| llama2 | ⚡ | Excellent | 7GB | 16GB |

---

## 💡 Features

✅ **Real-time Streaming** - Text appears word-by-word  
✅ **Dental Context** - AI knows your clinic services  
✅ **Local & Private** - No data sent to cloud  
✅ **No API Keys** - Run completely offline  
✅ **Fast** - Response in 2-5 seconds  
✅ **Appointment Guidance** - Guides patients to book  

---

## 🔗 Resources

- Ollama: https://ollama.ai
- Models: https://ollama.ai/library
- Chat API: `src/app/api/chat/route.ts`
- UI Components: `src/app/page.tsx`

---

## 📝 Next Steps

1. Start Ollama: `ollama serve`
2. Run the app: `npm run dev`
3. Open: `http://localhost:3000`
4. Test the chat!

Enjoy your AI-powered dental clinic chatbot! 🦷💬
