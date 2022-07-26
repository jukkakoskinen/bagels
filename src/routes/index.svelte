<script lang="ts">
	import type { WithTarget } from '$lib/dom';
	import { Game, GameError } from '$lib/game';

	let game = Game.create(3, 10);
	let gameError: string | null = null;
	let guess = '';

	function handleGuessSubmit(event: WithTarget<SubmitEvent, HTMLFormElement>): void {
		gameError = null;
		try {
			game = game.attempt(guess);
			event.currentTarget.reset();
		} catch (error) {
			if (!(error instanceof GameError)) {
				throw error;
			}
			gameError = error.message;
		}
	}
</script>

<svelte:head>
	<title>Bagels</title>
</svelte:head>

<div class="bg-black font-mono min-h-screen text-white">
	<div class="mx-auto max-w-xl p-4 md:p-12">
		<h1 class="mb-2 text-xl">Bagels</h1>
		<p class="mb-6 text-neutral-400">
			I am thinking of a {game.secret.length}-digit number with no repeated digits. Try to guess it!
		</p>
		{#if game.won}
			<a
				class="bg-transparent block border border-green-400 font-bold mb-4 px-2 py-1 text-center text-green-400 w-full"
				href="/"
				sveltekit:reload>You win! Try again?</a
			>
		{:else if game.lost}
			<a
				class="bg-transparent block border border-red-400 font-bold mb-4 px-2 py-1 text-center text-red-400 w-full"
				href="/"
				sveltekit:reload>You lose! Try again?</a
			>
		{:else}
			<div class="mb-6">
				<form
					class="flex space-x-2"
					autocomplete="off"
					on:submit|preventDefault={handleGuessSubmit}
				>
					<input
						class="bg-transparent border border-neutral-400 px-2 py-1 w-full placeholder:text-neutral-400"
						name="guess"
						type="text"
						inputmode="numeric"
						placeholder="Enter your guess"
						bind:value={guess}
					/>
					<button class="bg-transparent border border-neutral-400 px-2 py-1 whitespace-nowrap"
						>Attempt ({game.guessesLeft})</button
					>
				</form>
				{#if gameError}
					<div class="mt-2 text-red-400">{gameError}</div>
				{/if}
			</div>
		{/if}
		{#if game.guesses.length}
			<div class="border border-neutral-400 divide-y divide-neutral-400 max-h-52 mb-6 overflow-auto">
				{#each game.guesses as guess, idx}
					<div class="flex space-x-2 p-2" class:opacity-50={idx > 0}>
						<div class="flex space-x-0.5 text-green-400">
							{#each guess.clues as clue}
								{#if clue === 'pico'}
									<span>▒</span>
								{:else if clue === 'fermi'}
									<span>█</span>
								{:else}
									<span>░</span>
								{/if}
							{/each}
						</div>
						<div>
							{guess.won
								? `${guess.guess} is correct. You win!`
								: `${guess.guess} is incorrect. Try again!`}
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<dl id="help" class="mb-6">
			<dt class="inline-flex">
				<span class="text-green-400 w-6">▒</span>
				<span>Pico</span>
			</dt>
			<dd class="mb-2 ml-6 text-neutral-400">One digit is correct but in the wrong position.</dd>
			<dt class="inline-flex">
				<span class="text-green-400 w-6">█</span>
				<span>Fermi</span>
			</dt>
			<dd class="mb-2 ml-6 text-neutral-400">One digit is correct and in the correct position.</dd>
			<dt class="inline-flex">
				<span class="text-green-400 w-6">░</span>
				<span>Bagels</span>
			</dt>
			<dd class="ml-6 text-neutral-400">No digit is correct.</dd>
		</dl>
		<div class="text-neutral-400 text-sm md:fixed md:bottom-4 md:right-4">
			Made by <a class="underline" href="https://www.jukkakoskinen.fi">Jukka Koskinen</a>
		</div>
	</div>
</div>
