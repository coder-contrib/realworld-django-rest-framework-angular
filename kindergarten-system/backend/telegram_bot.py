import httpx
import os
from datetime import datetime, date

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


async def send_message(chat_id: str, text: str):
    """Send message via Telegram Bot API"""
    if not TELEGRAM_BOT_TOKEN:
        print(f"[Telegram] Token yo'q. Xabar: {text}")
        return False
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{TELEGRAM_API}/sendMessage",
                json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
            )
            return response.status_code == 200
    except Exception as e:
        print(f"[Telegram] Xatolik: {e}")
        return False


async def send_payment_reminder(phone: str, student_name: str, amount: float, days_left: int):
    """Send payment reminder to parent"""
    if days_left > 0:
        text = (
            f"📋 <b>To'lov eslatmasi</b>\n\n"
            f"Assalomu alaykum!\n"
            f"Farzandingiz <b>{student_name}</b>ning oylik to'lov muddatiga "
            f"<b>{days_left} kun</b> qoldi.\n\n"
            f"💰 To'lov summasi: <b>{amount:,.0f} so'm</b>\n\n"
            f"Iltimos, o'z vaqtida to'lashni unutmang."
        )
    else:
        text = (
            f"⚠️ <b>To'lov kechikmoqda!</b>\n\n"
            f"Assalomu alaykum!\n"
            f"Farzandingiz <b>{student_name}</b>ning oylik to'lovi "
            f"<b>{abs(days_left)} kun</b> kechikmoqda.\n\n"
            f"💰 To'lov summasi: <b>{amount:,.0f} so'm</b>\n\n"
            f"Iltimos, imkon qadar tezroq to'lang."
        )
    return await send_message(phone, text)


async def send_birthday_greeting(phone: str, student_name: str):
    """Send birthday greeting"""
    text = (
        f"🎉🎂 <b>Tug'ilgan kun muborak!</b>\n\n"
        f"Hurmatli ota-ona!\n"
        f"Farzandingiz <b>{student_name}</b>ni tug'ilgan kuni bilan "
        f"chin dildan tabriklaymiz!\n\n"
        f"Sog'liq, baxt va omad tilaymiz! 🌟"
    )
    return await send_message(phone, text)


async def send_receipt(phone: str, student_name: str, amount: float, receipt_id: str):
    """Send payment receipt notification"""
    text = (
        f"✅ <b>To'lov qabul qilindi!</b>\n\n"
        f"O'quvchi: <b>{student_name}</b>\n"
        f"Summa: <b>{amount:,.0f} so'm</b>\n"
        f"Chek raqami: <b>#{receipt_id}</b>\n"
        f"Sana: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n\n"
        f"Rahmat! 🙏"
    )
    return await send_message(phone, text)
