// Hide the password by replacing characters with asterisks
const hidePassword = (password) => {
  return "*".repeat(password.length);
};

// Copy content to clipboard and show alert messages based on success or failure
const copyContent = (content) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      alert("Copied");
    })
    .catch((err) => {
      alert("Copying Failed");
    });
};

// Delete password data based on the provided index
const deletePasswordData = (index) => {
  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordData = JSON.parse(passwordDetails);
  passwordData.splice(index, 1);
  localStorage.setItem("passwordDetails", JSON.stringify(passwordData));
  alert("Password Deleted Successfully.");
  populateSavedPasswordDetails();
};

// Edit password data based on the provided index
const editPasswordData = (index) => {
  let table = document.querySelector("table");
  let passwordDetails = localStorage.getItem("passwordDetails");

  table.innerHTML = `<tr>
              <th style="background-color:#1b1b1b;">Website</th>
              <th style="background-color:#1b1b1b;">Username</th>
              <th style="background-color:#1b1b1b;">Password</th>
              <th style="background-color:#1b1b1b;">Action</th>
          </tr>`;

  let passwordData = JSON.parse(passwordDetails);
  let html = "";
  let color = "#1b1b1b";
  let editable = "";
  for (let i = 0; i < passwordData.length; i++) {
    editable = i == index ? "contenteditable" : "";
    color = i % 2 == 0 ? "#1b1b1b" : "grey";

    row = passwordData[i];
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
                  }" style="background-color: ${color};" ${editable}>${hidePassword(
      row.password
    )} <i onClick="copyContent('${
      row.password
    }')" class="fa-regular fa-clipboard copy"></i></td>
                  <td style="background-color: ${color};">
                      <button class="delete-btn" onClick="deletePasswordData('${i}')">Delete</button>
                      <button class="edit-btn" onClick="editPasswordData('${i}')">Edit</button>
                      <button class="update-btn" onClick="updatePasswordData('${i}')">Update</button>
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
  const passwordData = document.getElementById(index + "2").innerText;

  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordDataArray = JSON.parse(passwordDetails);

  passwordDataArray[index] = {
    website: websiteData,
    username: usernameData,
    password: passwordData,
  };

  localStorage.setItem("passwordDetails", JSON.stringify(passwordDataArray));
  alert("Password Updated Successfully.");
  populateSavedPasswordDetails();
};

// Populate saved password details in the table
const populateSavedPasswordDetails = () => {
  let table = document.querySelector("table");
  let passwordDetails = localStorage.getItem("passwordDetails");
  if (passwordDetails == null) {
    table.innerHTML = "No Details Available";
  } else {
    table.innerHTML = `<tr>
              <th style="background-color:#1b1b1b;">Website</th>
              <th style="background-color:#1b1b1b;">Username</th>
              <th style="background-color:#1b1b1b;">Password</th>
              <th style="background-color:#1b1b1b;">Action</th>
          </tr>`;

    let passwordData = JSON.parse(passwordDetails);
    let html = "";
    let color = "#1b1b1b";
    for (let i = 0; i < passwordData.length; i++) {
      color = i % 2 == 0 ? "#1b1b1b" : "grey";
      row = passwordData[i];
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
                      }" style="background-color: ${color};">${hidePassword(
        row.password
      )} <i onClick="copyContent('${
        row.password
      }')" class="fa-regular fa-clipboard copy"></i></td>
                      <td style="background-color: ${color};">
                          <button class="delete-btn" onClick="deletePasswordData('${i}')">Delete</button>
                          <button class="edit-btn" onClick="editPasswordData('${i}')">Edit</button>
                          <button class="update-btn" onClick="updatePasswordData('${i}')">Update</button>
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
  let passwordDetails = localStorage.getItem("passwordDetails");
  let passwordJSON = passwordDetails ? JSON.parse(passwordDetails) : [];

  passwordJSON.push({
    website: document.getElementById("website").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  });

  localStorage.setItem("passwordDetails", JSON.stringify(passwordJSON));
  alert("Password Details Saved.");

  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  populateSavedPasswordDetails();
});
