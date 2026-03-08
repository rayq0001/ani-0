# خطة توافق الفرونت اند والباك اند - Seanime

## المشاكل المكتشفة

### 1. مشكلة ComicsEntry - TypeScript Errors (خطيرة)
**الملف:** `seanime-web/src/app/(main)/comics/page.tsx`
**الأسطر:** 385, 390, 394, 401, 407, 413

**المشكلة:** 
الكود يحاول الوصول إلى `entry.media` لكن `ComicsEntry` لا يحتوي على خاصية `media`. 
النوع الحالي:
```typescript
export interface ComicsEntry {
    id: number
    mediaId: number
    title: string
    coverImage: string
    bannerImage: string
    // ... لا يوجد media
}
```

**الحل:** 
- إضافة خاصية `media` إلى `ComicsEntry` في `comics.hooks.ts`
- أو تعديل `comics/page.tsx` لاستخدام الخصائص المباشرة

### 2. مشكلة AI Settings Form (متوسطة)
**الملف:** `seanime-web/src/app/(main)/settings/_containers/ai-settings.tsx`

**المشكلة:**
النموذج يستخدم `document.getElementById` وجمع البيانات يدوياً، وهذا قد يسبب مشاكل في إرسال البيانات.

**الحل:**
- استخدام `Form` component من `@/components/ui/form` بشكل صحيح
- ربط النموذج بـ `react-hook-form` مع `zod` validation

### 3. مشاكل في Routes Backend (منخفضة)
**الملف:** `internal/handlers/routes.go`

**المشكلة:**
بعض الـ endpoints في الفرونت اند غير مسجلة في الباك اند.

**الحل:**
- التأكد من تسجيل جميع endpoints المستخدمة في الفرونت اند

---

## خطة الإصلاح

### المرحلة 1: إصلاح ComicsEntry (أولوية عالية)

#### 1.1 تحديث `comics.hooks.ts`
```typescript
export interface ComicsEntry {
    id: number
    mediaId: number
    title: string
    coverImage: string
    bannerImage: string
    country: string
    chaptersRead: number
    totalChapters: number
    progress: number
    status: string
    score: number
    genres: string[]
    tags: string[]
    description: string
    year: number
    latestChapter?: {
        number: number
        title: string
        date: string
    }
    isFavourite: boolean
    // إضافة خاصية media للتوافق مع الكود القديم
    media?: {
        id: number
        title?: {
            userPreferred?: string
        }
        coverImage?: {
            large?: string
            medium?: string
        }
        bannerImage?: string
        description?: string
        meanScore?: number
        chapters?: number
        startDate?: {
            year?: number
        }
        popularity?: number
    }
}
```

#### 1.2 تحديث `comics/page.tsx`
تعديل جميع المراجع إلى `entry.media` لتستخدم `entry` مباشرة أو إضافة الخاصية.

### المرحلة 2: إصلاح AI Settings Form (أولوية عالية)

#### 2.1 تحديث `ai-settings.tsx`
- استخدام `Form` component بشكل صحيح
- إضافة `form.handleSubmit`
- التأكد من أن `useUpdateAISettings` يستخدم POST

### المرحلة 3: التحقق من Backend Routes (أولوية متوسطة)

#### 3.1 التحقق من `routes.go`
التأكد من وجود جميع endpoints:
- `/api/v1/ai/*` - 9 endpoints ✓
- `/api/v1/anyverse/*` - 20+ endpoints ✓
- `/api/v1/comics/*` - 3 endpoints ✓

---

## الملفات التي تحتاج تعديل

### أولوية عالية:
1. `seanime-web/src/api/hooks/comics.hooks.ts` - إضافة media property
2. `seanime-web/src/app/(main)/comics/page.tsx` - إصلاح TypeScript errors
3. `seanime-web/src/app/(main)/settings/_containers/ai-settings.tsx` - إصلاح النموذج

### أولوية متوسطة:
4. `internal/handlers/comics.go` - التأكد من إرجاع media property
5. `internal/handlers/routes.go` - التحقق من جميع endpoints

---

## خطوات التنفيذ

1. ✅ فحص المشروع وفهم البنية
2. 🔄 إصلاح ComicsEntry TypeScript errors
3. 🔄 إصلاح AI Settings form
4. 🔄 التحقق من Backend routes
5. 🔄 اختبار التوافق
6. 🔄 بناء الفرونت اند

---

## ملاحظات تقنية

### ComicsEntry Structure (Backend vs Frontend)

**Backend (`internal/handlers/comics.go`):**
```go
type ComicsEntry struct {
    ID            int                                 `json:"id"`
    MediaID       int                                 `json:"mediaId"`
    Title         string                              `json:"title"`
    CoverImage    string                              `json:"coverImage"`
    BannerImage   string                              `json:"bannerImage"`
    // ... لا يوجد media property
}
```

**Frontend (`comics/page.tsx`) يتوقع:**
```typescript
entry.media?.title?.userPreferred
entry.media?.coverImage?.large
entry.media?.meanScore
```

**الحل:** إضافة media property في Backend أو تعديل Frontend لاستخدام البيانات المباشرة.

### AI Settings Hook

**Current Hook (`ai.hooks.ts`):**
```typescript
export function useUpdateAISettings() {
    return useServerMutation<boolean, AISettings>({
        endpoint: "/api/v1/ai/settings",
        method: "POST",  // ✓ صحيح
        mutationKey: ["ai-settings-update"],
    })
}
```

**المشكلة:** النموذج لا يستخدم الـ hook بشكل صحيح.

---

## التقدم الحالي

- [x] فحص Backend routes
- [x] فحص Frontend hooks  
- [x] تحديد المشاكل
- [ ] إصلاح ComicsEntry
- [ ] إصلاح AI Settings form
- [ ] اختبار التوافق
- [ ] بناء الفرونت اند
