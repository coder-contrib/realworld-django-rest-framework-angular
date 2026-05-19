from fpdf import FPDF
from datetime import datetime
import os

RECEIPTS_DIR = os.path.join(os.path.dirname(__file__), "receipts")
os.makedirs(RECEIPTS_DIR, exist_ok=True)


def generate_receipt_pdf(payment_data: dict) -> str:
    """Generate PDF receipt for a payment"""
    pdf = FPDF()
    pdf.add_page()

    # Use built-in font that supports basic characters
    pdf.set_font("Helvetica", size=16)

    # Header
    pdf.set_fill_color(76, 175, 80)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 15, "SMART KINDERGARTEN", ln=True, align="C", fill=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)

    # Receipt title
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, f"Chek #{payment_data['id']}", ln=True, align="C")
    pdf.ln(5)

    # Line
    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Details
    pdf.set_font("Helvetica", size=11)

    details = [
        ("Sana:", payment_data.get("date", datetime.now().strftime("%d.%m.%Y %H:%M"))),
        ("O'quvchi:", payment_data.get("student_name", "")),
        ("Guruh:", payment_data.get("group", "")),
        ("Summa:", f"{payment_data.get('amount', 0):,.0f} so'm"),
        ("To'lov turi:", payment_data.get("payment_type", "Naqd")),
        ("Oy:", payment_data.get("month", "")),
    ]

    for label, value in details:
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(50, 8, label)
        pdf.set_font("Helvetica", size=11)
        pdf.cell(0, 8, str(value), ln=True)

    pdf.ln(10)

    # Line
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Footer
    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 8, "Smart Kindergarten Management System", ln=True, align="C")
    pdf.cell(0, 8, f"Yaratilgan: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}", ln=True, align="C")

    # Save PDF
    filename = f"receipt_{payment_data['id']}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join(RECEIPTS_DIR, filename)
    pdf.output(filepath)

    return filepath
