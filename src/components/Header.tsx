/**
 * Шапка сайта с навигацией: ссылки на страницы входа и регистрации.
 * Link из react-router-dom меняет адрес без перезагрузки страницы.
 */
import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <nav>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  )
}

export default Header
