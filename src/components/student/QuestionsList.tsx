import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useQuery } from '@tanstack/react-query';
import { questionService } from '../../api/services/question.service';
import type { Question } from '../../types/entities';
import { useState } from 'react';
import Button from '../ui/Button/Button';
import { cn } from '../../lib/utils';

interface QuestionsListProps {
  courseId: string;
  questionIds: string[];
}

/**
 * Componente para mostrar las preguntas de una unidad.
 * Carga las preguntas individualmente y permite al estudiante responderlas.
 */
export default function QuestionsList({
  courseId,
  questionIds,
}: QuestionsListProps) {
  if (questionIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-slate-600" />
            Preguntas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-sm">
            No hay preguntas disponibles para esta unidad.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-purple-600" />
          Preguntas de Autoevaluación ({questionIds.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questionIds.map((questionId, index) => (
            <QuestionItem
              key={questionId}
              courseId={courseId}
              questionId={questionId}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuestionItemProps {
  courseId: string;
  questionId: string;
  questionNumber: number;
}

function QuestionItem({
  courseId,
  questionId,
  questionNumber,
}: QuestionItemProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery<Question>({
    queryKey: ['question', courseId, questionId],
    queryFn: () => questionService.getById(courseId, questionId),
  });

  if (isLoading) {
    return (
      <div className="p-4 border border-slate-200 rounded-lg animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">
          Error al cargar la pregunta. Por favor, intenta más tarde.
        </p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === Number(question.payload.correctAnswer);

  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-500 mb-2">
          Pregunta {questionNumber}
        </p>
        <p className="text-base font-medium text-slate-800">
          {question.questionText}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {question.payload.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption =
            index === Number(question.payload.correctAnswer);

          let borderColor = 'border-slate-200';
          let bgColor = 'bg-white hover:bg-slate-50';

          if (showResult && isSelected) {
            if (isCorrect) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-50';
            } else {
              borderColor = 'border-red-500';
              bgColor = 'bg-red-50';
            }
          } else if (showResult && isCorrectOption) {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-50';
          } else if (isSelected) {
            borderColor = 'border-blue-500';
            bgColor = 'bg-blue-50';
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-3 rounded-lg border-2 transition-all',
                borderColor,
                bgColor,
                !showResult && 'cursor-pointer',
                showResult && 'cursor-default'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-800">{option}</span>
                {showResult && isSelected && (
                  <>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </>
                )}
                {showResult && !isSelected && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div
          className={cn(
            'p-3 rounded-lg mb-3',
            isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          )}
        >
          <p
            className={cn(
              'text-sm font-medium',
              isCorrect ? 'text-green-700' : 'text-red-700'
            )}
          >
            {isCorrect
              ? '¡Correcto! Has seleccionado la respuesta correcta.'
              : 'Incorrecto. Revisa la respuesta correcta marcada arriba.'}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            size="sm"
            className="flex-1"
          >
            Verificar Respuesta
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Intentar de Nuevo
          </Button>
        )}
      </div>
    </div>
  );
}
