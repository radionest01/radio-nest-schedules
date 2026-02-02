// -----------------------------
// LOGIN
// -----------------------------
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";
  errorBox.style.color = "red";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "activate.html";
    })
    .catch(error => {
      switch (error.code) {
        case "auth/wrong-password":
          errorBox.innerText = "Incorrect password. Please try again.";
          break;
        case "auth/user-not-found":
          errorBox.innerText = "No account found with that email.";
          break;
        case "auth/invalid-email":
          errorBox.innerText = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorBox.innerText = "Too many attempts. Please wait and try again.";
          break;
        default:
          errorBox.innerText = "Login failed. Please check your details.";
      }
    });
}



// -----------------------------
// PASSWORD RESET
// -----------------------------
function resetPassword() {
  const email = document.getElementById("email").value.trim();
  const errorBox = document.getElementById("error");

  if (!email) {
    errorBox.style.color = "red";
    errorBox.innerText = "Enter your email first.";
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      errorBox.style.color = "green";
      errorBox.innerText = "Password reset email sent. Check your spam folder if needed.";
    })
    .catch(() => {
      errorBox.style.color = "red";
      errorBox.innerText = "Unable to send reset email.";
    });
}



// -----------------------------
// LOGOUT
// -----------------------------
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}



// -----------------------------
// LICENCE KEY ACTIVATION (Option A)
// -----------------------------
function activateKey() {
  const key = document.getElementById("licenceKey").value.trim();
  const errorBox = document.getElementById("error");

  if (!key) {
    errorBox.style.color = "red";
    errorBox.innerText = "Please enter a licence key.";
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    errorBox.style.color = "red";
    errorBox.innerText = "You must be logged in to activate.";
    return;
  }

  // Look up the licence key by document ID
  db.collection("licenceKeys").doc(key).get()
    .then(doc => {
      if (!doc.exists) {
        errorBox.style.color = "red";
        errorBox.innerText = "Invalid licence key.";
        return;
      }

      const data = doc.data();

      if (!data.valid) {
        errorBox.style.color = "red";
        errorBox.innerText = "This licence key has been disabled.";
        return;
      }

      if (data.usedBy) {
        errorBox.style.color = "red";
        errorBox.innerText = "This licence key has already been used.";
        return;
      }

      // Mark key as used
      db.collection("licenceKeys").doc(key).update({
        usedBy: user.uid,
        usedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Mark user as activated
      db.collection("users").doc(user.uid).set({
        activated: true,
        licenceKey: key
      }, { merge: true });

      window.location.href = "dashboard.html";
    })
    .catch(() => {
      errorBox.style.color = "red";
      errorBox.innerText = "Activation failed. Try again.";
    });
}
