import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
