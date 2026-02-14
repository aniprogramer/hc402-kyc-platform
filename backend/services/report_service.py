from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import TableStyle
from datetime import datetime
import os

def generate_kyc_report(kyc_data, output_path):

    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("KYC Verification Report", styles["Heading1"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph(f"Generated on: {datetime.utcnow()}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    data = [
        ["Field", "Value"],
        ["KYC ID", kyc_data["kyc_id"]],
        ["OCR Confidence", str(kyc_data["ocr_confidence"])],
        ["Face Match Score", str(kyc_data["face_match_score"])],
        ["Status", kyc_data["status"]],
    ]

    table = Table(data, colWidths=[2 * inch, 3 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
    ]))

    elements.append(table)

    doc.build(elements)
