/**
 * Форма входа (Login / Password). Устроена так же, как RegistrationForm:
 * состояние в useState, проверка полей через simple-react-validator.
 * Нужна, чтобы работал реэкспорт в components/index.ts и ссылка Login в Header.
 */
import React, { useReducer, useState } from 'react'
import SimpleReactValidator from 'simple-react-validator'

interface LoginFormProps {
  onSubmit?: (data: { login: string; password: string }) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0)
  const [validator] = useState(
    () => new SimpleReactValidator({ autoForceUpdate: { forceUpdate } }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.allValid()) {
      onSubmit?.({ login, password })
    } else {
      validator.showMessages()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="login-login">Login</label>
        <input
          id="login-login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={() => validator.showMessageFor('login')}
        />
        {validator.message('login', login, 'required')}
      </div>

      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validator.showMessageFor('password')}
        />
        {validator.message('password', password, 'required')}
      </div>

      <button type="submit" disabled={!validator.allValid()}>
        Sign in
      </button>
    </form>
  )
}

export default LoginForm
