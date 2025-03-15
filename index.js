
//using local storage to store the student records

let students = JSON.parse(localStorage.getItem('students')) || [];

document.querySelectorAll('.skill-container').forEach(container => {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const progressBar = container.querySelector('.skill-progress');
    const progressDisplay = container.querySelector('[id$="-progress-display"]');
    const levelDisplay = container.querySelector('[id$="-skill-level-display"]');
    const levelNameDisplay = container.querySelector('[id$="-skill-level-name"]');
    const form = document.getElementById('student_registration');

    const levelNames = {
        0: "None",
        20: "Beginner",
        40: "Novice",
        60: "Intermediate",
        80: "Advanced",
        100: "Expert"
    };

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let maxValue = 0;
            checkboxes.forEach((cb, index) => {
                if (cb.checked) {
                    maxValue = Math.max(maxValue, (index + 1) * 20);
                }
            });

            progressBar.style.width = maxValue + '%';
            levelDisplay.textContent = maxValue + '%';
            levelNameDisplay.textContent = levelNames[maxValue];
            progressDisplay.style.display = maxValue > 0 ? 'block' : 'none';
        });
    });
});

let imageBase64 = null;

document.getElementById('img').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
            imageBase64 = e.target.result; // Store the Base64 data
        };
        reader.readAsDataURL(file);
    }
});

const btn = document.querySelector('.submit_btn');

const checkEmpty = value => value.trim() === "";

const validators = {
    fname: name => !checkEmpty(name) && name.trim().length >= 3 && /^[a-zA-Z]+$/.test(name),
    mail: email => !checkEmpty(email) && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email),
    phone: phno => !checkEmpty(phno) && /^\+?[\d\s-]+$/.test(phno),
    addr: address => !checkEmpty(address),
    regno: reg => !checkEmpty(reg),
    college: inst => !checkEmpty(inst),
    father: fatherName => !checkEmpty(fatherName),
    mother: motherName => !checkEmpty(motherName),
    emergency_contact: emergencyContact => !checkEmpty(emergencyContact) && /^\+?[\d\s-]+$/.test(emergencyContact),
    degree: degreeName => !checkEmpty(degreeName),
    github: githubLink => !checkEmpty(githubLink)
};

const errorMessages = {
    fname: "Invalid First Name",
    mail: "Invalid Email",
    phone: "Invalid Phone Number",
    addr: "Address cannot be empty",
    regno: "Register Number cannot be empty",
    college: "Institution cannot be empty",
    father: "Father's name cannot be empty",
    mother: "Mother's name cannot be empty",
    emergency_contact: "Emergency contact cannot be empty",
    degree: "Degree cannot be empty",
    github: "Github link cannot be empty"
};

const markInvalid = (input, message) => {
    input.classList.add('error');
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
};

const markValid = input => {
    input.classList.remove('error');
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.style.display = 'none';
};

btn.addEventListener('click', event => {
    event.preventDefault();
    let isValid = true;
    const form = document.getElementById('student_registration');

    for (const field in validators) {
        const input = document.getElementById(field);
        if (!validators[field](input.value)) {
            isValid = false;
            markInvalid(input, errorMessages[field]);
        } else {
            markValid(input);
        }
    }

    if (isValid) {
        const newStudent = {};
        for (const field in validators) {
            newStudent[field] = document.getElementById(field).value;
        }

        // Collect skill data
        newStudent.skills = {};
        newStudent.image = imageBase64;
        document.querySelectorAll('.skill-container').forEach(container => {
            const skillName = container.querySelector('span').textContent;
            newStudent.skills[skillName] = [];
            container.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
                if (checkbox.checked) {
                    newStudent.skills[skillName].push(index + 1); // Store the level
                }
            });
        });

        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));

        if (typeof displayStudents === 'function') {
            displayStudents();
        }

        form.reset();
        document.getElementById('uploadedImage').src = "./anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.avif";
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('[id$="-progress-display"]').forEach(element => element.style.display = 'none');
    }
});

document.getElementById('viewRecordsButton').addEventListener('click', () => {
    window.location.href = 'records.html';
});

// Call displayStudents on page load
displayStudents();


