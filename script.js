// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl_fboAsFpoAYvQ0mveRQNHpFOwDJyqY8",
  authDomain: "hope-227b0.firebaseapp.com",
  projectId: "hope-227b0",
  storageBucket: "hope-227b0.firebasestorage.app",
  messagingSenderId: "722895336932",
  appId: "1:722895336932:web:079f3cb4922b22c9d083f1",
  measurementId: "G-L2J2LKJR7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variables to handle OTP verification
let verificationCode = null;

// Phone number input page (index.html)
document.getElementById('sendOTPBtn').addEventListener('click', () => {
  const phoneNumber = document.getElementById('phoneNumber').value;

  if (!phoneNumber) {
    showErrorMessage('Please enter a valid phone number.');
    return;
  }

  // Set up reCAPTCHA verifier
  const appVerifier = new RecaptchaVerifier('sendOTPBtn', {
    size: 'invisible',
    callback: () => {
      sendOTP(phoneNumber, appVerifier);
    }
  });

  // Render reCAPTCHA widget
  appVerifier.render();
});

// Send OTP to the phone number
function sendOTP(phoneNumber, appVerifier) {
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      verificationCode = confirmationResult;
      window.location.href = "otp.html";  // Redirect to OTP input page
    })
    .catch((error) => {
      showErrorMessage(error.message);
    });
}

// Show error messages with animation
function showErrorMessage(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.classList.add('show');

  // Hide the error message after 3 seconds
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 3000);
}

// OTP input page (otp.html)
document.getElementById('verifyOTPBtn').addEventListener('click', () => {
  const otp = document.getElementById('otp').value;

  if (!otp) {
    showErrorMessage('Please enter the OTP.');
    return;
  }

  verifyOTP(otp);
});

// Verify OTP
function verifyOTP(otp) {
  if (verificationCode) {
    verificationCode.confirm(otp)
      .then((result) => {
        alert("Phone number verified successfully!");
        window.location.href = "index.html";  // Redirect back to the home page
      })
      .catch((error) => {
        showErrorMessage('Invalid OTP.');
      });
  }
}
