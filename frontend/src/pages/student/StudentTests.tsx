import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Test, TestAttempt } from '../../types';
import { CheckSquare, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export const StudentTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [myAttempts, setMyAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Active quiz attempting state
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.all([api.get('/tests'), api.get('/tests/my-attempts')]);
      if (tRes.data.success) setTests(tRes.data.data);
      if (aRes.data.success) setMyAttempts(aRes.data.data);
    } catch (err) {
      console.error('Failed to load tests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartTest = async (testId: string) => {
    try {
      const response = await api.get(`/tests/${testId}`);
      if (response.data.success) {
        setActiveTest(response.data.data);
        setUserAnswers({});
        setTestResult(null);
      }
    } catch (err) {
      console.error('Failed to start test', err);
    }
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setIsSubmitting(true);

    const answersPayload = (activeTest.questions || []).map((_, idx) => ({
      questionIndex: idx,
      selectedOptionIndex: userAnswers[idx] !== undefined ? userAnswers[idx] : -1,
    }));

    try {
      const response = await api.post(`/tests/${activeTest._id}/attempt`, {
        answers: answersPayload,
      });

      if (response.data.success) {
        setTestResult(response.data.data);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to submit test attempt', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If student is currently taking a test
  if (activeTest) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
              {activeTest.grade} Commerce • {activeTest.subject?.name}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{activeTest.title}</h1>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{activeTest.durationMinutes} Minutes</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
              Total Marks: {activeTest.totalMarks}
            </span>
          </div>
        </div>

        {/* Results Screen if submitted */}
        {testResult ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                testResult.isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {testResult.isPassed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {testResult.isPassed ? 'Congratulations! Test Passed' : 'Test Needs Improvement'}
              </h2>
              <p className="text-slate-500 text-xs">
                You scored <span className="font-bold text-slate-900 text-base">{testResult.totalScore}</span> out of{' '}
                <span className="font-bold text-slate-900 text-base">{testResult.maxScore}</span> marks.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  setActiveTest(null);
                  setTestResult(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Back to Tests Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Active Questions Form */
          <div className="space-y-6">
            {(activeTest.questions || []).map((q, qIdx) => (
              <div key={q._id || qIdx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    Question {qIdx + 1} of {activeTest.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">+{q.marks} Marks</span>
                </div>

                <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.questionText}</p>

                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[qIdx] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => selectAnswer(qIdx, optIdx)}
                        className={`p-3.5 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center space-x-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <button
                onClick={() => setActiveTest(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel Attempt
              </button>

              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'Evaluating Test...' : 'Submit Test for Scoring'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Online Practice Tests</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Prepare for board exams with timed multiple-choice diagnostic tests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No active tests published right now.
          </div>
        ) : (
          tests.map((test) => {
            const attempt = myAttempts.find((a) => (a.test as any)?._id === test._id || (a.test as any) === test._id);
            return (
              <div key={test._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {test.subject?.name}
                    </span>
                    {attempt && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          attempt.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {attempt.isPassed ? 'PASSED' : 'NEEDS REVISION'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{test.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description || 'Commerce quiz'}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.durationMinutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.totalMarks} Marks</span>
                    </span>
                  </div>

                  {attempt && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Your Last Score:</span>
                      <span className="font-extrabold text-slate-900">
                        {attempt.totalScore} / {attempt.maxScore}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartTest(test._id)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>{attempt ? 'Retake Test' : 'Start Test Attempt'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
