const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const scoresFilePath = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(bodyParser.json());

// دالة لقراءة النقاط من الملف
const readScores = () => {
    try {
        const data = fs.readFileSync(scoresFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// دالة لحفظ النقاط في الملف
const writeScores = (scores) => {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2), 'utf8');
};

// مسار لحفظ النقاط الجديدة
app.post('/api/scores', (req, res) => {
    const newScore = req.body;
    const scores = readScores();
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score); // ترتيب النقاط من الأكبر للأصغر
    writeScores(scores);
    res.status(201).json({ message: 'Score saved successfully' });
});

// مسار لجلب النقاط
app.get('/api/scores', (req, res) => {
    const scores = readScores();
    res.status(200).json(scores);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});