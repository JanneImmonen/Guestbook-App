document
  .getElementById("ajaxMessageForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const country = document.getElementById("country").value;
    const message = document.getElementById("message").value;

    if (username && country && message) {
      fetch("/ajaxmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, country, message }),
      })
        .then((response) => response.json())
        .then((messages) => {
          const messagesContainer =
            document.getElementById("messagesContainer");
          messagesContainer.innerHTML = "";

          messages.forEach((message) => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("card", "mb-3");
            messageDiv.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">${message.username} - ${message.country}</h5>
                <p class="card-text">${message.message}</p>
              </div>
            `;
            messagesContainer.appendChild(messageDiv);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("All fields are required.");
    }
  });
