// ==============================
// SECTION NAVIGATION
// ==============================

function showSection(sectionId) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.remove("active-section");
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }

    // Update sidebar button
    const buttons = document.querySelectorAll(".nav-item");

    buttons.forEach(function(button) {
        button.classList.remove("active");
    });

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==============================
// EMAIL ANALYZER
// ==============================

async function analyzeEmail() {

    const emailInput =
        document.getElementById("emailInput");

    const result =
        document.getElementById("emailResult");

    const email = emailInput.value.trim();


    if (!email) {

        alert("Please enter an email first.");

        return;
    }


    // Show loading
    result.classList.remove("hidden");

    result.innerHTML = `
        <p>🔄 Analyzing email...</p>
    `;


    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email
            })

        });


        const data = await response.json();


        if (!data.success) {

            result.innerHTML = `
                <p>${data.message}</p>
            `;

            return;
        }


        // Decide result color
        let statusClass = "safe";


        if (data.level === "medium") {
            statusClass = "warning";
        }


        if (data.level === "high") {
            statusClass = "danger";
        }


        // Threat list
        let threatHTML = "";


        if (data.threats.length > 0) {

            threatHTML = `
                <h3>⚠️ Detected Threats</h3>
                <ul class="threat-list">
            `;


            data.threats.forEach(function(threat) {

                threatHTML += `
                    <li>${threat}</li>
                `;

            });


            threatHTML += `
                </ul>
            `;

        } else {

            threatHTML = `
                <p>
                    ✅ No major threat indicators detected.
                </p>
            `;

        }


        // Display result
        result.innerHTML = `

            <div class="result-title ${statusClass}">
                ${data.status}
            </div>

            <p>
                Email analysis completed successfully.
            </p>

            <div class="risk ${statusClass}">
                ${data.risk_score}%
            </div>

            <p>
                Threat Risk Score
            </p>

            ${threatHTML}

        `;

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `
            <p class="danger">
                ❌ Unable to analyze the email.
            </p>
        `;

    }

}


// ==============================
// URL SCANNER
// ==============================

async function checkURL() {

    const urlInput =
        document.getElementById("urlInput");

    const result =
        document.getElementById("urlResult");

    const url = urlInput.value.trim();


    if (!url) {

        alert("Please enter a URL first.");

        return;
    }


    // Loading message
    result.classList.remove("hidden");

    result.innerHTML = `
        <p>🔄 Scanning URL...</p>
    `;


    try {

        const response = await fetch("/check-url", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })

        });


        const data = await response.json();


        if (!data.success) {

            result.innerHTML = `
                <p>${data.message}</p>
            `;

            return;
        }


        // Decide result color
        let statusClass = "safe";


        if (data.risk_score >= 25) {
            statusClass = "warning";
        }


        if (data.risk_score >= 50) {
            statusClass = "danger";
        }


        // Warnings
        let warningHTML = "";


        if (data.warnings.length > 0) {

            warningHTML = `
                <h3>⚠️ Warnings</h3>
                <ul class="threat-list">
            `;


            data.warnings.forEach(function(warning) {

                warningHTML += `
                    <li>${warning}</li>
                `;

            });


            warningHTML += `
                </ul>
            `;

        } else {

            warningHTML = `
                <p>
                    ✅ No obvious suspicious URL patterns detected.
                </p>
            `;

        }


        // Display result
        result.innerHTML = `

            <div class="result-title ${statusClass}">
                ${data.status}
            </div>

            <p>
                Domain: ${data.domain}
            </p>

            <div class="risk ${statusClass}">
                ${data.risk_score}%
            </div>

            <p>
                URL Risk Score
            </p>

            ${warningHTML}

        `;

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `
            <p class="danger">
                ❌ Unable to scan URL.
            </p>
        `;

    }

}