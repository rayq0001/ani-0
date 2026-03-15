# دليل تكامل الذكاء الاصطناعي في Aniverse

## نظرة عامة
يستخدم Aniverse ذكاء Gemini من Google للعديد من الميزات الذكية. إليك كيفية عمله:

---

## 1. الباك اند (Go Backend)

### الملفات الرئيسية:

#### `internal/ai/gemini/client.go` - عميل Gemini
```go
// إنشاء عميل Gemini
client := gemini.NewClient(apiKey)

// إنشاء نص من prompt
resp, err := client.GenerateText(ctx, "ما هي قصة هذا المانجا؟")

// تحليل صورة
resp, err := client.AnalyzeImage(ctx, imageData, "image/jpeg", "اشرح هذه الصفحة")
```

#### `internal/ai/service.go` - خدمة الذكاء الاصطناعي
```go
type Service struct {
    geminiClient *gemini.Client
    settings     *Settings
}

// الميزات المتاحة:
- OCR (التعرف على النصوص في الصور)
- Chat (محادثة ذكية)
- Recap (تلخيص الفصول)
- Search (البحث بالوصف)
- Lore Tree (شجرة الشخصيات)
- Image Upscaling (تحسين جودة الصور)
```

#### `internal/handlers/ai.go` - نقاط النهاية للـ API

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/v1/ai/settings` | GET | الحصول على إعدادات AI |
| `/api/v1/ai/settings` | POST | تحديث الإعدادات |
| `/api/v1/ai/ocr` | POST | التعرف على النص في الصور |
| `/api/v1/ai/translate` | POST | الترجمة |
| `/api/v1/ai/chat` | POST | المحادثة الذكية |
| `/api/v1/ai/recap` | POST | تلخيص الفصول |
| `/api/v1/ai/search` | POST | البحث بالوصف |
| `/api/v1/ai/lore` | POST | شجرة الشخصيات |
| `/api/v1/ai/upscale` | POST | تحسين الصور |

---

## 2. الفرونت اند (React Frontend)

### الملفات الرئيسية:

#### `aniverse-web/src/api/hooks/ai.hooks.ts` - هوك الذكاء الاصطناعي

```typescript
// الحصول على إعدادات AI
const { data: settings } = useGetAISettings()

// تحديث الإعدادات
const updateMutation = useUpdateAISettings()

// التعرف على النص في الصور
const ocrMutation = useOCRPage()

// المحادثة الذكية
const chatMutation = useAIChat()

// تلخيص الفصول
const recapMutation = useGenerateRecap()

// البحث بالوصف
const searchMutation = useAISearch()

// شجرة الشخصيات
const loreMutation = useGenerateLoreTree()

// تحسين الصور
const upscaleMutation = useUpscaleImage()
```

#### `aniverse-web/src/components/ai/AIFloatingAssistant.tsx` - الزر العائم

```typescript
// زر AI العائم في الزاوية السفلية اليمنى
<div className="fixed bottom-6 right-6 z-[9999]">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsOpen(true)}
  >
    <AIBotAvatar />
  </motion.button>
</div>
```

#### `aniverse-web/src/app/(main)/_features/ai-features/` - ميزات AI

- `concierge.tsx` - المساعد الذكي
- `ocr.tsx` - التعرف على النص
- `recap.tsx` - التلخيص
- `lore.tsx` - شجرة الشخصيات
- `search.tsx` - البحث الذكي

---

## 3. اختبار API

### اختبار إعدادات AI:
```bash
curl -s http://localhost:43211/api/v1/ai/settings | jq
```

### اختبار OCR:
```bash
curl -X POST http://localhost:43211/api/v1/ai/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgo...",
    "mimeType": "image/jpeg",
    "pageNumber": 1
  }' | jq
```

### اختبار المحادثة:
```bash
curl -X POST http://localhost:43211/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ما هي قصة One Piece؟",
    "context": {
      "mangaTitle": "One Piece",
      "currentChapter": 100,
      "totalChapters": 1100
    }
  }' | jq
```

### اختبار البحث:
```bash
curl -X POST http://localhost:43211/api/v1/ai/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "مانجا عن ساحر قوي ينتقم من عائلته"
  }' | jq
```

---

## 4. كيفية الاستخدام

### تفعيل AI:
1. اذهب إلى الإعدادات → AI Services
2. أدخل مفتاح Gemini API
3. فعّل الميزات المطلوبة (OCR, Chat, Recap, Search)

### استخدام الزر العائم:
- يظهر في الزاوية السفلية اليمنى في جميع الصفحات
- اضغط عليه لفتح قائمة الميزات الذكية
- اختر: Chat, OCR, Recap, Search, أو Lore

### استخدام OCR:
1. افتح أي صفحة مانجا
2. اضغط على زر AI العائم
3. اختر "OCR"
4. سيتم التعرف تلقائياً على النصوص وترجمتها

---

## 5. البنية التقنية

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   Gemini API    │
│   (React)       │     │   (Go/Echo)     │     │   (Google)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                       │                       │
       ▼                       ▼                       ▼
  AI Hooks              AI Service              Gemini Client
  (ai.hooks.ts)         (service.go)            (client.go)
```

---

## 6. الميزات الذكية المتاحة

| الميزة | الوصف | الملفات |
|--------|-------|---------|
| **OCR** | التعرف على النصوص في صفحات المانجا وترجمتها | `ocr.tsx`, `client.go` |
| **Chat** | محادثة ذكية حول المانجا | `concierge.tsx`, `service.go` |
| **Recap** | تلخيص الفصول السابقة | `recap.tsx` |
| **Search** | البحث عن مانجا بالوصف المزاجي | `search.tsx` |
| **Lore Tree** | شجرة الشخصيات والمنظمات | `lore.tsx` |
| **Upscale** | تحسين جودة الصور | `client.go` |

---

## 7. الأوامر المفيدة

```bash
# بناء الفرونت اند
cd aniverse-web && npm run build

# نسخ الملفات إلى web/
rm -rf web/static web/index.html
cp -r aniverse-web/out/* web/

# إعادة تشغيل السيرفر
pkill -f "./aniverse"
./aniverse &

# اختبار API
curl -s http://localhost:43211/api/v1/ai/settings | jq
```

---

## ملاحظات مهمة

1. **مفتاح API**: يجب إدخال مفتاح Gemini API في الإعدادات
2. **اللغة الافتراضية**: العربية (يمكن تغييرها في الإعدادات)
3. **التخزين المؤقت**: يستخدم التخزين المؤقت لمدة 5 دقائق للاستجابات
4. **الأمان**: يتم إرسال مفتاح API فقط من الباك اند، لا يُخزن في الفرونت اند
