// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { reactToFirebase } from './diyRoom.js';

const firebaseConfig = {
    apiKey: "AIzaSyBgs2T56YDynJkg8PtJfuYJKhxxhZYA6Qc",
    authDomain: "shared-minds-diy.firebaseapp.com",
    projectId: "shared-minds-diy",
    storageBucket: "shared-minds-diy.appspot.com",
    messagingSenderId: "312673210765",
    appId: "1:312673210765:web:6e49ecae4dd678deb3adc4"
  };

const app = initializeApp(firebaseConfig);
let appName = "shared-minds-diy";

let auth;
let googleAuthProvider;
let db = getDatabase();
auth = getAuth();
googleAuthProvider = new GoogleAuthProvider();

export function addNewThingToFirebase(folder, data) {
    //firebase will supply the key,  this will trigger "onChildAdded" below
    const dbRef = ref(db, appName + '/' + folder);
    const newKey = push(dbRef, data).key;
    return newKey; //useful for later updating
}

export function updateJSONFieldInFirebase(folder, key, data) {
    console.log(appName + '/' + folder + '/' + key)
    const dbRef = ref(db, appName + '/' + folder + '/' + key);
    update(dbRef, data);
}

export function deleteFromFirebase(folder, key) {
    console.log("deleting", appName + '/' + folder + '/' + key);
    const dbRef = ref(db, appName + '/' + folder + '/' + key);
    set(dbRef, null);
}

export function subscribeToData(folder) {
    //get callbacks when there are changes either by you locally or others remotely
    const commentsRef = ref(db, appName + '/' + folder + '/');
    onChildAdded(commentsRef, (data) => {
        reactToFirebase("added", data.val(), data.key);
    });
    onChildChanged(commentsRef, (data) => {
        reactToFirebase("changed", data.val(), data.key)
    });
    onChildRemoved(commentsRef, (data) => {
        reactToFirebase("removed", data.val(), data.key)
    });
}

export function setDataInFirebase(folder, key, data) {
    //if it doesn't exist, it adds (pushes) with you providing the key
    //if it does exist, it overwrites
    const dbRef = ref(db, appName + '/' + folder)
    set(dbRef, data);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("userino is signed in", user);
        showLogOutButton(user);
        // ...
    } else {
        console.log("userino is signed out");
        showLoginButtons();
        // User is signed out
        // ...
    }
});

let authDiv = document.createElement("div");
authDiv.style.position = "absolute";
authDiv.style.top = "10%";
authDiv.style.left = "85%";
authDiv.style.width = "150px";
//authDiv.style.height = "150px";
authDiv.style.backgroundColor = "lightpink";
authDiv.style.border = "1px solid black";
authDiv.style.padding = "10px";
authDiv.style.zIndex = "3000";
document.body.appendChild(authDiv);

function showLogOutButton(user) {
    authDiv.innerHTML = "";
    let userNameDiv = document.createElement("div");
    if (user.photoURL) {
        let userPic = document.createElement("img");
        userPic.src = user.photoURL;
        userPic.style.width = "50px";
        userPic.style.height = "50px";
        authDiv.appendChild(userPic);
    }
    if (user.displayName) {
        userNameDiv.innerHTML = user.displayName;
    } else {
        userNameDiv.innerHTML = user.email;
    }
    let logOutButton = document.createElement("button");
    authDiv.appendChild(userNameDiv);
    logOutButton.innerHTML = "Log Out";
    logOutButton.setAttribute("id", "logOut");
    logOutButton.setAttribute("class", "authButton");
    authDiv.appendChild(logOutButton);
    document.getElementById("logOut").addEventListener("click", function () {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("signed out");
        }).catch((error) => {
            // An error happened.
            console.log("error signing out");
        });
    });

}

function showLoginButtons() {
    authDiv.innerHTML = "";
    let signUpWithGoogleButton = document.createElement("button");
    signUpWithGoogleButton.innerHTML = "Google Login";
    signUpWithGoogleButton.setAttribute("id", "signInWithGoogle");
    signUpWithGoogleButton.setAttribute("class", "authButton");
    authDiv.appendChild(signUpWithGoogleButton);

    authDiv.appendChild(document.createElement("br"));
    authDiv.appendChild(document.createElement("br"));

    let emailDiv = document.createElement("div");
    emailDiv.innerHTML = "Email";
    authDiv.appendChild(emailDiv);

    let emailInput = document.createElement("input");
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("class", "authInput");
    emailInput.setAttribute("type", "text");
    emailInput.setAttribute("placeholder", "email@email.com");
    authDiv.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("id", "password");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("class", "authInput");
    passwordInput.setAttribute("placeholder", "password");
    passwordInput.setAttribute("suggest", "current-password");
    passwordInput.setAttribute("autocomplete", "on");
    authDiv.appendChild(passwordInput);

    let signUpWithEmailButton = document.createElement("button");
    signUpWithEmailButton.innerHTML = "Sign Up";
    signUpWithEmailButton.setAttribute("id", "signUpWithEmail");
    signUpWithEmailButton.setAttribute("class", "authButton");
    authDiv.appendChild(signUpWithEmailButton);

    let signInWithEmailButton = document.createElement("button");
    signInWithEmailButton.innerHTML = "Sign In";
    signInWithEmailButton.setAttribute("id", "signInWithEmail");
    signInWithEmailButton.setAttribute("class", "authButton");
    authDiv.appendChild(signInWithEmailButton);

    document.getElementById("signInWithGoogle").addEventListener("click", function (event) {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        event.stopPropagation();
    });

    document.getElementById("signInWithEmail").addEventListener("click", function (event) {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        event.stopPropagation();
    });

    document.getElementById("signUpWithEmail").addEventListener("click", function (event) {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        event.stopPropagation();
    });
}