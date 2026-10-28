# Проект: Страница регистрации с валидацией

React + TypeScript (сборка Vite). Форма регистрации с проверкой полей через `simple-react-validator`,
навигация на `react-router-dom`, тесты на Vitest + React Testing Library.

## Запуск проекта
1. Установите зависимости:
   ```
   npm install
   ```
2. Запустите приложение:
   ```
   npm run dev
   ```
3. Откройте в браузере: [http://localhost:5173](http://localhost:5173) и перейдите по ссылке Register в шапке.

Запрос регистрации уходит на `/api/auth/register`; в режимах `npm run dev` и `npm run preview`
этот адрес обслуживает учебная заглушка из `vite.config.ts` (отвечает 201 на корректные данные).

## Сборка
```
npm run build
npm run preview
```

## Запуск тестов
1. Выполните команду:
   ```
   npm test
   ```
2. Убедитесь, что все тесты проходят успешно (4 теста: snapshot и валидация).

Примечание: тест-раннер — Vitest (он совместим с Jest по API: `describe`, `test`, `expect`, snapshot),
поэтому в тестах вместо `jest.fn()` используется `vi.fn()`.

## Структура проекта
- `src/components/RegistrationForm.tsx` — форма регистрации.
- `src/components/LoginForm.tsx` — форма входа.
- `src/components/Header.tsx` — Header с навигацией (ссылки Login и Register).
- `src/components/index.ts` — реэкспорт компонентов.
- `src/components/RegistrationForm.test.tsx` — тесты.
- `src/components/__snapshots__/` — сохранённый snapshot формы.
- `src/api/auth.ts` — API-заглушка `registerUser`.
- `src/App.tsx` — маршруты (`/`, `/login`, `/register`).
- `vite.config.ts` — настройки Vite/Vitest и мок-сервер `/api/auth/register`.
