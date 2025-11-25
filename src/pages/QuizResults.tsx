import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useResult, useToggleResultVisibility } from '../hooks/useResult'
import { useQuiz } from '../hooks/useQuiz'
import { Skeleton } from '../components/ui/skeleton'
import {
	CheckCircle2,
	XCircle,
	Globe,
	Lock,
	Share2,
	Trophy,
	Target,
	TrendingUp,
	RotateCcw,
} from 'lucide-react'
import type { ResultAnswer } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
	FadeIn,
	SlideIn,
	ScaleIn,
} from '../components/animations/MotionComponents'
import { LottieAnimation } from '../components/animations/LottieAnimation'
import { AdaptiveQuizDialog } from '../components/AdaptiveQuizDialog'
import { AdaptiveQuizTimeline } from '../components/AdaptiveQuizTimeline'
import { cn } from '../lib/utils'
import { useEffect, useState } from 'react'

export function QuizResults() {
	const { resultId } = useParams<{ resultId: string }>()
	const { data: result, isLoading } = useResult(resultId!)
	const { user } = useAuth()
	const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
		useToggleResultVisibility()
	const [showConfetti, setShowConfetti] = useState(false)
	const [showAdaptiveDialog, setShowAdaptiveDialog] = useState(false)

	// Fetch quiz data to check if it's adaptive
	const quizSlug = result && typeof result.quizId === 'object' && result.quizId?.slug
		? result.quizId.slug
		: result?.quizSlug || (typeof result?.quizId === 'string' ? result.quizId : '')
	const { data: quiz } = useQuiz(quizSlug as string)
	const isAdaptiveQuiz = quiz?.parentQuizId ? true : false

	const isOwner = result && user && String(result.userId) === String(user.id)

	// Show confetti when user scores 100%
	useEffect(() => {
		if (result && result.percentage === 100) {
			setShowConfetti(true)
			// Hide confetti after 5 seconds
			const timer = setTimeout(() => {
				setShowConfetti(false)
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [result])

	const handleToggleVisibility = () => {
		if (resultId) {
			toggleVisibility(resultId)
		}
	}

	const handleShareResult = () => {
		const shareUrl = `${window.location.origin}/results/${resultId}`
		navigator.clipboard.writeText(shareUrl)
		toast.success('Result link copied to clipboard!')
	}

	if (isLoading) {
		return (
			<div className='max-w-4xl mx-auto space-y-6'>
				<Card>
					<CardHeader>
						<Skeleton className='h-8 w-1/2' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-24 w-full' />
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!result) {
		return (
			<div className='max-w-4xl mx-auto'>
				<Card>
					<CardContent className='py-12 text-center'>
						<p className='text-muted-foreground'>Results not found</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	const getGrade = (percentage: number) => {
		if (percentage >= 90)
			return {
				grade: 'A',
				color: 'text-green-600 dark:text-green-400',
				message: 'Outstanding! 🎉',
			}
		if (percentage >= 80)
			return {
				grade: 'B',
				color: 'text-blue-600 dark:text-blue-400',
				message: 'Excellent Work! 👏',
			}
		if (percentage >= 70)
			return {
				grade: 'C',
				color: 'text-yellow-600 dark:text-yellow-400',
				message: 'Good Job! 👍',
			}
		if (percentage >= 60)
			return {
				grade: 'D',
				color: 'text-orange-600 dark:text-orange-400',
				message: 'Keep Practicing! 💪',
			}
		return {
			grade: 'F',
			color: 'text-red-600 dark:text-red-400',
			message: "Don't Give Up! 🚀",
		}
	}

	const { grade, color, message } = getGrade(result.percentage)

	return (
		<div className='max-w-4xl mx-auto space-y-6 pb-12'>
			{/* Full-Screen Confetti for 100% Score */}
			{showConfetti && (
				<div className='fixed inset-0 pointer-events-none z-50'>
					<LottieAnimation
						animationType='confettiFullScreen'
						className='w-full h-full'
						loop={true}
					/>
				</div>
			)}

			{/* Header */}
			<div>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<h1 className='text-3xl font-bold'>Quiz Results</h1>
					<div className='flex flex-wrap gap-2'>
						{result.isResultPublic && (
							<Button
								variant='outline'
								size='default'
								onClick={handleShareResult}
							>
								<Share2 className='mr-2 h-4 w-4' />
								Share
							</Button>
						)}
						{isOwner && (
							<Button
								variant='outline'
								size='default'
								onClick={handleToggleVisibility}
								disabled={isTogglingVisibility}
							>
								{result.isResultPublic ? (
									<>
										<Globe className='mr-2 h-4 w-4' />
										Make Private
									</>
								) : (
									<>
										<Lock className='mr-2 h-4 w-4' />
										Make Public
									</>
								)}
							</Button>
						)}
						{user && (
							<Link to='/dashboard'>
								<Button variant='outline'>Back to Dashboard</Button>
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Score Card with Animation */}
			<ScaleIn delay={0.1}>
				<Card className='relative overflow-hidden border-2'>
					<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5' />

					<CardContent className='relative pt-12 pb-8'>
						{/* Celebration Icon */}
						<div className='mx-auto w-48 h-48 mb-6 relative'>
							<LottieAnimation
								animationType={
									result.percentage >= 70 ? 'celebration' : 'tryAgain'
								}
								className='w-full h-full'
							/>
						</div>

						{/* Score Display */}
						<div className='text-center space-y-4'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<h2 className='text-2xl font-semibold mb-2'>
									{result.quizTopic}
								</h2>
								<p className='text-muted-foreground capitalize'>
									{result.quizDifficulty} difficulty •{' '}
									{new Date(result.completedAt).toLocaleDateString()}
								</p>
							</motion.div>

							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', duration: 0.6, delay: 0.6 }}
								className='py-8'
							>
								<div className='text-7xl font-bold gradient-text mb-2'>
									{result.percentage.toFixed(0)}%
								</div>
								<Badge
									variant='outline'
									className={cn('text-xl px-4 py-2', color)}
								>
									Grade: {grade}
								</Badge>
								<p className='text-2xl font-semibold mt-4 text-muted-foreground'>
									{message}
								</p>
							</motion.div>

							{/* Stats Grid */}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.8 }}
									className='bg-green-500/10 border border-green-500/20 rounded-xl p-4'
								>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
										<p className='text-sm font-medium text-green-600 dark:text-green-400'>
											Correct
										</p>
									</div>
									<p className='text-3xl font-bold text-green-600 dark:text-green-400'>
										{result.score}
									</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.9 }}
									className='bg-red-500/10 border border-red-500/20 rounded-xl p-4'
								>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<XCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
										<p className='text-sm font-medium text-red-600 dark:text-red-400'>
											Incorrect
										</p>
									</div>
									<p className='text-3xl font-bold text-red-600 dark:text-red-400'>
										{result.totalQuestions - result.score}
									</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0 }}
									className='bg-primary/10 border border-primary/20 rounded-xl p-4'
								>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<Target className='h-5 w-5 text-primary' />
										<p className='text-sm font-medium text-primary'>Total</p>
									</div>
									<p className='text-3xl font-bold text-primary'>
										{result.totalQuestions}
									</p>
								</motion.div>
							</div>
						</div>
					</CardContent>
				</Card>
			</ScaleIn>

			{/* Performance Insights */}
			{result.percentage >= 70 && (
				<SlideIn direction='up' delay={1.1}>
					<Card className='border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='py-4'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
									<TrendingUp className='h-5 w-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='font-semibold'>Great Performance!</p>
									<p className='text-sm text-muted-foreground'>
										You're mastering this topic. Keep up the excellent work!
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</SlideIn>
			)}

			{/* Actions */}
			<SlideIn direction='up' delay={1.2}>
				<div className='flex flex-wrap gap-3'>
					{user && (
						<Button
							variant='default'
							className='flex-1 min-w-[200px]'
							onClick={() => {
								// Validate result has required data
								if (!result.slug) {
									toast.error(
										'Cannot generate adaptive quiz: Invalid result data'
									)
									return
								}
								setShowAdaptiveDialog(true)
							}}
						>
							<Trophy className='mr-2 h-4 w-4' />
							Try Another Quiz
						</Button>
					)}
					{!user && (
						<Link to='/quizzes/public' className='flex-1 min-w-[200px]'>
							<Button variant='default' className='w-full'>
								<Trophy className='mr-2 h-4 w-4' />
								Try Another Quiz
							</Button>
						</Link>
					)}
					{!isAdaptiveQuiz ? (
						<Link
							to={`/quizzes/${
								typeof result.quizId === 'object' && result.quizId?.slug
									? result.quizId.slug
									: result.quizSlug || result.quizId
							}`}
							className='flex-1 min-w-[200px]'
						>
							<Button variant='outline' className='w-full'>
								<RotateCcw className='mr-2 h-4 w-4' />
								Retake Quiz
							</Button>
						</Link>
					) : (
						<div className='flex-1 min-w-[200px]'>
							<div className='p-4 border-2 border-dashed rounded-lg text-center bg-muted/30'>
								<p className='text-sm text-muted-foreground'>
									This adaptive quiz was generated specifically for you and cannot be retaken
								</p>
							</div>
						</div>
					)}
				</div>
			</SlideIn>

			{/* Adaptive Quiz Dialog */}
			{user && result && (
				<AdaptiveQuizDialog
					open={showAdaptiveDialog}
					onOpenChange={setShowAdaptiveDialog}
					result={result}
				/>
			)}

			{/* Detailed Breakdown */}
			<div className='space-y-4'>
				<FadeIn delay={1.3}>
					<h2 className='text-2xl font-bold'>Detailed Breakdown</h2>
					<p className='text-muted-foreground'>
						Review each question and learn from your mistakes
					</p>
				</FadeIn>

				{result.answers.map((answer: ResultAnswer, index: number) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.4 + index * 0.05 }}
					>
						<Card
							className={cn(
								'border-2',
								answer.isCorrect
									? 'border-green-500/50 bg-green-500/5'
									: 'border-red-500/50 bg-red-500/5'
							)}
						>
							<CardHeader>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<Badge variant='outline'>Question {index + 1}</Badge>
											{answer.isCorrect ? (
												<Badge className='bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50'>
													<CheckCircle2 className='w-3 h-3 mr-1' />
													Correct
												</Badge>
											) : (
												<Badge className='bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'>
													<XCircle className='w-3 h-3 mr-1' />
													Incorrect
												</Badge>
											)}
										</div>
										<CardTitle className='text-lg font-medium'>
											{answer.questionText}
										</CardTitle>
									</div>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									{answer.options.map((option: string, optionIndex: number) => {
										const isSelected =
											answer.selectedAnswers.includes(optionIndex)
										const isCorrect =
											answer.correctAnswers.includes(optionIndex)

										return (
											<div
												key={optionIndex}
												className={cn(
													'p-4 rounded-lg border-2 transition-all',
													isCorrect
														? 'bg-green-500/10 border-green-500/50'
														: isSelected && !isCorrect
														? 'bg-red-500/10 border-red-500/50'
														: 'border-border'
												)}
											>
												<div className='flex items-center justify-between gap-3'>
													<span
														className={cn(
															'flex-1',
															isCorrect &&
																'font-medium text-green-700 dark:text-green-400',
															isSelected &&
																!isCorrect &&
																'text-red-700 dark:text-red-400'
														)}
													>
														{option}
													</span>
													{isCorrect && (
														<CheckCircle2 className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0' />
													)}
													{isSelected && !isCorrect && (
														<XCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0' />
													)}
												</div>
											</div>
										)
									})}
								</div>

								<div className='bg-blue-500/10 border-2 border-blue-500/20 rounded-lg p-4'>
									<div className='flex items-start gap-2'>
										<div className='w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
											<span className='text-lg'>💡</span>
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1'>
												Explanation
											</p>
											<p className='text-sm text-blue-800 dark:text-blue-200'>
												{answer.explanation}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Adaptive Quiz Timeline - Only show for original quizzes */}
			{result && typeof result.quizId === 'object' && result.quizId?.slug && user && isOwner && !isAdaptiveQuiz && (
				<AdaptiveQuizTimeline parentQuizSlug={result.quizId.slug} />
			)}
		</div>
	)
}
