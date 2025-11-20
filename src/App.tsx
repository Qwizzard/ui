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

			<Route
				path='/'
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Dashboard />} />
				<Route path='quizzes/create' element={<CreateQuiz />} />
				<Route path='quizzes/my-quizzes' element={<MyQuizzes />} />
				<Route path='quizzes/public' element={<PublicQuizzes />} />
				<Route path='quizzes/:quizId' element={<QuizDetail />} />
				<Route path='attempt/:attemptId' element={<TakeQuiz />} />
				<Route path='results/:resultId' element={<QuizResults />} />
			</Route>

			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	)
}

export default App
