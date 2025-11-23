// Real Lottie animations from LottieFiles API
// These are actual FREE animations with working URLs

export const LOTTIE_ANIMATIONS = {
	// Hero & Welcome
	hero: 'https://assets-v2.lottiefiles.com/a/76eaae78-1176-11ee-b9c3-5331b37949f4/KU67wcBKPU.lottie',
	welcome:
		'https://assets-v2.lottiefiles.com/a/3234622e-1171-11ee-a9a6-cfce507b952b/xHrN2QJ96W.lottie',

	// Success & Celebration
	success:
		'https://assets-v2.lottiefiles.com/a/87cf5430-1169-11ee-a235-b344ffb19bdb/eFfRjEvOqy.lottie',
	celebration:
		'https://assets-v2.lottiefiles.com/a/112c6490-1181-11ee-b0f7-871603e699f6/5tVGGuDkmY.lottie',
	celebration2:
		'https://assets-v2.lottiefiles.com/a/1f10b94e-1177-11ee-9215-1737c84b0d52/7dESl1s3ch.lottie',
	celebrationParticle:
		'https://assets-v2.lottiefiles.com/a/5794a6d8-1166-11ee-9721-77709214c601/I2vwYZODcu.lottie',
	celebrationRocket:
		'https://assets-v2.lottiefiles.com/a/bd8e4a86-1164-11ee-9805-6727d083dab2/VpuEHNP2ZC.lottie',
	trophy:
		'https://assets-v2.lottiefiles.com/a/a4e9145c-1150-11ee-a111-5f0b42c20def/YPsJNCW4Nv.lottie',
	trophy2:
		'https://assets-v2.lottiefiles.com/a/745fc364-117b-11ee-b7ec-9f18a8a356e0/ctpFpJP75f.lottie',
	trophyBadge:
		'https://assets-v2.lottiefiles.com/a/a5841fa0-117e-11ee-baae-5bb1ce7e6584/G96ILI4Xy6.lottie',
	confetti:
		'https://assets-v2.lottiefiles.com/a/b48a863e-1150-11ee-8fb8-9fe971b7941f/VM0SBaYaJU.lottie',
	confettiFullScreen:
		'https://assets-v2.lottiefiles.com/a/09d2e6f4-116f-11ee-95d4-8fac7a332656/askI24vg1T.lottie',
	fireworks:
		'https://assets-v2.lottiefiles.com/a/d601a13e-1151-11ee-b2e2-73fdc183ef8e/eHMKup59WG.lottie',
	fireworks2:
		'https://assets-v2.lottiefiles.com/a/c5e67a64-1150-11ee-958b-972e50a39fec/8k70brgrui.lottie',
	correct:
		'https://assets-v2.lottiefiles.com/a/8719f21a-6aac-11ee-9a6e-5f572234326f/d7XE1uUfc4.lottie',

	// Error & Try Again
	error:
		'https://assets-v2.lottiefiles.com/a/d46056d2-1150-11ee-82aa-a74547e811c5/ex0kqNVDAd.lottie',
	tryAgain:
		'https://assets-v2.lottiefiles.com/a/46dab46e-e149-11ee-aa24-c388552c45b1/vhlQkg06Sv.lottie',

	// Loading & Progress
	loading:
		'https://assets-v2.lottiefiles.com/a/f174b4ee-5858-11ee-8095-3fa01b36d1b3/Kydtjlcm6Q.lottie',
	thinking:
		'https://assets-v2.lottiefiles.com/a/48f981f2-1170-11ee-9e23-6b5522fff378/yzDUhHjQOw.lottie',
	progress:
		'https://assets-v2.lottiefiles.com/a/4bb3848c-1176-11ee-ada8-f3d747b70c82/NEaSdm82BE.lottie',

	// Empty States
	emptyQuizzes:
		'https://assets-v2.lottiefiles.com/a/5de3d29a-1182-11ee-b738-e37a0875f9b0/vcnxBocPU9.lottie',
	emptyResults:
		'https://assets-v2.lottiefiles.com/a/7e5247c2-9b30-11ee-9138-1f77cc6ae21b/NISwAKtj8B.lottie',
	notFound:
		'https://assets-v2.lottiefiles.com/a/66a27c96-1151-11ee-84f2-7b0539a7b215/cQPHFXkDNr.lottie',

	// Interactive Elements
	books:
		'https://assets-v2.lottiefiles.com/a/1fd53a68-118a-11ee-82bd-13ef09c2cdae/1TIitrYzuh.lottie',
	brain:
		'https://assets-v2.lottiefiles.com/a/a5a7c40a-117e-11ee-bad2-fbef81598282/tU0LExVoto.lottie',
	rocket:
		'https://assets-v2.lottiefiles.com/a/d41a2ac8-117c-11ee-ac01-176a80478d87/9zaQ2rpgNX.lottie',
	star: 'https://assets-v2.lottiefiles.com/a/926851ee-1150-11ee-b7f3-a36558b5c712/GBlrvaRN6k.lottie',

	// Quiz specific
	countdown:
		'https://assets-v2.lottiefiles.com/a/56528d28-1187-11ee-a010-8bf27e80819f/jlX3bj7aEr.lottie',
	question:
		'https://assets-v2.lottiefiles.com/a/f0ce2cc8-1163-11ee-b803-ef3a3a12bb78/wAXyEA66YN.lottie',
	timer:
		'https://assets-v2.lottiefiles.com/a/90cba2ec-1168-11ee-96c4-4f40de59ab0a/nZeK1eGtEG.lottie',
} as const

// Fetch animations from LottieFiles API (for dynamic searching if needed)
export interface LottieSearchParams {
	query: string
	page?: number
	limit?: number
}

export interface LottieAnimation {
	id: string
	name: string
	bgColor: string | null
	lottieSource?: string | null
	jsonSource?: string | null
	gifUrl?: string | null
	imageSource?: string
	videoSource?: string
	type: 'FREE' | 'PREMIUM'
	slug: string
}

export async function searchLottieAnimations(
	params: LottieSearchParams
): Promise<LottieAnimation[]> {
	try {
		const { query, page = 1, limit = 15 } = params
		const response = await fetch(
			`https://lottiefiles.com/api/search/get-animations?query=${encodeURIComponent(
				query
			)}&page=${page}&limit=${limit}`
		)

		if (!response.ok) {
			throw new Error('Failed to fetch animations')
		}

		const data = await response.json()
		const animations = data.data?.data || []

		// Filter for FREE animations only with valid sources
		return animations.filter(
			(anim: LottieAnimation) =>
				anim.type === 'FREE' && (anim.lottieSource || anim.jsonSource)
		)
	} catch (error) {
		console.error('Error fetching Lottie animations:', error)
		return []
	}
}

// Get the animation source URL (lottieSource or jsonSource)
export function getAnimationSource(animation: LottieAnimation): string | null {
	return animation.lottieSource || animation.jsonSource || null
}

// Helper to get animation URL by key
export function getAnimationUrl(key: keyof typeof LOTTIE_ANIMATIONS): string {
	return LOTTIE_ANIMATIONS[key]
}

// Animation configuration presets
export const ANIMATION_CONFIG = {
	default: {
		autoplay: true,
		loop: true,
		speed: 1,
	},
	once: {
		autoplay: true,
		loop: false,
		speed: 1,
	},
	slow: {
		autoplay: true,
		loop: true,
		speed: 0.7,
	},
	fast: {
		autoplay: true,
		loop: true,
		speed: 1.5,
	},
} as const
