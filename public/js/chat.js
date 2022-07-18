const socket = io();
// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

//Elements
const messageForm = document.querySelector("#messageForm");
const messageFormInput = messageForm.querySelector("input");
const messageFormButton = messageForm.querySelector("button");
const shareLocationButton = document.querySelector("#share-location");
const messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


//printing the message to the browser
socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate,{
    message:message.text,
    createdAt:moment(message.createdAt).format('hh:mm A')
  })
  messages.insertAdjacentHTML('beforeend', html)

});

//printing the location to the browser
socket.on('locationMessage', (locationURL)=>{
  const html = Mustache.render(locationTemplate,{
    url:locationURL.text,
    createdAt:moment(locationURL.createdAt).format('hh:mm A')
  })
  messages.insertAdjacentHTML('beforeend', html)
})


//sending form data to server
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    messageFormButton.removeAttribute("disabled");
    messageFormInput.value = "";
    messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("The message was delivered!", message);
  });
});

//sending locations to server
shareLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser!");
  }

  shareLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("sendLocation", location, () => {
      shareLocationButton.removeAttribute("disabled");
      console.log("Location shared!");
    });
  });
  socket.emit();
});
