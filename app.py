from flask import Flask, render_template, request, jsonify
from urllib.parse import urlparse

app = Flask(__name__)


# ==========================
# HOME PAGE
# ==========================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# EMAIL ANALYZER
# ==========================

@app.route("/analyze", methods=["POST"])
def analyze_email():

    data = request.get_json()

    email = data.get("email", "").lower()

    if not email:
        return jsonify({
            "success": False,
            "message": "Please enter an email."
        })


    threats = []
    risk_score = 0


    # Suspicious words
    suspicious_words = [
        "urgent",
        "verify your account",
        "click here",
        "password",
        "login",
        "winner",
        "prize",
        "bank",
        "otp",
        "account suspended",
        "confirm your account"
    ]


    for word in suspicious_words:

        if word in email:

            threats.append(
                f"Suspicious phrase detected: {word}"
            )

            risk_score += 10


    # Check for links
    if "http://" in email or "https://" in email:

        threats.append(
            "Email contains a web link."
        )

        risk_score += 15


    # Urgency
    if "urgent" in email or "immediately" in email:

        threats.append(
            "Urgency-based language detected."
        )

        risk_score += 15


    # Limit score
    risk_score = min(risk_score, 100)


    # Determine level
    if risk_score >= 60:

        status = "🚨 HIGH RISK"
        level = "high"

    elif risk_score >= 30:

        status = "⚠️ SUSPICIOUS"
        level = "medium"

    else:

        status = "✅ LOW RISK"
        level = "low"


    return jsonify({

        "success": True,

        "status": status,

        "level": level,

        "risk_score": risk_score,

        "threats": threats

    })


# ==========================
# URL SCANNER
# ==========================

@app.route("/check-url", methods=["POST"])
def check_url():

    data = request.get_json()

    url = data.get("url", "").strip()


    if not url:

        return jsonify({

            "success": False,

            "message": "Please enter a URL."

        })


    warnings = []

    risk_score = 0


    # Add scheme if missing
    if not url.startswith(("http://", "https://")):

        url_for_parse = "http://" + url

    else:

        url_for_parse = url


    parsed = urlparse(url_for_parse)

    domain = parsed.netloc


    # HTTP instead of HTTPS
    if url_for_parse.startswith("http://"):

        warnings.append(
            "Website does not use HTTPS."
        )

        risk_score += 25


    # IP address URL
    domain_parts = domain.split(".")


    if all(part.isdigit() for part in domain_parts
           if part):

        warnings.append(
            "URL appears to use an IP address."
        )

        risk_score += 30


    # Suspicious URL words
    suspicious_words = [
        "login",
        "verify",
        "secure",
        "account",
        "update",
        "password",
        "bank"
    ]


    for word in suspicious_words:

        if word in url.lower():

            warnings.append(
                f"Suspicious keyword detected: {word}"
            )

            risk_score += 10


    risk_score = min(risk_score, 100)


    if risk_score >= 50:

        status = "🚨 HIGH RISK"

    elif risk_score >= 25:

        status = "⚠️ SUSPICIOUS"

    else:

        status = "✅ LOW RISK"


    return jsonify({

        "success": True,

        "status": status,

        "risk_score": risk_score,

        "domain": domain,

        "warnings": warnings

    })


# ==========================
# RUN SERVER
# ==========================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5001
    )