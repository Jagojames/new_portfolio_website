const PASSWORD = "N0t_Ju5t_A_Pr3tty_P1cture";
const COOKIE_NAME = "portfolio_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jago Livingstone — Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #080808; --surface: #111111; --border: #202020;
      --text: #FFFFFF; --muted: #666666; --orange: #F97316;
      --mono: 'Courier New', Courier, monospace;
    }
    html, body { height: 100%; background: var(--bg); color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased; }
    body::before { content: ''; position: fixed; inset: 0;
      background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
      background-size: 28px 28px; opacity: 0.5; pointer-events: none; z-index: 0; }
    body::after { content: ''; position: fixed; inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(249,115,22,0.04) 0%, transparent 70%);
      pointer-events: none; z-index: 0; }
    .wrap { position: relative; z-index: 1; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 40px 24px; }
    .card { width: 100%; max-width: 420px; background: var(--surface);
      border: 1px solid var(--border); border-radius: 16px; padding: 48px 40px; }
    .eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--orange); margin-bottom: 20px; }
    .name { font-size: 26px; font-weight: 600; letter-spacing: -0.02em;
      margin-bottom: 6px; line-height: 1.2; }
    .role { font-size: 14px; color: var(--muted); margin-bottom: 36px; }
    .divider { height: 1px; background: var(--border); margin-bottom: 32px; }
    label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--muted); margin-bottom: 10px; display: block; }
    input[type=password] { width: 100%; background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 14px 16px; color: var(--text); font-size: 15px;
      font-family: inherit; outline: none; transition: border-color 0.2s;
      margin-bottom: 20px; letter-spacing: 0.04em; }
    input[type=password]:focus { border-color: var(--orange); }
    input[type=password]::placeholder { color: #333333; }
    button { width: 100%; background: var(--orange); color: #000; border: none;
      border-radius: 8px; padding: 14px 24px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: opacity 0.2s, transform 0.15s; font-family: inherit; }
    button:hover { opacity: 0.88; transform: scale(1.01); }
    .error { margin-top: 16px; font-family: var(--mono); font-size: 11px;
      letter-spacing: 0.1em; color: #ef4444; text-align: center; min-height: 18px; }
    .welcome { margin-bottom: 28px; }
    .welcome-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 12px; }
    .welcome p { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 8px; }
    .welcome p:last-child { margin-bottom: 0; }
    .footer { margin-top: 32px; font-family: var(--mono); font-size: 10px;
      letter-spacing: 0.14em; color: #2a2a2a; text-align: center; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="eyebrow">// Portfolio</div>
      <div class="name">Jago Livingstone</div>
      <div class="role">Lead Product Designer</div>
      <div class="divider"></div>
      <div class="welcome">
        <p class="welcome-title">Welcome to Jago's Portfolio</p>
        <p>This is a scrolling portfolio, so grab your mouse, trackpad or finger and scroll down to explore.</p>
        <p>You'll find live, clickable prototypes, case studies and a few experiments along the way.</p>
        <p>Some areas are still under construction — because apparently even portfolios need a backlog. 🚧</p>
        <p>Enjoy the scroll.</p>
      </div>
      <div class="divider"></div>
      <form method="POST" action="/auth">
        <label for="pwd">Password</label>
        <input type="password" id="pwd" name="password" placeholder="Enter password to continue" autofocus>
        <button type="submit">Enter Portfolio →</button>
        <div class="error">WRONG_PASSWORD_PLACEHOLDER</div>
      </form>
    </div>
    <div class="footer">jagodesigner.com</div>
  </div>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle login form submission
    if (request.method === "POST" && url.pathname === "/auth") {
      const formData = await request.formData();
      const submitted = formData.get("password");

      if (submitted === PASSWORD) {
        // Correct — set cookie and redirect to home
        return new Response(null, {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie": `${COOKIE_NAME}=authenticated; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`,
          },
        });
      } else {
        // Wrong password — show login page with error
        const page = LOGIN_PAGE.replace("WRONG_PASSWORD_PLACEHOLDER", "Incorrect password. Please try again.");
        return new Response(page, {
          status: 401,
          headers: { "Content-Type": "text/html" },
        });
      }
    }

    // Check for auth cookie
    const cookie = request.headers.get("Cookie") || "";
    const isAuthenticated = cookie.includes(`${COOKIE_NAME}=authenticated`);

    if (!isAuthenticated) {
      // Show login page
      const page = LOGIN_PAGE.replace("WRONG_PASSWORD_PLACEHOLDER", "");
      return new Response(page, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Authenticated — pass request through to GitHub Pages origin directly
    const originUrl = new URL(request.url);
    originUrl.hostname = "jagojames.github.io";
    return fetch(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow",
    });
  },
};
