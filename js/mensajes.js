import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHaFmzv3eNd7x6bOnyQH_Tn5pn2LVXUwK",
  authDomain: "invitacion-elisa-ac71b.firebaseapp.com",
  projectId: "invitacion-elisa-ac71b",
  storageBucket: "invitacion-elisa-ac71b.firebasestorage.app",
  messagingSenderId: "760317163036",
  appId: "1:760317163036:web:8a8bf0bef4eb3656ba51d9",
  measurementId: "G-7EQNNYRPJ2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCollection = collection(db, "mensajes");
const guestbookForm = document.getElementById("guestbookForm");
const guestbookName = document.getElementById("guestbookName");
const guestbookMessage = document.getElementById("guestbookMessage");
const guestbookStatus = document.getElementById("guestbookStatus");
const guestbookMessages = document.getElementById("guestbookMessages");

function showMessage(message) {
  const card = document.createElement("article");
  card.className = "guestbook-message";

  const name = document.createElement("h3");
  name.textContent = message.nombre;
  const text = document.createElement("p");
  text.textContent = message.mensaje;

  card.append(name, text);
  return card;
}

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  guestbookStatus.textContent = "";

  const nombre = guestbookName.value.trim();
  const mensaje = guestbookMessage.value.trim();
  if (!nombre || !mensaje) {
    guestbookStatus.textContent = "Escribe tu nombre y un mensaje para enviar.";
    return;
  }

  const submitButton = guestbookForm.querySelector("button[type=submit]");
  submitButton.disabled = true;
  guestbookStatus.textContent = "Enviando mensaje...";

  try {
    await addDoc(messagesCollection, {
      nombre,
      mensaje,
      createdAt: serverTimestamp()
    });
    guestbookForm.reset();
    guestbookStatus.textContent = "¡Gracias por dejar tu mensaje!";
  } catch (error) {
    console.error("No se pudo guardar el mensaje:", error);
    guestbookStatus.textContent = "No se pudo enviar. Inténtalo de nuevo.";
  } finally {
    submitButton.disabled = false;
  }
});

const recentMessagesQuery = query(messagesCollection, orderBy("createdAt", "desc"));
onSnapshot(recentMessagesQuery, (snapshot) => {
  guestbookMessages.replaceChildren();

  if (snapshot.empty) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "guestbook-empty";
    emptyMessage.textContent = "Aún no hay mensajes. ¡Sé el primero en escribir!";
    guestbookMessages.append(emptyMessage);
    return;
  }

  snapshot.forEach((documentSnapshot) => {
    guestbookMessages.append(showMessage(documentSnapshot.data()));
  });
}, (error) => {
  console.error("No se pudieron cargar los mensajes:", error);
  guestbookMessages.replaceChildren();
  const errorMessage = document.createElement("p");
  errorMessage.className = "guestbook-empty";
  errorMessage.textContent = "No se pudieron cargar los mensajes.";
  guestbookMessages.append(errorMessage);
});
