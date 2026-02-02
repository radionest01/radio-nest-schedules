function activateKey() {
  const key = document.getElementById("licenceKey").value.trim();
  const user = auth.currentUser;

  if (!key) {
    document.getElementById("error").innerText = "Enter a licence key";
    return;
  }

  db.collection("licenceKeys")
    .where("keyValue", "==", key)
    .get()
    .then(snapshot => {

      if (snapshot.empty) {
        document.getElementById("error").innerText = "Invalid licence key";
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      if (data.isUsed) {
        document.getElementById("error").innerText = "This key has already been used";
        return;
      }

      const now = new Date();
      const expiry = new Date(data.expiryDate);

      if (now > expiry) {
        document.getElementById("error").innerText = "This licence key has expired";
        return;
      }

      db.collection("users").doc(user.uid).set({
        email: user.email,
        stationID: data.stationID,
        licenceKeyUsed: key,
        firstLoginComplete: true
      }, { merge: true });

      db.collection("licenceKeys").doc(doc.id).update({
        isUsed: true,
        usedByUserID: user.uid
      });

      window.location.href = "dashboard.html";
    })
    .catch(error => {
      document.getElementById("error").innerText = error.message;
    });
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

function resetPassword() {
  const email = document.getElementById("email").value;

  if (!email) {
    document.getElementById("error").style.color = "red";
    document.getElementById("error").innerText = "Enter your email first.";
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      document.getElementById("error").style.color = "green";
      document.getElementById("error").innerText =
        "Password reset email sent. If you can't find it, please check your spam or junk folder.";
    })
    .catch(error => {
      document.getElementById("error").style.color = "red";
      document.getElementById("error").innerText = error.message;
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "activate.html";
    })
    .catch(error => {
      document.getElementById("error").style.color = "red";
      document.getElementById("error").innerText = error.message;
    });
}
