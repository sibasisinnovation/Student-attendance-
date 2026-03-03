let tableBody = document.querySelector("#attendanceTable tbody");

// Load saved data
window.onload = function() {
    loadData();
};

function addStudent() {
    let name = document.getElementById("studentName").value;
    if (name === "") {
        alert("Please enter student name");
        return;
    }

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        ${createCheckbox()}
        ${createCheckbox()}
        ${createCheckbox()}
        ${createCheckbox()}
        ${createCheckbox()}
        ${createCheckbox()}
        <td class="total">0</td>
    `;

    tableBody.appendChild(row);
    document.getElementById("studentName").value = "";

    saveData();
}

function createCheckbox() {
    return `<td><input type="checkbox" onchange="updateTotal(this)"></td>`;
}

function updateTotal(checkbox) {
    let row = checkbox.parentElement.parentElement;
    let checkboxes = row.querySelectorAll("input[type='checkbox']");
    let total = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) total++;
    });

    row.querySelector(".total").innerText = total;

    saveData();
}

function saveData() {
    localStorage.setItem("attendanceData", tableBody.innerHTML);
}

function loadData() {
    let data = localStorage.getItem("attendanceData");
    if (data) {
        tableBody.innerHTML = data;
    }
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

function addStudent(name) {
    db.collection("students").add({
        name: name,
        subjects: {
            math: false,
            science: false,
            english: false,
            history: false,
            computer: false,
            physics: false
        },
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

function deleteStudent(id) {
    db.collection("students").doc(id).delete();
}

function editStudent(id, newName) {
    db.collection("students").doc(id).update({
        name: newName
    });
}

function calculatePercentage(subjects) {
    let total = Object.values(subjects).filter(v => v).length;
    return (total / 6) * 100;
}

db.collection("students")
.where("createdAt", ">=", startOfMonth)
.where("createdAt", "<=", endOfMonth)
.get();

function exportExcel() {
    let table = document.getElementById("attendanceTable");
    let workbook = XLSX.utils.table_to_book(table, {sheet:"Sheet1"});
    XLSX.writeFile(workbook, "Attendance_Report.xlsx");
}
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "index.html";
    }
});