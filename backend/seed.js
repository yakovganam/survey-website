const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surveydb';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    const surveySchema = new mongoose.Schema({
      title: { type: String, required: true, trim: true },
      description: { type: String, default: '', trim: true },
      questions: [{
        question: { type: String, required: true, trim: true },
        type: { type: String, enum: ['text', 'multiple', 'yesno'], required: true },
        options: [String]
      }],
      responses: []
    });

    const Survey = mongoose.model('Survey', surveySchema);

    // Clear existing
    await Survey.deleteMany({});

    const dummyData = [
      {
        title: "סקר בחירות 2026",
        description: "למי תצביע בבחירות הקרובות לכנסת?",
        questions: [
          {
            question: "במידה והבחירות היו מתקיימות היום, לאיזו מפלגה היית מצביע?",
            type: "multiple",
            options: ["הליכוד", "יש עתיד", "המחנה הממלכתי", "ש\"ס", "עוצמה יהודית", "אחר"]
          },
          {
            question: "האם אתה מרוצה מתפקוד הממשלה הנוכחית?",
            type: "yesno"
          }
        ]
      },
      {
        title: "סקר שביעות רצון - נועם עוזר אישי",
        description: "נשמח לשמוע מה דעתך על השירות של נועם.",
        questions: [
          {
            question: "איך היית מדורג את המקצועיות של נועם? (1-10)",
            type: "text"
          },
          {
            question: "האם היית ממליץ על נועם לחברים?",
            type: "yesno"
          }
        ]
      }
    ];

    await Survey.insertMany(dummyData);
    console.log('Dummy data inserted successfully!');
    process.exit();
  })
  .catch((err) => {
    console.error('Error seeding data:', err.message);
    console.error('Tip: ודא שמונגו-דיבי פעיל מקומית, או שסיפקת MONGODB_URI תקין ל-Atlas.');
    process.exit(1);
  });