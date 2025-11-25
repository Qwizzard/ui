import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useAdaptiveQuizzes } from '../hooks/useQuiz'
import {
	TrendingUp,
	Target,
	Sparkles,
	Calendar,
	Trophy,
	ArrowRight,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { AdaptiveQuizChild } from '../types'

interface AdaptiveQuizTimelineProps {
	parentQuizSlug: string
}

export function AdaptiveQuizTimeline({
	parentQuizSlug,
}: AdaptiveQuizTimelineProps) {
	const { data: adaptiveQuizzes, isLoading } =
		useAdaptiveQuizzes(parentQuizSlug)

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<h3 className='text-xl font-semibold'>Adaptive Quiz History</h3>
				<div className='space-y-3'>
					{[1, 2].map((i) => (
						<Card key={i} className='border-2'>
							<CardContent className='pt-6'>
								<Skeleton className='h-20 w-full' />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	if (!adaptiveQuizzes || adaptiveQuizzes.length === 0) {
		return null
	}

	const getGenerationTypeInfo = (type: string) => {
		switch (type) {
			case 'adaptive-weak':
				return {
					label: 'Weak Areas Focus',
					icon: Target,
					color: 'text-blue-600 dark:text-blue-400',
					bgColor: 'bg-blue-500/10 border-blue-500/20',
				}
			case 'adaptive-harder':
				return {
					label: 'Harder Difficulty',
					icon: TrendingUp,
					color: 'text-orange-600 dark:text-orange-400',
					bgColor: 'bg-orange-500/10 border-orange-500/20',
				}
			case 'adaptive-same':
				return {
					label: 'Same Difficulty',
					icon: Sparkles,
					color: 'text-purple-600 dark:text-purple-400',
					bgColor: 'bg-purple-500/10 border-purple-500/20',
				}
			default:
				return {
					label: 'Adaptive',
					icon: Sparkles,
					color: 'text-primary',
					bgColor: 'bg-primary/10 border-primary/20',
				}
		}
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
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-xl font-semibold'>Adaptive Quiz History</h3>
				<Badge variant='outline' className='text-xs'>
					{adaptiveQuizzes.length} generated
				</Badge>
			</div>
			<p className='text-sm text-muted-foreground'>
				Personalized quizzes generated based on your performance
			</p>

			<div className='space-y-3'>
				{adaptiveQuizzes.map((quiz: AdaptiveQuizChild, index: number) => {
					const typeInfo = getGenerationTypeInfo(quiz.generationType)
					const Icon = typeInfo.icon

					return (
						<Card
							key={quiz._id}
							className={cn(
								'border-2 adaptive-quiz-card transition-all hover:shadow-md',
								index === 0 && 'border-primary/30'
							)}
						>
							<CardContent className='pt-6'>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1 space-y-3'>
										{/* Type Badge and Difficulty */}
										<div className='flex items-center gap-2 flex-wrap'>
											<Badge
												variant='outline'
												className={cn(
													'gap-1',
													typeInfo.bgColor,
													typeInfo.color
												)}
											>
												<Icon className='h-3 w-3' />
												{typeInfo.label}
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
											{index === 0 && (
												<Badge variant='default' className='text-xs'>
													Latest
												</Badge>
											)}
										</div>

										{/* Source Result Info */}
										{quiz.sourceResult && (
											<div className='space-y-2'>
												<div className='flex items-center gap-4 text-sm text-muted-foreground'>
													<div className='flex items-center gap-1'>
														<Trophy className='h-3 w-3' />
														<span>
															Triggered by{' '}
															<span className='font-semibold text-foreground'>
																{quiz.sourceResult.percentage.toFixed(0)}%
															</span>{' '}
															({quiz.sourceResult.score}/
															{quiz.sourceResult.totalQuestions})
														</span>
													</div>
												</div>
												{quiz.completionResult && (
													<div className='flex items-center gap-2 text-sm'>
														<Target className='h-3 w-3 text-green-600 dark:text-green-400' />
														<span className='text-green-600 dark:text-green-400 font-semibold'>
															Completed with{' '}
															{quiz.completionResult.percentage.toFixed(0)}% (
															{quiz.completionResult.score}/
															{quiz.completionResult.totalQuestions})
														</span>
													</div>
												)}
												{!quiz.completionResult && quiz.attemptCount === 0 && (
													<div className='flex items-center gap-2 text-sm text-muted-foreground'>
														<Target className='h-3 w-3' />
														<span className='italic'>Not attempted yet</span>
													</div>
												)}
											</div>
										)}

										{/* Metadata */}
										<div className='flex items-center gap-4 text-xs text-muted-foreground'>
											<div className='flex items-center gap-1'>
												<Calendar className='h-3 w-3' />
												Generated{' '}
												{new Date(quiz.createdAt).toLocaleDateString()}
											</div>
											{quiz.attemptCount > 0 && (
												<div className='flex items-center gap-1'>
													<Sparkles className='h-3 w-3' />
													{quiz.attemptCount} attempt
													{quiz.attemptCount !== 1 ? 's' : ''}
												</div>
											)}
										</div>
									</div>

									{/* Action Button */}
									{quiz.completionResult ? (
										<Link to={`/results/${quiz.completionResult.slug}`}>
											<Button variant='default' size='sm' className='group'>
												View Result
												<ArrowRight className='ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform' />
											</Button>
										</Link>
									) : (
										<Link to={`/quizzes/${quiz.slug}`}>
											<Button variant='outline' size='sm' className='group'>
												View Quiz
												<ArrowRight className='ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform' />
											</Button>
										</Link>
									)}
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
