import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Sparkles, TrendingUp, Target, Loader2 } from 'lucide-react';
import { useGenerateAdaptiveQuiz } from '../hooks/useQuiz';
import type { Result } from '../types';
import { LottieAnimation } from './animations/LottieAnimation';

interface AdaptiveQuizDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	result: Result;
}

export function AdaptiveQuizDialog({
	open,
	onOpenChange,
	result,
}: AdaptiveQuizDialogProps) {
	const [focusOnWeakAreas, setFocusOnWeakAreas] = useState(true);
	const { mutate: generateAdaptiveQuiz, isPending } =
		useGenerateAdaptiveQuiz();

	const isPerfectScore = result.percentage === 100;
	const wrongAnswersCount = result.totalQuestions - result.score;

	// Extract weak topics from wrong answers (for preview only)
	const weakTopics = result.answers
		.filter((answer) => !answer.isCorrect)
		.map((answer) => {
			// Extract key concepts from question text
			const words = answer.questionText.split(' ').slice(0, 5);
			return words.join(' ') + '...';
		})
		.filter((topic) => topic.length > 3) // Filter out very short topics
		.slice(0, 3); // Show max 3 examples

	// Disable weak area focus if there are no wrong answers
	const canFocusOnWeakAreas = wrongAnswersCount > 0;

	const handleGenerate = () => {
		// Validate result slug exists
		if (!result.slug) {
			console.error('Result slug is missing');
			return;
		}

		generateAdaptiveQuiz(
			{
				resultSlug: result.slug,
				focusOnWeakAreas: isPerfectScore ? false : (focusOnWeakAreas && canFocusOnWeakAreas),
				useHarderDifficulty: isPerfectScore,
			},
			{
				onSuccess: () => {
					// Close dialog after successful generation
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[500px]'>
				{isPending ? (
					<div className='py-8'>
						<div className='flex flex-col items-center justify-center space-y-4'>
							<div className='w-32 h-32'>
								<LottieAnimation
									animationType='loading'
									className='w-full h-full'
								/>
							</div>
							<div className='text-center space-y-2'>
								<h3 className='text-lg font-semibold'>
									Generating Your Personalized Quiz...
								</h3>
								<p className='text-sm text-muted-foreground'>
									Analyzing your performance and creating tailored questions
								</p>
								<p className='text-xs text-muted-foreground'>
									This usually takes 10-15 seconds
								</p>
							</div>
						</div>
					</div>
				) : isPerfectScore ? (
					// Perfect Score: Harder Quiz
					<>
						<DialogHeader>
							<div className='flex items-center justify-center mb-2'>
								<div className='w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
									<TrendingUp className='w-8 h-8 text-white' />
								</div>
							</div>
							<DialogTitle className='text-center text-2xl'>
								Challenge Yourself!
							</DialogTitle>
							<DialogDescription className='text-center'>
								You scored a perfect 100%! Ready to level up?
							</DialogDescription>
						</DialogHeader>

						<div className='space-y-4 py-4'>
							<div className='bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20'>
								<div className='flex items-start gap-3'>
									<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0'>
										<Sparkles className='w-5 h-5 text-primary' />
									</div>
									<div className='flex-1'>
										<h4 className='font-semibold mb-1'>Next Level Challenge</h4>
										<p className='text-sm text-muted-foreground'>
											Your next quiz will be at{' '}
											<span className='font-semibold text-foreground'>
												{result.quizDifficulty === 'easy'
													? 'medium'
													: result.quizDifficulty === 'medium'
													? 'hard'
													: 'advanced'}
											</span>{' '}
											difficulty with more complex questions to push your
											understanding further.
										</p>
									</div>
								</div>
							</div>

							<div className='flex items-center justify-center gap-2'>
								<Badge variant='outline' className='text-green-600 dark:text-green-400'>
									<Target className='w-3 h-3 mr-1' />
									Same Topic
								</Badge>
								<Badge variant='outline' className='text-orange-600 dark:text-orange-400'>
									<TrendingUp className='w-3 h-3 mr-1' />
									Higher Difficulty
								</Badge>
							</div>
						</div>

						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={isPending}
							>
								Maybe Later
							</Button>
							<Button onClick={handleGenerate} disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Generating...
									</>
								) : (
									<>
										<Sparkles className='mr-2 h-4 w-4' />
										Generate Harder Quiz
									</>
								)}
							</Button>
						</DialogFooter>
					</>
				) : (
					// Less than perfect: Focus on weak areas
					<>
						<DialogHeader>
							<div className='flex items-center justify-center mb-2'>
								<div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
									<Target className='w-8 h-8 text-white' />
								</div>
							</div>
							<DialogTitle className='text-center text-2xl'>
								Improve Your Skills
							</DialogTitle>
							<DialogDescription className='text-center'>
								Generate a personalized quiz to strengthen your understanding
							</DialogDescription>
						</DialogHeader>

						<div className='space-y-4 py-4'>
							<div className='bg-muted rounded-lg p-4'>
								<div className='flex items-center justify-between mb-3'>
									<h4 className='font-semibold text-sm'>Your Performance</h4>
									<Badge variant='outline'>
										{result.score}/{result.totalQuestions} correct
									</Badge>
								</div>
								<div className='text-sm text-muted-foreground'>
									{wrongAnswersCount > 0 && (
										<p>
											You got {wrongAnswersCount} question
										{wrongAnswersCount !== 1 ? 's' : ''} wrong. Let's work on
											improving those areas!
										</p>
									)}
								</div>
							</div>

							<div className='space-y-3'>
								<div className='flex items-start space-x-3'>
									<Checkbox
										id='focus-weak'
										checked={focusOnWeakAreas}
										onCheckedChange={(checked) =>
											setFocusOnWeakAreas(checked as boolean)
										}
										disabled={!canFocusOnWeakAreas}
										className='mt-1'
									/>
									<div className='flex-1'>
										<label
											htmlFor='focus-weak'
											className={`text-sm font-medium leading-none cursor-pointer ${
												!canFocusOnWeakAreas ? 'opacity-50' : ''
											}`}
										>
											Focus on topics where I struggled
										</label>
										<p className='text-sm text-muted-foreground mt-1'>
											{canFocusOnWeakAreas
												? '70-80% of questions will target your weak areas, with the rest covering other concepts'
												: 'No wrong answers to focus on - all questions will be new'}
										</p>
									</div>
								</div>

								{focusOnWeakAreas && canFocusOnWeakAreas && weakTopics.length > 0 && (
									<div className='ml-7 space-y-2'>
										<p className='text-xs font-medium text-muted-foreground'>
											Topics to focus on:
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{weakTopics.map((topic, index) => (
												<Badge
													key={index}
													variant='secondary'
													className='text-xs'
												>
													{topic}
												</Badge>
											))}
										</div>
									</div>
								)}
							</div>

							<div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-3'>
								<p className='text-xs text-blue-900 dark:text-blue-100'>
									<strong>Note:</strong> All questions will be new and different
									from your previous quiz, focusing on the same concepts in
									fresh ways. Adaptive quizzes are private and cannot be shared publicly.
								</p>
							</div>
						</div>

						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button onClick={handleGenerate} disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Generating...
									</>
								) : (
									<>
										<Sparkles className='mr-2 h-4 w-4' />
										Generate New Quiz
									</>
								)}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

