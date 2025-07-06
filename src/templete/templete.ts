import config from "../app/config";

export const successTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Successful</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #e8f5e9;
      }

      .container {
        text-align: center;
        padding: 2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.2);
        max-width: 500px;
        width: 90%;
      }

      .success-icon {
        font-size: 4rem;
        color: #4caf50;
        margin-bottom: 1rem;
      }

      h1 {
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      p {
        color: #388e3c;
        margin-bottom: 2rem;
      }

      .btn-home {
        display: inline-block;
        padding: 0.5rem 1.5rem;
        color: #fff;
        background-color: #4caf50;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      .btn-home:hover {
        background-color: #388e3c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="success-icon">✔️</div>
      <h1>Thank You for Your Payment!</h1>
      <p>Your transaction was successful.</p>
      <a href=${config.frontend_ip_address} class="btn-home"
        >Return to Home</a
      >
    </div>
  </body>
</html>`;

export const cancelTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Failed</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #fdecea; /* Light red background */
      }

      .container {
        text-align: center;
        padding: 2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
      }

      .error-icon {
        font-size: 4rem;
        color: #e53935; /* Red color for error icon */
        margin-bottom: 1rem;
      }

      h1 {
        color: #d32f2f; /* Darker red for the heading */
        margin-bottom: 1rem;
      }

      p {
        color: #c62828; /* Medium red for text */
        margin-bottom: 2rem;
      }

      .btn-home {
        display: inline-block;
        padding: 0.5rem 1.5rem;
        color: #fff;
        background-color: #e53935; /* Red button */
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      .btn-home:hover {
        background-color: #c62828; /* Darker red on hover */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="error-icon">❌</div>
      <h1>Payment Failed</h1>
      <p>Unfortunately, your transaction could not be completed.</p>
      <a href="/" class="btn-home">Return to Home</a>
    </div>
  </body>
</html>`;

export const serverRunningTemplete = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Oops, Server is Actually a Supernova!</title>
    <style>
      /* All your previous styles remain unchanged */

      @keyframes rotateGradient {
        0% {
          transform: rotate(0deg);
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: rotate(360deg);
          opacity: 0.7;
        }
      }

      @keyframes colorShift {
        0% {
          filter: hue-rotate(0deg);
        }
        100% {
          filter: hue-rotate(360deg);
        }
      }

      @keyframes glowText {
        0%,
        100% {
          text-shadow:
            0 0 20px #00ffea,
            0 0 40px #00ffea,
            0 0 80px #00ffd5,
            0 0 120px #00ffd5;
          color: #00ffe0;
          transform: scale(1);
        }
        50% {
          text-shadow:
            0 0 60px #00ffd5,
            0 0 100px #00ffd5,
            0 0 140px #00ffd5;
          color: #00fff5;
          transform: scale(1.05);
        }
      }

      @keyframes pulseBounce {
        0%,
        100% {
          transform: scale(1) translateY(0);
        }
        50% {
          transform: scale(1.1) translateY(-10px);
        }
      }

      @keyframes pulseRing {
        0%,
        100% {
          box-shadow:
            0 0 25px #00ff00,
            0 0 40px #ffff00,
            0 0 60px #00ff00;
        }
        50% {
          box-shadow:
            0 0 50px #ffff00,
            0 0 70px #00ff00,
            0 0 100px #ffff00;
        }
      }

      /* Floating particles */
      @keyframes floatParticles {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0.7;
        }
        50% {
          transform: translateY(-20px) translateX(15px);
          opacity: 1;
        }
        100% {
          transform: translateY(0) translateX(0);
          opacity: 0.7;
        }
      }

      body {
        margin: 0;
        height: 100vh;
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Orbitron', sans-serif;
        text-align: center;
        overflow: hidden;
        color: #00ffe0;
        position: relative;
      }

      /* Ambient floating particles */
      .particle {
        position: absolute;
        border-radius: 50%;
        background: #00ffe0;
        opacity: 0.7;
        filter: blur(3px);
        animation: floatParticles 6s ease-in-out infinite;
      }

      .particle:nth-child(1) {
        width: 12px;
        height: 12px;
        top: 15%;
        left: 20%;
        animation-delay: 0s;
      }
      .particle:nth-child(2) {
        width: 8px;
        height: 8px;
        top: 30%;
        left: 75%;
        animation-delay: 2s;
      }
      .particle:nth-child(3) {
        width: 10px;
        height: 10px;
        top: 60%;
        left: 40%;
        animation-delay: 4s;
      }
      .particle:nth-child(4) {
        width: 6px;
        height: 6px;
        top: 80%;
        left: 65%;
        animation-delay: 3s;
      }
      .particle:nth-child(5) {
        width: 14px;
        height: 14px;
        top: 50%;
        left: 10%;
        animation-delay: 1s;
      }

      /* Wrapper to hold container and animated glowing ring */
      .container-wrapper {
        position: relative;
        width: 640px;
        height: 640px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Pulsating glow behind container */
      .glow-pulse {
        position: absolute;
        inset: -40px;
        border-radius: 50%;
        background: radial-gradient(circle at center, #00ff00, transparent 70%);
        animation: pulseRing 4s ease-in-out infinite;
        filter: blur(40px);
        z-index: 0;
      }

      /* The glowing ring that rotates behind the container with color shift */
      .glowing-ring {
        position: absolute;
        inset: -20px;
        border-radius: 50%;
        padding: 20px;
        background: conic-gradient(
          from 0deg,
          #00ff00,
          #ffff00,
          #00ff00,
          #ffff00,
          #00ff00
        );
        animation:
          rotateGradient 6s linear infinite,
          colorShift 20s linear infinite;
        -webkit-mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 20px),
          black calc(100% - 19px)
        );
        mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 20px),
          black calc(100% - 19px)
        );
        z-index: 1;
        filter: drop-shadow(0 0 25px #00ff00) drop-shadow(0 0 40px #ffff00)
          drop-shadow(0 0 60px #00ff00);
        opacity: 0.8;
      }

      /* The circular container */
      .container {
        position: relative;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.75);
        box-sizing: border-box;
        padding: 50px;
        z-index: 2;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        user-select: none;
      }

      .icon {
        font-size: 140px;
        margin-bottom: 20px;
        animation:
          glowText 3s ease-in-out infinite,
          pulseBounce 3s ease-in-out infinite;
        will-change: transform, text-shadow;
      }

      h1 {
        font-size: 4rem;
        margin: 0;
        letter-spacing: 0.1em;
        animation: glowText 4s ease-in-out infinite;
        will-change: text-shadow, transform;
      }

      p {
        font-size: 1.5rem;
        font-weight: 400;
        color: #a0fff5cc;
        margin: 0 20px;
        line-height: 1.5;
      }

      /* New copyright line fixed bottom right */
      .copyright {
        position: fixed;
        bottom: 15px;
        right: 15px;
        font-size: 0.9rem;
        color: #40ffb0cc;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        user-select: none;
        pointer-events: none;
        z-index: 9999;
        filter: drop-shadow(0 0 2px #00ffb0);
      }
    </style>
    <link
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Floating ambient particles -->
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>

    <div class="container-wrapper">
      <div class="glow-pulse"></div>
      <div class="glowing-ring"></div>
      <div class="container">
        <div class="icon">⚡</div>
        <h1>Server is Running</h1>
        <p>
          Everything is online and fully operational. Ready for your requests!
        </p>
      </div>
    </div>

    <div class="copyright">
      <p>© Powered By Humayon Forid</p>
    </div>
  </body>
</html>
`;

export const successAccountTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Success</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f8f8;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .container {
        text-align: center;
        background-color: #ffffff;
        padding: 40px 60px;
        border-radius: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        width: 400px;
      }

      .checkmark {
        font-size: 80px;
        color: #4caf50;
      }

      h1 {
        font-size: 28px;
        color: #333;
        margin-top: 20px;
      }

      p {
        font-size: 18px;
        color: #555;
        margin: 10px 0;
      }

      .btn {
        background-color: #4caf50;
        color: #fff;
        font-size: 16px;
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
      }

      .btn:hover {
        background-color: #45a049;
      }

      .footer {
        font-size: 14px;
        color: #aaa;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="checkmark">✔</div>
      <h1>Account Added Successfully!</h1>
      <p>
        Thank you for adding your account now you can be able to receive payment
        from the
      </p>
      <!-- <a href="/" class="btn">Go to Home</a> -->
      <div class="footer">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>`;

export const settingSupportTemplete = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Support Contact</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
      }

      .support-container {
        background-color: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        text-align: left;
        width: 100%;
        max-width: 400px;
        transform: translateY(50px);
        opacity: 0;
        animation: fadeInUp 1s ease-out forwards;
      }

      h1 {
        margin: 0 0 15px;
        color: #333;
        font-size: 24px;
        position: relative;
        animation: slideIn 1.2s ease-out;
      }

      p {
        margin: 10px 0;
        font-size: 16px;
        color: #555;
        animation: fadeIn 1.5s ease-in;
      }

      .highlight {
        font-weight: bold;
        color: #fe3372;
        animation: colorPop 1.5s ease-out;
      }

      .address {
        margin-left: 60px;
      }

      @keyframes fadeInUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(-30px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes colorPop {
        0% {
          color: #fe3372;
        }
        50% {
          color: #fe3372;
        }
        100% {
          color: #fe3372;
        }
      }

      @media (max-width: 480px) {
        .support-container {
          padding: 15px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="support-container">
      <h1>Support Contact</h1>
      <p>Email: <span class="highlight">helpdesk@uogi.com</span></p>
      <p>Phone: <span class="highlight">07341941292</span></p>
      <p>Address:</p>
      <p class="highlight address">112 Baker Ave.<br />Atco, NJ 08004</p>
    </div>
  </body>
</html>`;

export const settingPrivacyPolicyTemplete = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Privacy Policy</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #333;
        line-height: 1.6;
      }

      .container {
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        background: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      h1 {
        text-align: center;
        color: #fe3372;
        font-size: 28px;
        margin-bottom: 20px;
      }

      h2 {
        color: #fe3372;
        font-size: 20px;
        margin-top: 20px;
      }

      p {
        margin-bottom: 15px;
        font-size: 16px;
      }

      ul {
        margin-left: 20px;
        list-style-type: disc;
      }

      li {
        margin-bottom: 10px;
        font-size: 16px;
      }

      footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy describes how Uogi App ("we", "us", or
        "our") collects, uses, and shares your information when you use our
        mobile application ("App").
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>
          <strong>Profile Information:</strong> We collect information you
          provide when you edit your profile, including any changes to your name
          or email address.
        </li>
        <li>
          <strong>Business Information:</strong> When you add a business, we may
          collect the business name, details of payment type , image business type
          and location.
        </li>
        <li>
          <strong>Service Information:</strong> If you choose to any service in any business. before the service booking you read details and see everything and add the business to select any time slotes. After the all of process complete then you last of pay now and after the complete payment then your booking is complete.
        </li>
        <li>
          <strong>Usage Information:</strong> We may collect information about
          how you interact with the App, including your use of features and
          preferences.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>
          To provide and improve the App's functionality and user experience.
        </li>
        <li>
          To communicate with you about your account and App-related updates.
        </li>
        <li>
          To personalize your experience and provide targeted content and
          advertisements.
        </li>
        <li>To enforce our Terms of Service and other legal agreements.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your information for as long as necessary to fulfill the
        purposes outlined in this Privacy Policy unless a longer retention
        period is required or permitted by law.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        The Uogi App is not intended for children under the age of
        13. We do not knowingly collect or solicit personal information from
        children.
      </p>

      <footer>&copy; 2025 Uogi App. All rights reserved.</footer>
    </div>
  </body>
</html>`;


export const settingDeleteTemplete = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Delete Account Process</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #333;
        line-height: 1.6;
      }

      .container {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        background: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      h1 {
        text-align: center;
        color: #fe3372;
        font-size: 24px;
        margin-bottom: 20px;
      }

      ol {
        padding-left: 20px;
      }

      li {
        margin-bottom: 15px;
        font-size: 16px;
      }

      .highlight {
        background-color: #fe3372;
        padding: 2px 4px;
        border-radius: 4px;
      }

      .image-container {
        text-align: center;
        margin-bottom: 20px;
      }

      .image-container img {
        height: 300px;
        border-radius: 8px;
      }

      footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Steps to Delete Account</h1>
      <ol>
        <li>
          After logged in, first route to the
          <span class="highlight">Profile</span> screen.
        </li>
        <div class="image-container">
          <img
            src="/uploads/delete/image-1.jpg"
            alt="Delete Account Illustration"
          />
        </div>
        <li>Tap on <span class="highlight">Settings</span>.</li>
        <div class="image-container">
          <img
            src="/uploads/delete/image-2.jpg"
            alt="Delete Account Illustration"
          />
        </div>
        <li>Then tap on <span class="highlight">Delete</span>.</li>
        <div class="image-container">
          <img
            src="/uploads/delete/image-3.jpg"
            alt="Delete Account Illustration"
          />
        </div>
        <li>
          A pop-up will appear; provide your password in the password field.
        </li>
        <div class="image-container">
          <img
            src="/uploads/delete/image-4.jpg"
            alt="Delete Account Illustration"
          />
        </div>
        <li>Press the <span class="highlight">Delete</span> button.</li>
        <div class="image-container">
          <img
            src="/uploads/delete/image-5.jpg"
            alt="Delete Account Illustration"
          />
        </div>
        <li>Your account will be deleted successfully.</li>
      </ol>
      <footer>&copy; 2024 Memorial Moments. All rights reserved.</footer>
    </div>
  </body>
</html>`;

