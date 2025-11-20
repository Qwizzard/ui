import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { CreateQuiz } from './pages/CreateQuiz'
import { MyQuizzes } from './pages/MyQuizzes'
import { PublicQuizzes } from './pages/PublicQuizzes'
import { TakeQuiz } from './pages/TakeQuiz'
import { QuizResults } from './pages/QuizResults'
import { QuizDetail } from './pages/QuizDetail'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

function App() {
	const { isAuthenticated } = useAuth()

	return (
		<Routes>
			<Route
				path='/login'
				element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
			/>
			<Route
				path='/register'
				element={isAuthenticated ? <Navigate to='/' replace /> : <Register />}
			/>

			{/* Public routes with Layout */}
			<Route path='/' element={<Layout />}>
				{/* Public quiz and result viewing */}
				<Route path='quizzes/public' element={<PublicQuizzes />} />
				<Route path='quizzes/:quizId' element={<QuizDetail />} />
				<Route path='results/:resultId' element={<QuizResults />} />

				{/* Protected routes */}
				<Route
					index
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='quizzes/create'
					element={
						<ProtectedRoute>
							<CreateQuiz />
						</ProtectedRoute>
					}
				/>
				<Route
					path='quizzes/my-quizzes'
					element={
						<ProtectedRoute>
							<MyQuizzes />
						</ProtectedRoute>
					}
				/>
				<Route
					path='attempt/:attemptId'
					element={
						<ProtectedRoute>
							<TakeQuiz />
						</ProtectedRoute>
					}
				/>
			</Route>

			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	)
}

export default App
