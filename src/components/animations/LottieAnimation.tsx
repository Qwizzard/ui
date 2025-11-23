import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '../../lib/utils';
import { getAnimationUrl, LOTTIE_ANIMATIONS } from '../../utils/lottieAnimations';

interface LottieAnimationProps {
	src?: string;
	animationType?: keyof typeof LOTTIE_ANIMATIONS;
	className?: string;
	autoplay?: boolean;
	loop?: boolean;
	speed?: number;
	fallback?: React.ReactNode;
}

export function LottieAnimation({
	src,
	animationType,
	className,
	autoplay = true,
	loop = true,
	speed = 1,
	fallback,
}: LottieAnimationProps) {
	// Use provided src or get from animation type
	const animationSrc = src || (animationType ? getAnimationUrl(animationType) : null);

	if (!animationSrc) {
		return (
			<div className={cn('flex items-center justify-center', className)}>
				{fallback || <div className="text-muted-foreground">No animation</div>}
			</div>
		);
	}

	return (
		<div className={cn('flex items-center justify-center', className)}>
			<DotLottieReact
				src={animationSrc}
				autoplay={autoplay}
				loop={loop}
				speed={speed}
				style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
				className="dotlottie-player"
			/>
		</div>
	);
}
