import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useMyQuizzes } from '../hooks/useQuiz'
import { useMyResults } from '../hooks/useResult'
import { Skeleton } from '../components/ui/skeleton'
import {
	PlusCircle,
	BookOpen,
	TrendingUp,
	Sparkles,
	ArrowRight,
} from 'lucide-react'
import type { Quiz, Result } from '../types'
import { SlideIn, ScaleIn } from '../components/animations/MotionComponents'
import { LottieAnimation } from '../components/animations/LottieAnimation'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export function Dashboard() {
	const { data: quizzes, isLoading: quizzesLoading } = useMyQuizzes()
	const { data: results, isLoading: resultsLoading } = useMyResults()
	const { user } = useAuth()

	const stats = {
		totalQuizzes: quizzes?.length || 0,
		totalAttempts: results?.length || 0,
		averageScore:
			results && results.length > 0
				? (
						results.reduce((acc: number, r: Result) => acc + r.percentage, 0) /
						results.length
				  ).toFixed(1)
				: 0,
	}

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good Morning'
		if (hour < 18) return 'Good Afternoon'
		return 'Good Evening'
	}

	return (
		<div className='space-y-8 pb-12'>
			{/* Welcome Header */}
			<div className='relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 sm:p-8 md:p-12'>
				<div className='absolute inset-0 bg-grid-pattern opacity-5' />

				<div className='relative z-10'>
					<div className='flex flex-col md:flex-row items-center md:items-center justify-between gap-4 md:gap-6'>
						<div className='flex-1 text-center md:text-left'>
							<div className='flex items-center justify-center md:justify-start gap-3 mb-3'>
								<Sparkles className='h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse' />
								<span className='text-xs md:text-sm font-medium text-primary'>
									Welcome Back
								</span>
							</div>
							<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2'>
								{getGreeting()}, {user?.username}!
							</h1>
							<p className='text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0'>
								Ready to continue your learning journey? Let's make today count!
							</p>
						</div>
						<div className='hidden md:block w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0'>
							<LottieAnimation
								animationType='welcome'
								className='w-full h-full'
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<SlideIn direction='up' delay={0.1}>
					<Card className='card-hover relative overflow-hidden border-2'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16' />
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Quizzes Created
							</CardTitle>
							<div className='w-16 h-16 sm:w-20 sm:h-20'>
								<LottieAnimation
									animationType='books'
									className='w-full h-full'
								/>
							</div>
						</CardHeader>
						<CardContent>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.3 }}
								className='text-4xl font-bold text-primary'
							>
								{stats.totalQuizzes}
							</motion.div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.totalQuizzes > 0
									? 'Keep creating!'
									: 'Create your first quiz'}
							</p>
						</CardContent>
					</Card>
				</SlideIn>

				<SlideIn direction='up' delay={0.2}>
					<Card className='card-hover relative overflow-hidden border-2'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16' />
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Quizzes Attempted
							</CardTitle>
							<div className='w-16 h-16 sm:w-20 sm:h-20'>
								<LottieAnimation
									animationType='brain'
									className='w-full h-full'
								/>
							</div>
						</CardHeader>
						<CardContent>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, duration: 0.3 }}
								className='text-4xl font-bold text-primary'
							>
								{stats.totalAttempts}
							</motion.div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.totalAttempts > 0
									? 'Great progress!'
									: 'Start taking quizzes'}
							</p>
						</CardContent>
					</Card>
				</SlideIn>

				<SlideIn direction='up' delay={0.3}>
					<Card className='card-hover relative overflow-hidden border-2 bg-linear-to-br from-primary/5 to-secondary/5'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16' />
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Average Score
							</CardTitle>
							<div className='w-16 h-16 sm:w-20 sm:h-20'>
								<LottieAnimation
									animationType='trophy'
									className='w-full h-full'
								/>
							</div>
						</CardHeader>
						<CardContent>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.5, duration: 0.3 }}
								className='text-4xl font-bold gradient-text'
							>
								{stats.averageScore}%
							</motion.div>
							<div className='flex items-center gap-1 mt-1'>
								<TrendingUp className='h-3 w-3 text-green-500' />
								<p className='text-xs text-green-600 dark:text-green-400'>
									{parseFloat(stats.averageScore.toString()) >= 70
										? 'Excellent!'
										: 'Keep improving!'}
								</p>
							</div>
						</CardContent>
					</Card>
				</SlideIn>
			</div>

		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Recent Results */}
			<ScaleIn delay={0.4}>
				<Card className='border-2 h-[500px] flex flex-col'>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Recent Results</CardTitle>
								<CardDescription>Your latest quiz attempts</CardDescription>
							</div>
							{results && results.length > 0 && (
								<Link to='/results'>
									<Button variant='outline' size='sm'>
										See All
										<ArrowRight className='ml-2 h-4 w-4' />
									</Button>
								</Link>
							)}
						</div>
					</CardHeader>
					<CardContent className='flex-1 overflow-y-auto'>
						{resultsLoading ? (
							<div className='space-y-3'>
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} className='h-20 w-full' />
								))}
							</div>
						) : !results || results.length === 0 ? (
							<div className='text-center py-8 space-y-4'>
								<div className='mx-auto w-24 h-24'>
									<LottieAnimation
										animationType='emptyResults'
										className='w-full h-full'
									/>
								</div>
								<div>
									<p className='font-medium mb-1'>No attempts yet</p>
									<p className='text-sm text-muted-foreground'>
										Start taking quizzes to see your results here
									</p>
								</div>
								<Link to='/quizzes/public'>
									<Button variant='outline'>Browse Quizzes</Button>
								</Link>
							</div>
						) : (
							<div className='space-y-3'>
								{results.slice(0, 5).map((result: Result, idx: number) => (
									<motion.div
										key={result._id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.1 }}
									>
										<Link to={`/results/${result.slug}`} className='block'>
											<div className='flex items-center justify-between p-4 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition-all group'>
												<div className='flex-1'>
													<p className='font-semibold group-hover:text-primary transition-colors'>
														{result.quizTopic}
													</p>
													<p className='text-xs text-muted-foreground mt-1'>
														{new Date(result.completedAt).toLocaleDateString(
															'en-US',
															{
																month: 'short',
																day: 'numeric',
																year: 'numeric',
															}
														)}
													</p>
												</div>
												<Badge
													className={
														result.percentage >= 80
															? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
															: result.percentage >= 60
															? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
															: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
													}
												>
													{result.percentage.toFixed(0)}%
												</Badge>
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</ScaleIn>

			{/* Your Quizzes */}
			<ScaleIn delay={0.5}>
				<Card className='border-2 h-[500px] flex flex-col'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<div>
								<CardTitle>Your Quizzes</CardTitle>
								<CardDescription>Quizzes you've created</CardDescription>
							</div>
							{quizzes && quizzes.length > 0 && (
								<Link to='/quizzes/my-quizzes'>
									<Button variant='outline' size='sm'>
										View All
										<ArrowRight className='ml-2 h-4 w-4' />
									</Button>
								</Link>
							)}
						</div>
					</CardHeader>
					<CardContent className='flex-1 overflow-y-auto'>
						{quizzesLoading ? (
							<div className='space-y-3'>
								{[1, 2].map((i) => (
									<Skeleton key={i} className='h-24 w-full' />
								))}
							</div>
						) : !quizzes || quizzes.length === 0 ? (
							<div className='text-center py-8 space-y-4'>
								<div className='mx-auto w-32 h-32'>
									<LottieAnimation
										animationType='emptyQuizzes'
										className='w-full h-full'
									/>
								</div>
								<div>
									<p className='font-medium mb-1'>No quizzes yet</p>
									<p className='text-sm text-muted-foreground mb-4'>
										Create your first quiz and share it with others
									</p>
									<Link to='/quizzes/create'>
										<Button>
											<PlusCircle className='mr-2 h-4 w-4' />
											Create Your First Quiz
										</Button>
									</Link>
								</div>
							</div>
						) : (
							<div className='space-y-3'>
								{quizzes.slice(0, 4).map((quiz: Quiz, idx: number) => (
									<motion.div
										key={quiz._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.1 }}
									>
										<Link to={`/quizzes/${quiz.slug}`}>
											<div className='flex items-start justify-between p-4 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition-all group'>
												<div className='flex-1 min-w-0'>
													<p className='font-semibold group-hover:text-primary transition-colors line-clamp-2'>
														{quiz.topic}
													</p>
													<div className='flex items-center gap-2 mt-2 flex-wrap'>
														<Badge
															variant={quiz.isPublic ? 'default' : 'secondary'}
															className='text-xs'
														>
															{quiz.isPublic ? 'Public' : 'Private'}
														</Badge>
														<div className='flex items-center gap-1 text-xs text-muted-foreground'>
															<BookOpen className='h-3 w-3' />
															{quiz.numberOfQuestions} questions
														</div>
														<Badge variant='outline' className='text-xs'>
															{quiz.difficulty}
														</Badge>
													</div>
												</div>
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</ScaleIn>
		</div>
		</div>
	)
}
