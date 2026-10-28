/**
 * Форма регистрации: поля Login, Email, Password.
 *
 * Логика:
 *  - значения полей хранятся в состоянии (useState);
 *  - валидацию делает библиотека simple-react-validator: правила пишутся строкой
 *    прямо в validator.message(поле, значение, 'правила через |');
 *  - сообщение об ошибке показывается после ухода с поля (onBlur) или после
 *    попытки отправки, а кнопка Register заблокирована, пока validator.allValid() === false;
 *  - при успешной отправке вызывается onSubmit из props (родитель решает, куда слать данные).
 */
import React, { useReducer, useState } from 'react'
import SimpleReactValidator from 'simple-react-validator'

interface RegistrationFormProps {
  onSubmit: (data: { login: string; email: string; password: string }) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [login, setLogin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Библиотека рассчитана на классовые компоненты и сама не перерисовывает форму.
  // Поэтому даём ей forceUpdate: он нужен, чтобы после showMessageFor/showMessages
  // сообщения об ошибках сразу появлялись на экране.
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0)

  // Валидатор создаём один раз (ленивая инициализация useState)
  const [validator] = useState(
    () => new SimpleReactValidator({ autoForceUpdate: { forceUpdate } }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.allValid()) {
      onSubmit({ login, email, password })
      setSubmitted(true)
    } else {
      // Показать сообщения сразу у всех полей
      validator.showMessages()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="reg-login">Login</label>
        <input
          id="reg-login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={() => validator.showMessageFor('login')}
        />
        {/* правило: поле обязательно */}
        {validator.message('login', login, 'required')}
      </div>

      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validator.showMessageFor('email')}
        />
        {/* правила: обязательно и должно быть похоже на email */}
        {validator.message('email', email, 'required|email')}
      </div>

      <div className="field">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validator.showMessageFor('password')}
        />
        {/* правила: обязательно, минимум 8 символов */}
        {validator.message('password', password, 'required|min:8')}
      </div>

      {/* Кнопка недоступна, пока хотя бы одно поле не проходит проверку */}
      <button type="submit" disabled={!validator.allValid()}>
        Register
      </button>
      {submitted && <p className="success">Registration Successful!</p>}
    </form>
  )
}

export default RegistrationForm
