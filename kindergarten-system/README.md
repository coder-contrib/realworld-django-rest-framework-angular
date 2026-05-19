# Smart Kindergarten & Learning Center Management System

Zamonaviy bog'cha va o'quv markazlar uchun mo'ljallangan to'liq avtomatlashtirilgan CRM va boshqaruv tizimi.

## Tizim imkoniyatlari

- **Login tizimi** - Admin autentifikatsiya (Login: 993190712, Parol: 12345678)
- **O'quvchilarni boshqarish** - Qo'shish, tahrirlash, o'chirish
- **To'lov tizimi** - To'lovlarni kuzatish, qarzdorlarni aniqlash
- **Telegram bot** - Avtomatik eslatmalar va tug'ilgan kun tabriklari
- **Elektron chek** - PDF chek yaratish va yuklab olish
- **Dashboard** - Statistikalar va hisobotlar

## Texnologiyalar

- **Frontend**: React, React Router, Axios
- **Backend**: Python, FastAPI, Uvicorn
- **Database**: JSON file
- **PDF**: fpdf2
- **Bot**: Telegram Bot API (httpx)

## Ishga tushirish

```bash
cd kindergarten-system
chmod +x start.sh
./start.sh start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/docs

## API Endpoints

- `POST /api/auth/login` - Kirish
- `POST /api/auth/change-password` - Parol o'zgartirish
- `GET/POST /api/students` - O'quvchilar
- `PUT/DELETE /api/students/{id}` - O'quvchini tahrirlash/o'chirish
- `GET/POST /api/payments` - To'lovlar
- `GET /api/payments/{id}/receipt` - PDF chek
- `GET /api/statistics` - Statistikalar
- `POST /api/check-reminders` - Telegram eslatmalar

## Telegram Bot

`TELEGRAM_BOT_TOKEN` environment variable o'rnatib, Telegram bot integratsiyasini yoqish mumkin.
