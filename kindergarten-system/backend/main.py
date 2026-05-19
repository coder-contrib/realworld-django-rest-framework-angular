from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, timedelta
import os

from database import load_db, save_db, get_next_id
from auth import create_access_token, verify_token
from receipt import generate_receipt_pdf
from telegram_bot import send_payment_reminder, send_birthday_greeting, send_receipt

app = FastAPI(title="Smart Kindergarten API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class LoginRequest(BaseModel):
    login: str
    password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    birth_date: str
    parent_phone: str
    group: str
    monthly_fee: float
    payment_day: int = 1
    photo_url: Optional[str] = None
    telegram_chat_id: Optional[str] = None

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[str] = None
    parent_phone: Optional[str] = None
    group: Optional[str] = None
    monthly_fee: Optional[float] = None
    payment_day: Optional[int] = None
    photo_url: Optional[str] = None
    telegram_chat_id: Optional[str] = None

class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_type: str = "Naqd"
    month: str
    note: Optional[str] = None

# --- Auth Routes ---

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    db = load_db()
    admin = db["admin"]
    if req.login != admin["login"] or req.password != admin["password"]:
        raise HTTPException(status_code=401, detail="Login yoki parol noto'g'ri")
    token = create_access_token({"sub": admin["login"], "name": admin["name"]})
    return {"token": token, "name": admin["name"]}

@app.post("/api/auth/change-password")
async def change_password(req: ChangePasswordRequest, user=Depends(verify_token)):
    db = load_db()
    if req.old_password != db["admin"]["password"]:
        raise HTTPException(status_code=400, detail="Eski parol noto'g'ri")
    db["admin"]["password"] = req.new_password
    save_db(db)
    return {"message": "Parol muvaffaqiyatli o'zgartirildi"}

# --- Student Routes ---

@app.get("/api/students")
async def get_students(user=Depends(verify_token)):
    db = load_db()
    return db["students"]

@app.get("/api/students/{student_id}")
async def get_student(student_id: int, user=Depends(verify_token)):
    db = load_db()
    student = next((s for s in db["students"] if s["id"] == student_id), None)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return student

@app.post("/api/students")
async def create_student(student: StudentCreate, user=Depends(verify_token)):
    db = load_db()
    new_student = student.model_dump()
    new_student["id"] = get_next_id(db["students"])
    new_student["created_at"] = datetime.now().isoformat()
    new_student["active"] = True
    db["students"].append(new_student)
    save_db(db)
    return new_student

@app.put("/api/students/{student_id}")
async def update_student(student_id: int, student: StudentUpdate, user=Depends(verify_token)):
    db = load_db()
    idx = next((i for i, s in enumerate(db["students"]) if s["id"] == student_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    update_data = student.model_dump(exclude_unset=True)
    db["students"][idx].update(update_data)
    save_db(db)
    return db["students"][idx]

@app.delete("/api/students/{student_id}")
async def delete_student(student_id: int, user=Depends(verify_token)):
    db = load_db()
    idx = next((i for i, s in enumerate(db["students"]) if s["id"] == student_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    db["students"].pop(idx)
    save_db(db)
    return {"message": "O'quvchi o'chirildi"}

# --- Payment Routes ---

@app.get("/api/payments")
async def get_payments(student_id: Optional[int] = None, user=Depends(verify_token)):
    db = load_db()
    payments = db["payments"]
    if student_id:
        payments = [p for p in payments if p["student_id"] == student_id]
    return payments

@app.post("/api/payments")
async def create_payment(payment: PaymentCreate, user=Depends(verify_token)):
    db = load_db()
    student = next((s for s in db["students"] if s["id"] == payment.student_id), None)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    new_payment = payment.model_dump()
    new_payment["id"] = get_next_id(db["payments"])
    new_payment["date"] = datetime.now().strftime("%d.%m.%Y %H:%M")
    new_payment["student_name"] = f"{student['first_name']} {student['last_name']}"
    new_payment["group"] = student["group"]
    db["payments"].append(new_payment)
    save_db(db)

    # Generate receipt PDF
    receipt_path = generate_receipt_pdf(new_payment)
    new_payment["receipt_path"] = receipt_path

    # Send Telegram notification
    if student.get("telegram_chat_id"):
        await send_receipt(
            student["telegram_chat_id"],
            new_payment["student_name"],
            payment.amount,
            str(new_payment["id"])
        )

    return new_payment

@app.get("/api/payments/{payment_id}/receipt")
async def get_receipt(payment_id: int, user=Depends(verify_token)):
    db = load_db()
    payment = next((p for p in db["payments"] if p["id"] == payment_id), None)
    if not payment:
        raise HTTPException(status_code=404, detail="To'lov topilmadi")

    # Generate fresh receipt
    receipt_path = generate_receipt_pdf(payment)
    return FileResponse(receipt_path, filename=f"receipt_{payment_id}.pdf", media_type="application/pdf")

# --- Statistics ---

@app.get("/api/statistics")
async def get_statistics(user=Depends(verify_token)):
    db = load_db()
    students = db["students"]
    payments = db["payments"]

    current_month = datetime.now().strftime("%m.%Y")
    month_payments = [p for p in payments if current_month in p.get("date", "")]

    total_students = len([s for s in students if s.get("active", True)])
    total_income = sum(p["amount"] for p in month_payments)

    # Calculate debtors
    paid_student_ids = set(p["student_id"] for p in month_payments)
    active_students = [s for s in students if s.get("active", True)]
    debtors = [s for s in active_students if s["id"] not in paid_student_ids]

    # Group statistics
    groups = {}
    for s in active_students:
        g = s.get("group", "Boshqa")
        groups[g] = groups.get(g, 0) + 1

    return {
        "total_students": total_students,
        "total_debtors": len(debtors),
        "monthly_income": total_income,
        "groups": groups,
        "recent_payments": sorted(payments, key=lambda x: x.get("id", 0), reverse=True)[:10],
        "debtors": [{"id": s["id"], "name": f"{s['first_name']} {s['last_name']}", "fee": s["monthly_fee"]} for s in debtors]
    }

# --- Groups ---

@app.get("/api/groups")
async def get_groups(user=Depends(verify_token)):
    db = load_db()
    return db.get("groups", [])

# --- Check Reminders (can be called by cron) ---

@app.post("/api/check-reminders")
async def check_reminders(user=Depends(verify_token)):
    db = load_db()
    today = date.today()
    sent = 0

    for student in db["students"]:
        if not student.get("active", True):
            continue

        # Check birthday
        try:
            bday = datetime.strptime(student["birth_date"], "%Y-%m-%d").date()
            if bday.month == today.month and bday.day == today.day:
                if student.get("telegram_chat_id"):
                    await send_birthday_greeting(
                        student["telegram_chat_id"],
                        f"{student['first_name']} {student['last_name']}"
                    )
                    sent += 1
        except (ValueError, KeyError):
            pass

        # Check payment due
        payment_day = student.get("payment_day", 1)
        days_until = payment_day - today.day
        if days_until == 2 or days_until < 0:
            if student.get("telegram_chat_id"):
                await send_payment_reminder(
                    student["telegram_chat_id"],
                    f"{student['first_name']} {student['last_name']}",
                    student["monthly_fee"],
                    days_until
                )
                sent += 1

    return {"message": f"{sent} ta xabar yuborildi"}


# Serve frontend static files
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIR, "static")), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
