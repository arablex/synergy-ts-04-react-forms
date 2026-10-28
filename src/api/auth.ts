/**
 * API-заглушка для регистрации.
 * Отправляет данные формы POST-запросом на /api/auth/register.
 * В режиме разработки (npm run dev / npm run preview) этот адрес обслуживает
 * учебный мок-сервер, описанный в vite.config.ts.
 */

// Данные, которые уходят на сервер
export interface RegisterData {
  login: string
  email: string
  password: string
}

export async function registerUser(data: RegisterData): Promise<Response> {
  return fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
