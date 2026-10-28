/**
 * Тесты формы регистрации (Vitest + React Testing Library).
 * API тестов такое же, как в Jest: describe / test / expect; вместо jest.fn() используется vi.fn().
 *
 *  1. snapshot-тест — «снимок» разметки; при случайном изменении вёрстки тест упадёт;
 *  2. проверка валидации: кнопка заблокирована, пока поля не заполнены правильно;
 *  3. проверка текстов ошибок и вызова onSubmit.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import RegistrationForm from './RegistrationForm'

// Заполняет поле и «уходит» с него (blur), как это делает пользователь
function fillField(label: RegExp, value: string) {
  const input = screen.getByLabelText(label)
  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)
}

describe('RegistrationForm', () => {
  test('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<RegistrationForm onSubmit={vi.fn()} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('validates inputs and enables submit button when valid', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />)

    const loginInput = screen.getByLabelText(/login/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /register/i })

    // Вначале кнопка заблокирована
    expect(submitButton).toBeDisabled()

    // Вводим корректные данные
    fireEvent.change(loginInput, { target: { value: 'TestUser' } })
    fireEvent.blur(loginInput)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.blur(emailInput)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.blur(passwordInput)

    // Теперь кнопка доступна
    expect(submitButton).not.toBeDisabled()
  })

  test('shows validation messages for invalid data and keeps button disabled', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />)

    // Пустой логин после blur -> «обязательное поле»
    fillField(/login/i, '')
    expect(screen.getByText(/login field is required/i)).toBeInTheDocument()

    // Неправильный email
    fillField(/email/i, 'not-an-email')
    expect(screen.getByText(/email must be a valid email address/i)).toBeInTheDocument()

    // Короткий пароль (меньше 8 символов)
    fillField(/password/i, '123')
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled()
  })

  test('calls onSubmit with form data and shows success message', () => {
    const onSubmit = vi.fn()
    render(<RegistrationForm onSubmit={onSubmit} />)

    fillField(/login/i, 'TestUser')
    fillField(/email/i, 'test@example.com')
    fillField(/password/i, 'password123')

    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      login: 'TestUser',
      email: 'test@example.com',
      password: 'password123',
    })
    expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
  })
})
