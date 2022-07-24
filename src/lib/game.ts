import { randomSecret } from './util';

type Clue = 'fermi' | 'pico' | 'bagels';
type Guess = Readonly<{ clues: Clue[]; guess: string; won: boolean }>;

export class GameError extends Error {}
export class Game {
	constructor(
		readonly secret: string,
		readonly maxGuesses: number,
		readonly guesses: Guess[] = []
	) {}

	static create(secretLength: number, maxGuesses: number): Game {
		return new Game(randomSecret(secretLength), maxGuesses);
	}

	attempt(guess: string): Game {
		if (guess.match(/[^0-9]/)) {
			throw new GameError('The guess must contain only digits.');
		} else if (guess.length !== this.secret.length) {
			throw new GameError(`The guess must be ${this.secret.length} digits.`);
		} else if (new Set(guess).size < this.secret.length) {
			throw new GameError('The guess must only contain unique digits.');
		}
		const clues = [...guess]
			.map((char, idx) => {
				if (this.secret[idx] === char) {
					return 'fermi';
				} else if (this.secret.includes(char)) {
					return 'pico';
				} else {
					return 'bagels';
				}
			})
			.sort();

		return new Game(this.secret, this.maxGuesses, [
			{
				clues,
				guess,
				won: guess === this.secret
			},
			...this.guesses
		]);
	}

	get guessesLeft(): number {
		return this.maxGuesses - this.guesses.length;
	}

	get lost(): boolean {
		return this.guesses.length === this.maxGuesses;
	}

	get won(): boolean {
		return this.guesses.some((guess) => guess.won);
	}
}
