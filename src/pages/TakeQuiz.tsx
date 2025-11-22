import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Checkbox } from '../components/ui/checkbox'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../components/ui/alert-dialog'
import {
	useAttempt,
	useSubmitAnswer,
	useSubmitAttempt,
} from '../hooks/useAttempt'
import { Skeleton } from '../components/ui/skeleton'

export function TakeQuiz() {
	const { attemptId } = useParams<{ attemptId: string }>()
	const { data: attempt, isLoading } = useAttempt(attemptId!)
	const { mutate: submitAnswer } = useSubmitAnswer()
	const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt()

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
	const [hasInitialized, setHasInitialized] = useState(false)
	const [showSubmitDialog, setShowSubmitDialog] = useState(false)

	const quiz = attempt?.quizId
	const questions = quiz?.questions || []
	const currentQuestion = questions[currentQuestionIndex]

	// Initialize to first unanswered question when attempt loads
	useEffect(() => {
		if (attempt && questions.length > 0 && !hasInitialized) {
			// Find the first unanswered question
			const answeredIndices = new Set(
				attempt.answers?.map((a: { questionIndex: number }) => a.questionIndex) || []
			)
			
			let firstUnanswered = 0
			for (let i = 0; i < questions.length; i++) {
				if (!answeredIndices.has(i)) {
					firstUnanswered = i
					break
				}
			}
			
			setCurrentQuestionIndex(firstUnanswered)
			setHasInitialized(true)
		}
	}, [attempt, questions.length, hasInitialized])

	// Load saved answer when navigating between questions
	useEffect(() => {
		const savedAnswer = attempt?.answers?.find(
			(a: { questionIndex: number; selectedAnswers: number[] }) =>
				a.questionIndex === currentQuestionIndex
		)
		setSelectedAnswers(savedAnswer?.selectedAnswers || [])
		// Only run when currentQuestionIndex changes (user navigates)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentQuestionIndex])

	const handleAnswerSelect = (optionIndex: number) => {
		if (!currentQuestion) return

		let newAnswers: number[]
		if (
			currentQuestion.questionType === 'mcq' ||
			currentQuestion.questionType === 'true-false'
		) {
			// Single answer
			newAnswers = [optionIndex]
		} else {
			// Multiple answers
			newAnswers = selectedAnswers.includes(optionIndex)
				? selectedAnswers.filter((i) => i !== optionIndex)
				: [...selectedAnswers, optionIndex]
		}
		setSelectedAnswers(newAnswers)
	}

	const handleSaveAndNext = () => {
		if (selectedAnswers.length > 0) {
			submitAnswer({
				attemptId: attemptId!,
				questionIndex: currentQuestionIndex,
				selectedAnswers,
			})
		}

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		}
	}

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1)
		}
	}

	const handleSubmitQuiz = async () => {
		// Save current answer if any before submitting
		if (selectedAnswers.length > 0) {
			submitAnswer(
				{
					attemptId: attemptId!,
					questionIndex: currentQuestionIndex,
					selectedAnswers,
				},
				{
					onSuccess: () => {
						// Submit attempt after answer is saved
						submitAttempt(attemptId!)
					},
					onError: (error) => {
						console.error('Failed to save final answer:', error)
						// Still try to submit the attempt
						submitAttempt(attemptId!)
					},
				}
			)
		} else {
			// No answer selected for current question, submit directly
			submitAttempt(attemptId!)
		}
		setShowSubmitDialog(false)
	}

	if (isLoading) {
		return (
			<div className='max-w-3xl mx-auto'>
				<Card>
					<CardHeader>
						<Skeleton className='h-8 w-2/3' />
					</CardHeader>
					<CardContent className='space-y-4'>
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-full' />
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!quiz || !currentQuestion) {
		return (
			<div className='max-w-3xl mx-auto'>
				<Card>
					<CardContent className='py-12 text-center'>
						<p className='text-gray-500'>Quiz not found</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	const progress = ((currentQuestionIndex + 1) / questions.length) * 100
	
	// Calculate actual answered count including current answer if selected
	const actualAnsweredCount = (() => {
		const savedAnswers = new Set(
			attempt?.answers?.map((a: { questionIndex: number }) => a.questionIndex) || []
		)
		// If current question has a selected answer, count it too
		if (selectedAnswers.length > 0) {
			savedAnswers.add(currentQuestionIndex)
		}
		return savedAnswers.size
	})()

	return (
		<div className='max-w-3xl mx-auto space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>{quiz.topic}</h1>
				<Badge variant='outline' className='capitalize'>
					{quiz.difficulty}
				</Badge>
			</div>

			<div className='space-y-2'>
				<div className='flex items-center justify-between text-sm text-muted-foreground'>
					<span>
						Question {currentQuestionIndex + 1} of {questions.length}
					</span>
					<span>
						Answered: {actualAnsweredCount}/{questions.length}
					</span>
				</div>
				<Progress value={progress} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>
						{currentQuestion.questionText}
					</CardTitle>
					<p className='text-sm text-muted-foreground capitalize'>
						{currentQuestion.questionType === 'mcq' && 'Single Answer'}
						{currentQuestion.questionType === 'true-false' && 'True/False'}
						{currentQuestion.questionType === 'multiple-correct' &&
							'Multiple Answers'}
					</p>
				</CardHeader>
				<CardContent className='space-y-3'>
					{currentQuestion.options.map((option: string, index: number) => (
						<div
							key={index}
							className='flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent'
							onClick={() => handleAnswerSelect(index)}
						>
							{currentQuestion.questionType === 'multiple-correct' ? (
								<Checkbox checked={selectedAnswers.includes(index)} />
							) : (
								<input
									type='radio'
									checked={selectedAnswers.includes(index)}
									onChange={() => {}}
									className='cursor-pointer'
								/>
							)}
							<span>{option}</span>
						</div>
					))}
				</CardContent>
			</Card>

			<div className='flex items-center justify-between'>
				<Button
					variant='outline'
					onClick={handlePrevious}
					disabled={currentQuestionIndex === 0}
				>
					Previous
				</Button>

				<div className='flex gap-2'>
					{currentQuestionIndex < questions.length - 1 ? (
						<Button onClick={handleSaveAndNext}>Save & Next</Button>
					) : (
						<Button 
							onClick={() => setShowSubmitDialog(true)} 
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
						</Button>
					)}
				</div>
			</div>

			<AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to submit the quiz? This action cannot be undone.
							{actualAnsweredCount < questions.length && (
								<span className='block mt-2 text-orange-600 dark:text-orange-400 font-medium'>
									⚠️ You have only answered {actualAnsweredCount} out of {questions.length} questions.
								</span>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction 
							onClick={handleSubmitQuiz}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
