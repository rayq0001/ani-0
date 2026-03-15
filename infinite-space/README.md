# 🌌 الفضاء اللامتناهي - Infinite Space

مشروع Microservices متكامل يجمع بين Go للسرعة وNode.js للذكاء الاصطناعي مع واجهة Three.js ثلاثية الأبعاد.

## 🏗️ هيكل المشروع

```
infinite-space/
├── go-data-service/     # خدمة البيانات السريعة (Go)
├── node-ai-service/     # خدمة الذكاء الاصطناعي (Node.js)
└── frontend/            # واجهة المستخدم (HTML/CSS/JS + Three.js)
```

## 🚀 طريقة التشغيل

### 1. تشغيل خدمة Go (البيانات)
```bash
cd go-data-service
go run main.go
```
- يعمل على: `http://localhost:8080`

### 2. تشغيل خدمة Node.js (الذكاء الاصطناعي)
```bash
cd node-ai-service
npm start
```
- يعمل على: `http://localhost:3000`

### 3. فتح الواجهة الأمامية
```bash
cd frontend
# افتح index.html في المتصفح أو استخدم خادم محلي
npx serve .
```
- يعمل على: `http://localhost:3000` (أو أي منفذ آخر)

## ✨ المميزات

- 🔥 **مجرة حلزونية** - 6000 نجمة مع تأثيرات توهج
- 🤖 **ذكاء اصطناعي** - توليد قصص تلقائية للكواكب
- 🎨 **تصميم زجاجي** - Glassmorphism UI مع دعم RTL
- ⚡ **سرعة فائقة** - Go للبيانات + Node.js للمعالجة
- 🌐 **دعم عربي كامل** - واجهة RTL مع نصوص عربية

## 🔌 نقاط النهاية (API Endpoints)

### Go Data Service (Port 8080)
- `GET /api/data/{planetName}` - جلب بيانات الكوكب

### Node.js AI Service (Port 3000)
- `GET /api/explore/{planetName}` - استكشاف الكوكب مع قصة AI

## 📝 مثال الاستخدام

1. افتح `http://localhost:3000` (الواجهة)
2. اكتب "ون بيس" أو "One Piece" في مربع البحث
3. اضغط "انطلاق 🚀"
4. شاهد المجرة تتحرك وظهور معلومات الكوكب!

## 🛠️ التقنيات المستخدمة

- **Backend**: Go (Echo), Node.js (Express)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **AI Integration**: محاكاة (جاهز للربط مع OpenAI)

---

تم إنشاؤه ب❤️ لعشاق الأنمي والفضاء! 🚀✨
