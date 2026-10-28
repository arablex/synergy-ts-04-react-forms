/**
 * Корневой компонент: шапка с навигацией и три страницы
 *   /          — главная с подсказкой;
 *   /login     — форма входа;
 *   /register  — форма регистрации (данные уходят на API-заглушку registerUser).
 */
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { registerUser } from './api/auth'
import { Header, LoginForm, RegistrationForm } from './components'

function RegisterPage() {
  // Текст ответа сервера показываем под формой
  const [serverStatus, setServerStatus] = useState('')

  const handleRegister = async (data: { login: string; email: string; password: string }) => {
    try {
      const response = await registerUser(data)
      setServerStatus(`Ответ сервера: ${response.status} ${response.ok ? '(данные приняты)' : '(ошибка)'}`)
    } catch {
      setServerStatus('Не удалось связаться с сервером')
    }
  }

  return (
    <section className="card">
      <h1>Регистрация</h1>
      <RegistrationForm onSubmit={handleRegister} />
      {serverStatus && <p className="server-status">{serverStatus}</p>}
    </section>
  )
}

function LoginPage() {
  return (
    <section className="card">
      <h1>Вход</h1>
      <LoginForm />
    </section>
  )
}

function Home() {
  return (
    <section className="card">
      <h1>Добро пожаловать</h1>
      <p>Перейдите по ссылке Register в шапке, чтобы открыть страницу регистрации.</p>
    </section>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </>
  )
}
