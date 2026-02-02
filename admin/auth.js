function activateKey() {
  const key = document.getElementById("licenceKey").value;
  const user = auth.currentUser;

  if (!key) {
    document.getElementById("error").innerText = "Enter a licence key";
    return;
  }

  // Check if licence key exists
  db.collection("licenceKeys").doc(key).get().then(doc => {
    if (!doc.exists) {
      document.getElementById("error").innerText = "Invalid licence key";
      return;
    }

    const data = doc.data();

    // Check if already used
    if (data.isUsed) {
      document.getElementById("error").innerText = "This key has already been used";
      return;
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(data.expiryDate);

    if (now > expiry) {
      document.getElementById("error").innerText = "This licence key has expired";
      return;
    }

    // Link user to station
    db.collection("users").doc(user.uid).set({
      email: user.email,
      stationID: data.stationID,
      licenceKeyUsed: key,
      firstLoginComplete: true
    }, { merge: true });

    // Mark key as used
    db.collection("licenceKeys").doc(key).update({
      isUsed: true,
      usedByUserID: user.uid
    });

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  });
}
