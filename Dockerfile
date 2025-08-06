FROM python:latest
WORKDIR /game
COPY guess_game.py .
CMD ["python3", "guess_game.py"]
