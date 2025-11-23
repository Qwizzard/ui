import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

// Loading fallback component
const PageLoader = () => (
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
	</div>
)

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })))
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const CreateQuiz = lazy(() => import('./pages/CreateQuiz').then(m => ({ default: m.CreateQuiz })))
const MyQuizzes = lazy(() => import('./pages/MyQuizzes').then(m => ({ default: m.MyQuizzes })))
const PublicQuizzes = lazy(() => import('./pages/PublicQuizzes').then(m => ({ default: m.PublicQuizzes })))
const TakeQuiz = lazy(() => import('./pages/TakeQuiz').then(m => ({ default: m.TakeQuiz })))
const QuizResults = lazy(() => import('./pages/QuizResults').then(m => ({ default: m.QuizResults })))
const QuizDetail = lazy(() => import('./pages/QuizDetail').then(m => ({ default: m.QuizDetail })))

function App() {
	const { isAuthenticated } = useAuth()

	return (
		<Suspense fallback={<PageLoader />}>
			<Routes>
				<Route
					path='/login'
					element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Login />}
				/>
				<Route
					path='/register'
					element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Register />}
				/>
				<Route path='/auth/callback' element={<AuthCallback />} />

				{/* Public routes with Layout */}
				<Route path='/' element={<Layout />}>
					{/* Homepage - show to non-authenticated users */}
					<Route 
						index 
						element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Home />} 
					/>
					
					{/* Public quiz and result viewing */}
					<Route path='quizzes/public' element={<PublicQuizzes />} />
					<Route path='quizzes/:quizId' element={<QuizDetail />} />
					<Route path='results/:resultId' element={<QuizResults />} />

					{/* Protected routes */}
					<Route
						path='dashboard'
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
		</Suspense>
	)
}

export default App
