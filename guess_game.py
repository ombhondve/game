import random
import os

BEST_SCORE_FILE = "best_score.txt"

def load_best_score():
    if not os.path.exists(BEST_SCORE_FILE):
        return None
    with open(BEST_SCORE_FILE, "r") as file:
        try:
            return int(file.read().strip())
        except ValueError:
            return None

def save_best_score(score):
    with open(BEST_SCORE_FILE, "w") as file:
        file.write(str(score))

def play_game():
    number = random.randint(1, 100)
    attempts = 0
    print("🔢 I'm thinking of a number between 1 and 100. Can you guess it?")

    while True:
        try:
            guess = int(input("Enter your guess: "))
            attempts += 1

            if guess < number:
                print("Too low! 📉")
            elif guess > number:
                print("Too high! 📈")
            else:
                print(f"🎉 Correct! You guessed it in {attempts} tries.")
                return attempts
        except ValueError:
            print("Please enter a valid number.")

def main():
    best_score = load_best_score()
    if best_score:
        print(f"🏆 Best score so far: {best_score} guesses")

    attempts = play_game()

    if not best_score or attempts < best_score:
        print("🥳 New best score!")
        save_best_score(attempts)

    again = input("Play again? (y/n): ").strip().lower()
    if again == "y":
        main()
    else:
        print("Thanks for playing!")

if __name__ == "__main__":
    main()
