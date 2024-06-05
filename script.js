// Hide the password by replacing characters with asterisks
const hidePassword = (password) => {
  return "*".repeat(password.length);
};

// Show or hide password based on checkbox state
const togglePasswordVisibility = (checkbox, index) => {
  const passwordField = document.getElementById(index + "2");
  const password = passwordField.getAttribute("data-password");
  if (checkbox.checked) {
    passwordField.innerText = password;
  } else {
    passwordField.innerText = hidePassword(password);
  }
};

// Copy content to clipboard and show alert messages based on success or failure
const copyContent = (content) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      showAlert("Copied", "success");
    })
    .catch((err) => {
      showAlert("Copying Failed", "error");
    });
};

// Show alert messages
const showAlert = (message, type) => {
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type}`;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 2000);
};

// Delete password data based on the provided index
const deletePasswordData = (index) => {
  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordData = JSON.parse(passwordDetails);
  passwordData.splice(index, 1);
  localStorage.setItem("passwordDetails", JSON.stringify(passwordData));
  showAlert("Password Deleted Successfully.", "success");
  populateSavedPasswordDetails();
};

// Edit password data based on the provided index
const editPasswordData = (index) => {
  let table = document.querySelector("table");
  let passwordDetails = localStorage.getItem("passwordDetails");

  table.innerHTML = `<tr>
              <th>Website</th>
              <th>Username</th>
              <th>Password</th>
              <th>Action</th>
          </tr>`;

  let passwordData = JSON.parse(passwordDetails);
  let html = "";
  for (let i = 0; i < passwordData.length; i++) {
    const editable = i == index ? "contenteditable" : "";
    const color = i % 2 == 0 ? "#1b1b1b" : "grey";

    const row = passwordData[i];
    html += `
              <tr>
                  <td id="${
                    i + "0"
                  }" style="background-color: ${color};" ${editable}>${
      row.website
    } <i onClick="copyContent('${
      row.website
    }')" class="fa-regular fa-clipboard copy"></i></td>
                  <td id="${
                    i + "1"
                  }" style="background-color: ${color};" ${editable}>${
      row.username
    } <i onClick="copyContent('${
      row.username
    }')" class="fa-regular fa-clipboard copy"></i></td>
                  <td id="${
                    i + "2"
                  }" style="background-color: ${color};" ${editable} data-password="${
      row.password
    }">${hidePassword(row.password)} <i onClick="copyContent('${
      row.password
    }')" class="fa-regular fa-clipboard copy"></i></td>
                  <td style="background-color: ${color};">
                      <button class="delete-btn" onClick="deletePasswordData(${i})">Delete</button>
                      <button class="edit-btn" onClick="editPasswordData(${i})">Edit</button>
                      <button class="update-btn" onClick="updatePasswordData(${i})">Update</button>
                      <input type="checkbox" onChange="togglePasswordVisibility(this, ${i})"> Show Password
                  </td>
              </tr>
          `;
  }
  table.innerHTML += html;
};

// Update password data based on the provided index
const updatePasswordData = (index) => {
  const websiteData = document.getElementById(index + "0").innerText;
  const usernameData = document.getElementById(index + "1").innerText;
  const passwordData = document
    .getElementById(index + "2")
    .getAttribute("data-password");

  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordDataArray = JSON.parse(passwordDetails);

  passwordDataArray[index] = {
    website: websiteData,
    username: usernameData,
    password: passwordData,
  };

  localStorage.setItem("passwordDetails", JSON.stringify(passwordDataArray));
  showAlert("Password Updated Successfully.", "success");
  populateSavedPasswordDetails();
};

// Populate saved password details in the table
const populateSavedPasswordDetails = () => {
  let table = document.querySelector("table");
  let passwordDetails = localStorage.getItem("passwordDetails");
  if (passwordDetails == null) {
    table.innerHTML = "<tr><td colspan='4'>No Details Available</td></tr>";
  } else {
    table.innerHTML = `<tr>
              <th>Website</th>
              <th>Username</th>
              <th>Password</th>
              <th>Action</th>
          </tr>`;

    let passwordData = JSON.parse(passwordDetails);
    let html = "";
    for (let i = 0; i < passwordData.length; i++) {
      const color = i % 2 == 0 ? "#1b1b1b" : "grey";
      const row = passwordData[i];
      html += `
                  <tr>
                      <td id="${i + "0"}" style="background-color: ${color};">${
        row.website
      } <i onClick="copyContent('${
        row.website
      }')" class="fa-regular fa-clipboard copy"></i></td>
                      <td id="${i + "1"}" style="background-color: ${color};">${
        row.username
      } <i onClick="copyContent('${
        row.username
      }')" class="fa-regular fa-clipboard copy"></i></td>
                      <td id="${
                        i + "2"
                      }" style="background-color: ${color};" data-password="${
        row.password
      }">${hidePassword(row.password)} <i onClick="copyContent('${
        row.password
      }')" class="fa-regular fa-clipboard copy"></i></td>
                      <td style="background-color: ${color};">
                          <button class="delete-btn" onClick="deletePasswordData(${i})">Delete</button>
                          <button class="edit-btn" onClick="editPasswordData(${i})">Edit</button>
                          <button class="update-btn" onClick="updatePasswordData(${i})">Update</button>
                          <input type="checkbox" onChange="togglePasswordVisibility(this, ${i})"> Show Password
                      </td>
                  </tr>
              `;
    }
    table.innerHTML += html;
  }
};

// Initial population of saved password details
populateSavedPasswordDetails();

// Add event listener to save button
document.querySelector(".save-btn").addEventListener("click", (event) => {
  event.preventDefault();

  // Validate input fields
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!website || !username || !password) {
    showAlert("All fields are required.", "error");
    return;
  }

  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordJSON = passwordDetails ? JSON.parse(passwordDetails) : [];

  passwordJSON.push({
    website: website,
    username: username,
    password: password,
  });

  localStorage.setItem("passwordDetails", JSON.stringify(passwordJSON));
  showAlert("Password Details Saved.", "success");

  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  populateSavedPasswordDetails();
});
