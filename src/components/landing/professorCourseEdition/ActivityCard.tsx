import { Check, Trash2, X } from 'lucide-react';
import Button from '../../ui/Button.tsx';
type Activity = {
  id: number | string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
};

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div key={activity.id} className="p-3 bg-slate-50 rounded-lg border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-800 mb-2">
            {activity.question}
          </p>
          <div className="space-y-1">
            {activity.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                {activity.correctAnswer === index ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <X className="w-3 h-3 text-slate-400" />
                )}
                <span
                  className={
                    activity.correctAnswer === index
                      ? 'text-green-600 font-medium'
                      : 'text-slate-600'
                  }
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/**Añadir un handler para eliminar las actividades */}
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
