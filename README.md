# Math Immersion Game (Middle School Prototype)

A lightweight web app for grades 7-9 that combines:
- Singapore Math CPA (Concrete-Pictorial-Abstract)
- AMC-style adapted practice questions
- Gamified flow (levels, points, unlocks, mistake review, reinforcement)

## Features

- 7 levels per grade (currently Grade 7, 8, 9)
- Grade switcher with separate local progress per grade
- Mistake Book that records wrong attempts
- 3-question same-topic reinforcement practice from mistakes
- Equipment Shop: spend earned points to buy gear
- Sound feedback: different sounds for correct vs incorrect answers
- Flying Fairy effect: fairy suddenly flies across the screen and speaks feedback automatically (congratulates on correct answers, says "keep going~!" on incorrect answers)
- Animated reward feedback: points burst animation on newly cleared levels plus panel celebrate/shake motion for correct/incorrect answers
- Hints and full solutions for each question
- Flexible answer checking (direct match + numeric equivalence)
- SSAT Middle Vocabulary page with a 2500-word bank, synonym/definition multiple choice, image-based visual hint cards for each word, and a Word Notebook that re-injects wrong words into future practice

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000/index.html`
Vocabulary page: `http://localhost:8000/ssat-vocab.html`

## Unit tests

```bash
node --test tests/gameLogic.test.js tests/reinforcement.test.js tests/curriculum.test.js tests/shopLogic.test.js
```

Covered modules:
- answer normalization/parsing/checking
- reinforcement question generation
- curriculum grade loading and isolation
- shop purchase rules and point deduction

## Next steps

- Extend curriculum to grades 10-12 with progressive difficulty
- Add authorized historical contest datasets
- Add "mistake retry sets" by knowledge point
