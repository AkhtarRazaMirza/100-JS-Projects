document.addEventListener("DOMContentLoaded", function () {
    const expanceForm = document.getElementById("expense-form");
    const expanceName = document.getElementById("expense-name")
    const expanceAmount = document.getElementById("expense-amount");
    const expanceList = document.getElementById("expense-list");
    const total = document.getElementById("total");
    const totalExpance = document.getElementById("total-amount");

    let expances = JSON.parse(localStorage.getItem("expance")) || [];
    let totalAmount = calculateTotal();

    renderExpences();

    expanceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let name = expanceName.value.trim();
        let amount = parseFloat(expanceAmount.value.trim())
        if (name === "" && amount === NaN && amount > 0) return;
        const newExpance = {
            id: Date.now(),
            name: name,
            amount: amount,
        };
        expances.push(newExpance);
        saveExpences();
        renderExpences();
        updateTotal();
        expanceName.value = "";
        expanceAmount.value = "";
    })

    function calculateTotal() {
        return expances.reduce((sum, expances) => sum + expances.amount, 0);
    };

    function saveExpences() {
        localStorage.setItem("expance", JSON.stringify(expances));
    };

    function updateTotal() {
        totalAmount = calculateTotal();
        totalExpance.textContent = totalAmount;
    }

    function renderExpences() {
        expanceList.innerHTML = "";
        expances.forEach((expance) => {
            let li = document.createElement("li");
            li.innerHTML = `
       ${expance.name} - $${expance.amount}
       <button data-id = "${expance.id}"> Remove </button>
       `;
            expanceList.appendChild(li);
        });
    };

    expanceList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            let expanceId = parseInt(e.target.getAttribute("data-id"));
            expances = expances.filter((expance) => expance.id !== expanceId);

            saveExpences();
            renderExpences();
            updateTotal();
        };
    });

});