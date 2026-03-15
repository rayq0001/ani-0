const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// هنا يمكنك دمج OpenAI API لاحقاً
async function generateAIStory(planetName) {
    // محاكاة لتأخير الذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 800));
    if (planetName.includes("ون بيس") || planetName.toLowerCase().includes("one piece")) {
        return "في عالم تغطيه البحار، ينطلق فتى مطاطي يدعى لوفي لجمع طاقم من القراصنة للبحث عن الكنز الأسطوري 'ون بيس' ليصبح ملك القراصنة الجديد. رحلة مليئة بالغموض، القوى الخارقة، والصداقة اللامتناهية.";
    }
    return `هذا الكوكب المسمى ${planetName} لا يزال قيد الاستكشاف. لا توجد سجلات كافية في بنك معلومات الذكاء الاصطناعي.`;
}

app.get('/api/explore/:name', async (req, res) => {
    try {
        const planetName = req.params.name;

        // 1. جلب البيانات من خدمة Go
        const goResponse = await axios.get(`http://localhost:8080/api/data/${encodeURIComponent(planetName)}`);
        const planetData = goResponse.data;

        // 2. توليد القصة بالذكاء الاصطناعي
        const aiStory = await generateAIStory(planetName);

        // 3. دمج وإرسال النتيجة
        res.json({
            ...planetData,
            story: aiStory
        });

    } catch (error) {
        res.status(500).json({ error: "فشل في الاتصال بالمجرة" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node.js AI Gateway running on port ${PORT}...`);
});
