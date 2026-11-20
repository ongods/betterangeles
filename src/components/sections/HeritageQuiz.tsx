import { useState } from 'react';
import { heritageQuiz } from '../../data/heritageQuiz';
import { Heading } from '../ui/Heading';
import SourceLinks from '../ui/SourceLinks';

export default function HeritageQuiz() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const question = heritageQuiz[index];
  const reset = () => {
    setIndex(0);
    setChoice(null);
    setSubmitted(false);
    setScore(0);
  };
  return (
    <section id="heritage-quiz" className="quiz-panel mt-12 max-w-3xl">
      <Heading level={2}>A little Angeles history</Heading>
      <p className="mb-6">
        An initial collection of three source-checked heritage questions.
        Sources reviewed 19 November 2026.
      </p>
      {!question ? (
        <div role="status">
          <p className="text-xl font-semibold">
            You answered {score} of {heritageQuiz.length} correctly.
          </p>
          <p className="my-4">
            Keep exploring the heritage records and their sources.
          </p>
          <button className="action-button" onClick={reset}>
            Try again
          </button>
        </div>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            if (choice === null || submitted) return;
            setSubmitted(true);
            if (choice === question.answer) setScore(value => value + 1);
          }}
        >
          <fieldset disabled={submitted}>
            <legend className="text-lg font-semibold mb-4">
              {index + 1} of {heritageQuiz.length} · {question.question}
            </legend>
            <div className="space-y-3">
              {question.choices.map((answer, answerIndex) => (
                <label key={answer} className="quiz-choice">
                  <input
                    type="radio"
                    name={question.id}
                    checked={choice === answerIndex}
                    onChange={() => setChoice(answerIndex)}
                  />
                  {answer}
                </label>
              ))}
            </div>
          </fieldset>
          {!submitted && (
            <button
              className="action-button mt-5 disabled:opacity-50"
              disabled={choice === null}
            >
              Check answer
            </button>
          )}
          {submitted && (
            <>
              <div role="status" className="mt-5">
                <p className="font-semibold">
                  {choice === question.answer
                    ? 'That’s right.'
                    : `The answer is ${question.choices[question.answer]}.`}
                </p>
                <p className="mt-2">{question.explanation}</p>
                <SourceLinks ids={question.sourceIds} />
              </div>
              <button
                type="button"
                className="action-button mt-5"
                onClick={() => {
                  setIndex(value => value + 1);
                  setChoice(null);
                  setSubmitted(false);
                }}
              >
                {index === heritageQuiz.length - 1
                  ? 'See your results'
                  : 'Next question'}
              </button>
            </>
          )}
        </form>
      )}
    </section>
  );
}
