
## פריסה על שרת פרטי (Docker Compose עם Mongo מקומי)

### דרישות
- Docker + Docker Compose מותקנים.
- פתוחים רק פורטים 80/443 לציבור.

### צעדים
1. ערוך את הקובץ `.env` (נוצר כבר):
   - PORT=3000 (פורט פנימי של האפליקציה)
   - MONGODB_URI=mongodb://root:rootpass@mongo:27017/surveydb?authSource=admin
   - MONGO_ROOT_USERNAME=root
   - MONGO_ROOT_PASSWORD=rootpass
   - ALLOWED_ORIGIN=https://הדומיין-שלך
2. הרם את השירותים:
   - docker compose up -d --build
3. זריעת נתונים (אופציונלי):
   - docker compose exec web node backend/seed.js
4. הפוך את השירות לזמין בדומיין דרך NGINX (אם צריך SSL):
   - proxy_pass http://127.0.0.1:80;
   - השתמש ב-certbot לקבלת תעודה.

### אבטחה והקשחה
- אל תחשוף את פורט Mongo לציבור (ה-compose לא חושף אותו).
- גיבויים: הוסף קרון ל-mongodump על ווליום mongo_data.
- עדכון סיסמאות בקובץ `.env` לפני פריסה לייצור.

### פיקוח ותפעול
- לוגים: docker compose logs -f web
- אתחול: docker compose restart web
- סטטוס: docker compose ps

### הערה
אם אתה מאחורי Cloudflare (Proxy/Tunnel), הפנה את ה-Record לדומיין שלך אל השרת, או השתמש ב-Cloudflare Tunnel כדי לחשוף רק 80/443 בצורה מוגנת.
