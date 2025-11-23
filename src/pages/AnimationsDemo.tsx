import { LottieAnimation } from '../components/animations/LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../utils/lottieAnimations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

/**
 * Demo page showing all available Lottie animations
 * 
 * Usage examples:
 * 
 * // Using animation type (recommended)
 * <LottieAnimation animationType="success" className="w-32 h-32" />
 * 
 * // Using direct URL
 * <LottieAnimation src="https://..." className="w-32 h-32" />
 * 
 * // With custom config
 * <LottieAnimation 
 *   animationType="celebration" 
 *   className="w-64 h-64"
 *   loop={false}
 *   speed={1.5}
 * />
 */
export function AnimationsDemo() {
	const animations = Object.keys(LOTTIE_ANIMATIONS) as Array<
		keyof typeof LOTTIE_ANIMATIONS
	>;

	return (
		<div className="space-y-6 p-8">
			<div>
				<h1 className="text-3xl font-bold mb-2">Lottie Animations Demo</h1>
				<p className="text-muted-foreground">
					All animations are FREE from LottieFiles and ready to use
				</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{animations.map((animType) => (
					<Card key={animType} className="overflow-hidden">
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">{animType}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="aspect-square">
								<LottieAnimation
									animationType={animType}
									className="w-full h-full"
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Usage Examples</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="font-semibold mb-2">Basic Usage:</h3>
						<pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
							{`<LottieAnimation animationType="success" className="w-32 h-32" />`}
						</pre>
					</div>

					<div>
						<h3 className="font-semibold mb-2">With Custom Config:</h3>
						<pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
							{`<LottieAnimation 
  animationType="celebration"
  className="w-64 h-64"
  loop={false}
  speed={1.5}
  autoplay={true}
/>`}
						</pre>
					</div>

					<div>
						<h3 className="font-semibold mb-2">Direct URL:</h3>
						<pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
							{`<LottieAnimation 
  src="https://assets-v2.lottiefiles.com/..."
  className="w-32 h-32"
/>`}
						</pre>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

