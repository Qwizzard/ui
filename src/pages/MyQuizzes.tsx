import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
	useMyQuizzes,
	useDeleteQuiz,
	useToggleQuizVisibility,
} from '../hooks/useQuiz'
import { useStartAttempt, useQuizAttemptStatus } from '../hooks/useAttempt'
import { Skeleton } from '../components/ui/skeleton'
import type { Quiz } from '../types'
import { motion } from 'framer-motion'
import {
	Play,
	Eye,
	Globe,
	Lock,
	Trash2,
	BookOpen,
	Calendar,
	PlusCircle,
	Sparkles,
} from 'lucide-react'
import { cn } from '../lib/utils'

function MyQuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
	const { mutate: deleteQuiz } = useDeleteQuiz()
	const { mutate: toggleVisibility } = useToggleQuizVisibility()
	const { mutate: startAttempt, isPending } = useStartAttempt()
	const { data: attemptStatus } = useQuizAttemptStatus(quiz.slug)
	const navigate = useNavigate()

	const handleTakeQuiz = () => {
		if (attemptStatus?.status === 'in-progress' && attemptStatus.attemptId) {
			navigate(`/attempt/${attemptStatus.attemptId}`)
		} else {
			startAttempt(quiz.slug)
		}
	}

	const getTakeQuizButtonText = () => {
		if (isPending) return 'Loading...'
		if (attemptStatus?.status === 'in-progress') return 'Continue'
		if (attemptStatus?.status === 'completed') return 'Retake'
		return 'Take Quiz'
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty.toLowerCase()) {
			case 'easy':
				return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
			case 'hard':
				return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
			default:
				return ''
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.05 }}
		>
			<Card className='card-hover h-full border-2 group'>
				<CardHeader>
					<div className='flex items-start justify-between gap-4'>
						<div className='flex-1 space-y-2'>
							<CardTitle className='text-xl group-hover:text-primary transition-colors'>
								{quiz.topic}
							</CardTitle>
							<CardDescription className='flex items-center gap-2'>
								<Calendar className='h-3 w-3' />
								Created {new Date(quiz.createdAt).toLocaleDateString()}
							</CardDescription>
						</div>
						<div className='flex flex-col items-end gap-2'>
							<Badge
								variant={quiz.isPublic ? 'default' : 'secondary'}
								className='gap-1'
							>
								{quiz.isPublic ? (
									<>
										<Globe className='h-3 w-3' />
										Public
									</>
								) : (
									<>
										<Lock className='h-3 w-3' />
										Private
									</>
								)}
							</Badge>
							<Badge
								variant='outline'
								className={cn(
									'capitalize',
									getDifficultyColor(quiz.difficulty)
								)}
							>
								{quiz.difficulty}
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center gap-1 text-sm text-muted-foreground'>
						<BookOpen className='h-4 w-4' />
						<span className='font-medium'>{quiz.numberOfQuestions}</span>{' '}
						questions
					</div>

					{attemptStatus?.status === 'in-progress' && (
						<div className='p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
							<p className='text-xs text-orange-700 dark:text-orange-400 flex items-center gap-1'>
								<Sparkles className='h-3 w-3' />
								You have an ongoing attempt
							</p>
						</div>
					)}

					<div className='flex flex-wrap gap-2'>
						<Button
							onClick={handleTakeQuiz}
							disabled={isPending}
							size='sm'
							className='flex-1 min-w-[100px]'
						>
							<Play className='mr-2 h-4 w-4' />
							{getTakeQuizButtonText()}
						</Button>
						<Link to={`/quizzes/${quiz.slug}`}>
							<Button variant='outline' size='sm'>
								<Eye className='mr-2 h-4 w-4' />
								View
							</Button>
						</Link>
					</div>

					<div className='flex gap-2 pt-2 border-t'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => toggleVisibility(quiz.slug)}
							className='flex-1'
						>
							{quiz.isPublic ? (
								<>
									<Lock className='mr-2 h-4 w-4' />
									Make Private
								</>
							) : (
								<>
									<Globe className='mr-2 h-4 w-4' />
									Make Public
								</>
							)}
						</Button>
						<Button
							variant='destructive'
							size='sm'
							onClick={() => {
								if (
									confirm(
										'Are you sure you want to delete this quiz? This action cannot be undone.'
									)
								) {
									deleteQuiz(quiz.slug)
								}
							}}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

export function MyQuizzes() {
	const { data: quizzes, isLoading } = useMyQuizzes()

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='space-y-2'>
					<Skeleton className='h-10 w-64' />
					<Skeleton className='h-6 w-96' />
				</div>
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{[1, 2, 3].map((i) => (
						<Card key={i} className='border-2'>
							<CardHeader>
								<Skeleton className='h-6 w-2/3' />
								<Skeleton className='h-4 w-1/2' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-20 w-full' />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-4xl font-bold mb-2'>
						My <span className='gradient-text'>Quizzes</span>
					</h1>
					<p className='text-lg text-muted-foreground'>
						Manage and share your created quizzes
					</p>
				</div>
				<Link to='/quizzes/create'>
					<Button size='lg' className='group'>
						<PlusCircle className='mr-2 h-5 w-5 group-hover:rotate-90 transition-transform' />
						Create New Quiz
					</Button>
				</Link>
			</div>

			{/* Stats */}
			{quizzes && quizzes.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
					<Card className='border-2 card-hover'>
						<CardContent className='pt-6'>
							<div className='flex flex-col items-center text-center space-y-2'>
								<div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
									<BookOpen className='h-6 w-6 text-primary' />
								</div>
								<div>
									<p className='text-3xl font-bold text-primary'>
										{quizzes.length}
									</p>
									<p className='text-sm text-muted-foreground'>Total Quizzes</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-2 card-hover'>
						<CardContent className='pt-6'>
							<div className='flex flex-col items-center text-center space-y-2'>
								<div className='w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center'>
									<Globe className='h-6 w-6 text-green-600 dark:text-green-400' />
								</div>
								<div>
									<p className='text-3xl font-bold text-green-600 dark:text-green-400'>
										{quizzes.filter((q: Quiz) => q.isPublic).length}
									</p>
									<p className='text-sm text-muted-foreground'>Public</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-2 card-hover'>
						<CardContent className='pt-6'>
							<div className='flex flex-col items-center text-center space-y-2'>
								<div className='w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center'>
									<Lock className='h-6 w-6 text-secondary' />
								</div>
								<div>
									<p className='text-3xl font-bold text-secondary'>
										{quizzes.filter((q: Quiz) => !q.isPublic).length}
									</p>
									<p className='text-sm text-muted-foreground'>Private</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Quiz Grid */}
			{!quizzes || quizzes.length === 0 ? (
				<Card className='border-2'>
					<CardContent className='py-16 text-center space-y-4'>
						<div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
							<BookOpen className='h-8 w-8 text-muted-foreground' />
						</div>
						<div>
							<p className='text-lg font-medium mb-1'>No quizzes yet</p>
							<p className='text-sm text-muted-foreground mb-4'>
								Create your first quiz and start testing knowledge!
							</p>
							<Link to='/quizzes/create'>
								<Button size='lg'>
									<PlusCircle className='mr-2 h-5 w-5' />
									Create Your First Quiz
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{quizzes.map((quiz: Quiz, index: number) => (
						<MyQuizCard key={quiz._id} quiz={quiz} index={index} />
					))}
				</div>
			)}
		</div>
	)
}
