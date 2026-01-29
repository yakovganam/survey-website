const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surveydb';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Atlas-ready)
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

// Helpful healthcheck
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    status: state === 1 ? 'ok' : 'db_unavailable',
    mongoState: state,
  });
});

// Survey Schema
const surveySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  questions: [
    {
      question: { type: String, required: true, trim: true },
      type: { type: String, enum: ['text', 'multiple', 'yesno'], required: true },
      options: [{ type: String }], // for multiple choice
    },
  ],
  responses: [
    {
      answers: [{ type: String }], // array of answers matching questions
      submittedAt: { type: Date, default: Date.now },
    },
  ],
});

const Survey = mongoose.model('Survey', surveySchema);

// Guard: if DB is unavailable, return friendly error
function ensureDbConnected(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'מסד הנתונים אינו זמין כרגע. וודא שמונגו-דיבי פעיל או שה-MONGODB_URI נכון.',
      hint: 'לשימוש מקומי: התקן והפעל MongoDB, או ספק MONGODB_URI עבור MongoDB Atlas.',
    });
  }
  next();
}

// Routes
app.get('/api/surveys', ensureDbConnected, async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/surveys/:id', ensureDbConnected, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    res.status(400).json({ error: 'Invalid survey id' });
  }
});

app.post('/api/surveys/:id/responses', ensureDbConnected, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers must be an array' });
    }
    if (answers.length !== survey.questions.length) {
      return res.status(400).json({ error: 'answers length must match number of questions' });
    }

    survey.responses.push({ answers });
    await survey.save();
    res.json({ message: 'Response submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/surveys/:id/results', ensureDbConnected, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    const totalResponses = survey.responses.length;
    const results = survey.questions.map((q, qIndex) => {
      const stats = {
        question: q.question,
        type: q.type,
        total: totalResponses,
        data: {}
      };

      if (q.type === 'multiple' || q.type === 'yesno') {
        const counts = {};
        const options = q.type === 'yesno' ? ['Yes', 'No'] : q.options;
        options.forEach(opt => counts[opt] = 0);

        survey.responses.forEach(resp => {
          const answer = resp.answers[qIndex];
          if (answer && counts.hasOwnProperty(answer)) {
            counts[answer]++;
          }
        });
        stats.data = counts;
      } else if (q.type === 'text') {
        stats.data = survey.responses.map(resp => resp.answers[qIndex]).filter(Boolean);
      }

      return stats;
    });

    res.json({
      title: survey.title,
      totalResponses,
      results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// For deployment, serve static frontend from project root
app.use(express.static(require('path').join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI.includes('mongodb://localhost') ? 'local' : 'external/Atlas'}`);
});