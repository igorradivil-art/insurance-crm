import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/logout");

  return (
    <main className="container">
      <h1>CRM страхового агента</h1>
      <p>
        Вы вошли как <b>{user.email}</b>. Авторизация работает.
      </p>
      <form action="/api/auth/logout" method="post" style={{ margin: "16px 0" }}>
        <button type="submit" className="btn">Выйти</button>
      </form>
      <p>Следующий этап — CRM-экран: клиенты, договоры, платежи, задачи (Шаг 3).</p>
    </main>
  );
}
