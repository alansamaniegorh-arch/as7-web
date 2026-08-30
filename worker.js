export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Página de acceso
    if (url.pathname === "/login") {
      return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AS7 LIVE - Acceso</title>
<style>
body{margin:0;background:#080808;color:white;font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh}
.box{width:360px;background:#151515;padding:30px;border-radius:14px;text-align:center}
h1{margin-top:0} input{width:100%;box-sizing:border-box;padding:13px;margin:8px 0;border-radius:7px;border:0}
button{width:100%;padding:13px;margin-top:10px;background:#e50909;color:white;border:0;border-radius:7px;font-weight:bold;cursor:pointer}
p{color:#aaa}.error{color:#ff5555}
</style>
</head>
<body>
<div class="box">
<h1>AS7 <span style="color:red">LIVE</span></h1>
<p>Acceso a transmisiones</p>

<form method="POST" action="/api/login">
<input name="email" type="email" placeholder="Correo electrónico" required>
<input name="password" type="password" placeholder="Contraseña" required>
<button>INICIAR SESIÓN</button>
</form>

<p>¿No tienes cuenta?</p>
<a href="/register" style="color:#ff3333">Registrarme</a>
</div>
</body>
</html>`, {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }

    // Página de registro
    if (url.pathname === "/register") {
      return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AS7 LIVE - Registro</title>
<style>
body{margin:0;background:#080808;color:white;font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh}
.box{width:360px;background:#151515;padding:30px;border-radius:14px;text-align:center}
input{width:100%;box-sizing:border-box;padding:13px;margin:8px 0;border-radius:7px;border:0}
button{width:100%;padding:13px;margin-top:10px;background:#e50909;color:white;border:0;border-radius:7px;font-weight:bold;cursor:pointer}
p{color:#aaa}
</style>
</head>
<body>
<div class="box">
<h1>AS7 <span style="color:red">LIVE</span></h1>
<p>Crear cuenta</p>

<form method="POST" action="/api/register">
<input name="email" type="email" placeholder="Correo electrónico" required>
<input name="password" type="password" placeholder="Contraseña" minlength="6" required>
<button>CREAR CUENTA</button>
</form>

<p><a href="/login" style="color:#ff3333">Ya tengo cuenta</a></p>
</div>
</body>
</html>`, {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }

    // Registro
    if (url.pathname === "/api/register" && request.method === "POST") {
      const form = await request.formData();
      const email = String(form.get("email") || "").trim().toLowerCase();
      const password = String(form.get("password") || "");

      if (!email || password.length < 6) {
        return new Response("Datos inválidos", { status: 400 });
      }

      const existing = await env.DB
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(email)
        .first();

      if (existing) {
        return new Response("Ese correo ya está registrado. <a href='/login'>Iniciar sesión</a>", {
          headers: {"content-type":"text/html;charset=UTF-8"}
        });
      }

      const hash = await sha256(password);

      await env.DB
        .prepare(
          "INSERT INTO users (id,email,password,role,created_at) VALUES (?,?,?,?,?)"
        )
        .bind(
          crypto.randomUUID(),
          email,
          hash,
          "user",
          new Date().toISOString()
        )
        .run();

      return Response.redirect(new URL("/login", request.url), 303);
    }

    // Login
    if (url.pathname === "/api/login" && request.method === "POST") {
      const form = await request.formData();
      const email = String(form.get("email") || "").trim().toLowerCase();
      const password = String(form.get("password") || "");

      const user = await env.DB
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(email)
        .first();

      if (!user || user.password !== await sha256(password)) {
        return new Response("Correo o contraseña incorrectos. <a href='/login'>Volver</a>", {
          status: 401,
          headers: {"content-type":"text/html;charset=UTF-8"}
        });
      }

      const token = crypto.randomUUID();

      await env.DB
        .prepare("UPDATE users SET password = ? WHERE id = ?")
        .bind(user.password, user.id)
        .run();

      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `as7_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
        }
      });
    }

    // Para cualquier otra ruta, servir la página normal
    return env.ASSETS.fetch(request);
  }
};

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
