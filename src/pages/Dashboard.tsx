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
	Trophy,
	TrendingUp,
	Sparkles,
	ArrowRight,
	History,
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
			<div className='relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10 p-8 md:p-12'>
				<div className='absolute inset-0 bg-grid-pattern opacity-5' />

				<div className='relative z-10'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-4'>
								<Sparkles className='h-6 w-6 text-primary animate-pulse' />
								<span className='text-sm font-medium text-primary'>
									Welcome Back
								</span>
							</div>
							<h1 className='text-4xl md:text-5xl font-bold mb-2'>
								{getGreeting()}, {user?.username}!
							</h1>
							<p className='text-xl text-muted-foreground max-w-2xl'>
								Ready to continue your learning journey? Let's make today count!
							</p>
						</div>
						<div className='w-32 h-32 md:w-40 md:h-40 shrink-0'>
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
							<div className='w-12 h-12'>
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
							<div className='w-12 h-12'>
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
							<div className='w-12 h-12'>
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
				{/* Quick Actions */}
				<ScaleIn delay={0.4}>
					<Card className='border-2 h-[500px] flex flex-col'>
						<CardHeader>
							<div className='flex items-center gap-2'>
								<div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
									<Sparkles className='h-4 w-4 text-primary' />
								</div>
								<CardTitle>Quick Actions</CardTitle>
							</div>
							<CardDescription>Start your learning journey</CardDescription>
						</CardHeader>
						<CardContent className='space-y-3 flex-1 overflow-y-auto'>
							<Link to='/quizzes/create' className='block'>
								<Button
									className='w-full justify-start h-auto py-4 group'
									variant='outline'
								>
									<div className='flex items-center gap-3 flex-1 text-left'>
										<div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
											<PlusCircle className='h-5 w-5 text-primary' />
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>Create New Quiz</div>
											<div className='text-xs text-muted-foreground'>
												Generate with AI or create manually
											</div>
										</div>
										<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</div>
								</Button>
							</Link>
							<Link to='/quizzes/public' className='block'>
								<Button
									className='w-full justify-start h-auto py-4 group'
									variant='outline'
								>
									<div className='flex items-center gap-3 flex-1 text-left'>
										<div className='w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0'>
											<BookOpen className='h-5 w-5 text-secondary' />
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>Browse Public Quizzes</div>
											<div className='text-xs text-muted-foreground'>
												Discover quizzes from the community
											</div>
										</div>
										<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</div>
								</Button>
							</Link>
							<Link to='/quizzes/my-quizzes' className='block'>
								<Button
									className='w-full justify-start h-auto py-4 group'
									variant='outline'
								>
									<div className='flex items-center gap-3 flex-1 text-left'>
										<div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
											<Trophy className='h-5 w-5 text-primary' />
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>View My Quizzes</div>
											<div className='text-xs text-muted-foreground'>
												Manage your created quizzes
											</div>
										</div>
										<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</div>
								</Button>
							</Link>
							<Link to='/dashboard' className='block'>
								<Button
									className='w-full justify-start h-auto py-4 group'
									variant='outline'
								>
									<div className='flex items-center gap-3 flex-1 text-left'>
										<div className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0'>
											<TrendingUp className='h-5 w-5 text-green-600' />
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>View Analytics</div>
											<div className='text-xs text-muted-foreground'>
												Track your learning progress
											</div>
										</div>
										<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</div>
								</Button>
							</Link>
							<Link to='/quizzes/my-quizzes' className='block'>
								<Button
									className='w-full justify-start h-auto py-4 group'
									variant='outline'
								>
									<div className='flex items-center gap-3 flex-1 text-left'>
										<div className='w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0'>
											<History className='h-5 w-5 text-purple-600' />
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>Quiz History</div>
											<div className='text-xs text-muted-foreground'>
												View all your past attempts
											</div>
										</div>
										<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</div>
								</Button>
							</Link>
						</CardContent>
					</Card>
				</ScaleIn>

				{/* Recent Results */}
				<ScaleIn delay={0.5}>
					<Card className='border-2 h-[500px] flex flex-col'>
						<CardHeader>
							<CardTitle>Recent Results</CardTitle>
							<CardDescription>Your latest quiz attempts</CardDescription>
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
			</div>

			{/* Your Quizzes */}
			<ScaleIn delay={0.6}>
				<Card className='border-2'>
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
					<CardContent>
						{quizzesLoading ? (
							<div className='space-y-3'>
								{[1, 2].map((i) => (
									<Skeleton key={i} className='h-24 w-full' />
								))}
							</div>
						) : !quizzes || quizzes.length === 0 ? (
							<div className='text-center py-12 space-y-4'>
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
							<div className='grid gap-4 md:grid-cols-2'>
								{quizzes.slice(0, 4).map((quiz: Quiz, idx: number) => (
									<motion.div
										key={quiz._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.1 }}
									>
										<Link to={`/quizzes/${quiz.slug}`}>
											<Card className='card-hover h-full border-2'>
												<CardHeader className='pb-3'>
													<div className='flex items-start justify-between gap-2'>
														<CardTitle className='text-lg line-clamp-2'>
															{quiz.topic}
														</CardTitle>
														<Badge
															variant={quiz.isPublic ? 'default' : 'secondary'}
															className='shrink-0'
														>
															{quiz.isPublic ? 'Public' : 'Private'}
														</Badge>
													</div>
												</CardHeader>
												<CardContent>
													<div className='flex items-center gap-4 text-sm text-muted-foreground'>
														<div className='flex items-center gap-1'>
															<BookOpen className='h-4 w-4' />
															{quiz.numberOfQuestions} questions
														</div>
														<Badge variant='outline' className='text-xs'>
															{quiz.difficulty}
														</Badge>
													</div>
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</ScaleIn>
		</div>
	)
}
