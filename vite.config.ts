/**
 * Конфигурация Vite + Vitest.
 *  - plugin react() — поддержка JSX/TSX;
 *  - mockAuthApi() — учебная «заглушка» бэкенда: отвечает на POST /api/auth/register,
 *    поэтому форма регистрации реально отправляет данные и получает ответ
 *    и в `npm run dev`, и в `npm run preview`;
 *  - блок test — настройки тестов (окружение jsdom вместо браузера, файл с jest-dom матчерами).
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

type Next = () => void

// Обработчик запросов: принимает JSON, проверяет поля и возвращает ответ
function authHandler(req: IncomingMessage, res: ServerResponse, next: Next): void {
  if (req.url !== '/api/auth/register') {
    next()
    return
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  let body = ''
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json')
    try {
      const data = JSON.parse(body) as { login?: string; email?: string; password?: string }
      if (!data.login || !data.email || !data.password) {
        res.statusCode = 400
        res.end(JSON.stringify({ ok: false, error: 'Не заполнены все поля' }))
        return
      }
      // Пароль в ответ не возвращаем
      res.statusCode = 201
      res.end(JSON.stringify({ ok: true, user: { login: data.login, email: data.email } }))
    } catch {
      res.statusCode = 400
      res.end(JSON.stringify({ ok: false, error: 'Некорректный JSON' }))
    }
  })
}

function mockAuthApi(): Plugin {
  return {
    name: 'mock-auth-api',
    configureServer(server) {
      server.middlewares.use(authHandler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(authHandler)
    },
  }
}

export default defineConfig({
  plugins: [react(), mockAuthApi()],
  test: {
    environment: 'jsdom', // имитация браузерного DOM для тестов компонентов
    globals: true, // describe/test/expect доступны без импорта (как в Jest)
    setupFiles: './src/setupTests.ts',
  },
})
