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
import { Skeleton } from '../components/ui/skeleton'
import { useGroupedResults } from '../hooks/useResult'
import {
	BookOpen,
	Trophy,
	ArrowRight,
	Sparkles,
	Calendar,
	Target,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import type { Result } from '../types'

export function AllResults() {
	const { data: groupedResults, isLoading } = useGroupedResults()

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

	const getScoreColor = (percentage: number) => {
		if (percentage >= 80) {
			return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
		}
		if (percentage >= 60) {
			return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
		}
		return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
	}

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='space-y-2'>
					<Skeleton className='h-10 w-64' />
					<Skeleton className='h-6 w-96' />
				</div>
				<div className='space-y-4'>
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
			<div className='flex flex-col gap-2'>
				<h1 className='text-4xl font-bold'>
					All <span className='gradient-text'>Results</span>
				</h1>
				<p className='text-lg text-muted-foreground'>
					View all your quiz attempts and track your progress
				</p>
			</div>

			{/* Results */}
			{!groupedResults || groupedResults.length === 0 ? (
				<Card className='border-2'>
					<CardContent className='py-16 text-center space-y-4'>
						<div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
							<Trophy className='h-8 w-8 text-muted-foreground' />
						</div>
						<div>
							<p className='text-lg font-medium mb-1'>No results yet</p>
							<p className='text-sm text-muted-foreground mb-4'>
								Start taking quizzes to see your results here
							</p>
							<Link to='/quizzes/public'>
								<Button size='lg'>
									<BookOpen className='mr-2 h-5 w-5' />
									Browse Quizzes
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className='space-y-6'>
					{groupedResults.map((group: any, groupIndex: number) => (
						<motion.div
							key={group.quizId}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: groupIndex * 0.1 }}
						>
							<Card className='border-2 overflow-hidden'>
								<CardHeader className='bg-muted/50'>
									<div className='flex items-start justify-between gap-4'>
										<div className='flex-1'>
											<CardTitle className='text-2xl mb-2'>
												{group.quizTopic}
											</CardTitle>
											<div className='flex items-center gap-2 flex-wrap'>
												<Badge
													variant='outline'
													className={cn(
														'capitalize',
														getDifficultyColor(group.quizDifficulty)
													)}
												>
													{group.quizDifficulty}
												</Badge>
												<CardDescription className='flex items-center gap-1'>
													<Target className='h-3 w-3' />
													{group.originalResults.length} attempt
													{group.originalResults.length !== 1 ? 's' : ''}
												</CardDescription>
											</div>
										</div>
										<Link to={`/quizzes/${group.quizSlug}`}>
											<Button variant='outline' size='sm'>
												View Quiz
											</Button>
										</Link>
									</div>
								</CardHeader>
								<CardContent className='pt-6'>
									{/* Original Quiz Results */}
									<div className='space-y-3'>
										{group.originalResults.map((result: any, idx: number) => (
											<Link
												key={result._id}
												to={`/results/${result.slug}`}
												className='block'
											>
												<motion.div
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: idx * 0.05 }}
													className='flex items-center justify-between p-4 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition-all group'
												>
													<div className='flex-1'>
														<div className='flex items-center gap-2 mb-1'>
															<Trophy className='h-4 w-4 text-primary' />
															<p className='font-semibold group-hover:text-primary transition-colors'>
																Original Quiz
															</p>
														</div>
														<div className='flex items-center gap-3 text-sm text-muted-foreground'>
															<div className='flex items-center gap-1'>
																<Calendar className='h-3 w-3' />
																{new Date(result.completedAt).toLocaleDateString(
																	'en-US',
																	{
																		month: 'short',
																		day: 'numeric',
																		year: 'numeric',
																	}
																)}
															</div>
															<div>
																{result.score}/{result.totalQuestions} correct
															</div>
														</div>
													</div>
													<div className='flex items-center gap-3'>
														<Badge
															variant='outline'
															className={getScoreColor(result.percentage)}
														>
															{result.percentage.toFixed(0)}%
														</Badge>
														<ArrowRight className='h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform' />
													</div>
												</motion.div>
											</Link>
										))}
									</div>

									{/* Adaptive Quiz Results */}
									{group.adaptiveGroups.length > 0 && (
										<div className='mt-6 pt-6 border-t space-y-4'>
											<div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground'>
												<Sparkles className='h-4 w-4 text-primary' />
												Adaptive Quizzes
											</div>
											{group.adaptiveGroups.map((adaptiveGroup: any) => (
												<div
													key={adaptiveGroup.quiz._id}
													className='pl-4 border-l-2 border-primary/20 space-y-3'
												>
													<div className='flex items-center gap-2'>
														<Badge variant='outline' className='adaptive-badge gap-1 text-xs'>
															<Sparkles className='h-3 w-3' />
															{adaptiveGroup.quiz.generationType?.replace('adaptive-', '') || 'Adaptive'}
														</Badge>
														<Badge
															variant='outline'
															className={cn(
																'capitalize text-xs',
																getDifficultyColor(adaptiveGroup.quiz.difficulty)
															)}
														>
															{adaptiveGroup.quiz.difficulty}
														</Badge>
													</div>
													{adaptiveGroup.results.map((result: any, idx: number) => (
														<Link
															key={result._id}
															to={`/results/${result.slug}`}
															className='block'
														>
															<motion.div
																initial={{ opacity: 0, x: -10 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{ delay: idx * 0.05 }}
																className='flex items-center justify-between p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all group'
															>
																<div className='flex-1'>
																	<div className='flex items-center gap-3 text-sm text-muted-foreground'>
																		<div className='flex items-center gap-1'>
																			<Calendar className='h-3 w-3' />
																			{new Date(
																				result.completedAt
																			).toLocaleDateString('en-US', {
																				month: 'short',
																				day: 'numeric',
																				year: 'numeric',
																			})}
																		</div>
																		<div>
																			{result.score}/{result.totalQuestions} correct
																		</div>
																	</div>
																</div>
																<div className='flex items-center gap-3'>
																	<Badge
																		variant='outline'
																		className={getScoreColor(result.percentage)}
																	>
																		{result.percentage.toFixed(0)}%
																	</Badge>
																	<ArrowRight className='h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform' />
																</div>
															</motion.div>
														</Link>
													))}
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}



