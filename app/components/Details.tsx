import React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from './Accordion';
import { cn } from '~/lib/util';

export type Tip = {
  type: 'good' | 'improve';
  tip: string;
  explanation: string;
};

export type Category = {
  score: number;
  tips: Tip[];
};

export type Feedback = {
  toneAndStyle: Category;
  content: Category;
  structure: Category;
  skills: Category;
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const ImproveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

export const ScoreBadge = ({ score }: { score: number }) => {
  let bgColor = '';
  let textColor = '';
  let showCheck = false;

  if (score > 69) {
    bgColor = 'bg-green-100/80';
    textColor = 'text-green-800';
    showCheck = true;
  } else if (score > 39) {
    bgColor = 'bg-yellow-100/80';
    textColor = 'text-yellow-800';
  } else {
    bgColor = 'bg-red-100/80';
    textColor = 'text-red-800';
  }

  return (
    <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-sm', bgColor, textColor)}>
      {showCheck && <CheckIcon className="w-4 h-4" />}
      <span>{score}/100</span>
    </div>
  );
};

export const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

export const CategoryContent = ({ tips }: { tips: Tip[] }) => {
  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* Two-column grid showing each tip with an icon and text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((t, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className={cn(
              "p-2 rounded-full mt-0.5 shadow-sm",
              t.type === 'good' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
            )}>
              {t.type === 'good' ? <CheckIcon className="w-5 h-5" /> : <ImproveIcon className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-slate-700 leading-snug pt-1">{t.tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List of explanation boxes */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Detailed Breakdown</h4>
        {tips.map((t, idx) => (
          <div key={idx} className={cn(
            "p-4 rounded-xl border-l-4 shadow-sm transition-all",
            t.type === 'good' 
              ? "bg-green-50/70 border-green-400 text-green-900" 
              : "bg-rose-50/70 border-rose-400 text-rose-900"
          )}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider",
                t.type === 'good' ? "text-green-700" : "text-rose-700"
              )}>
                {t.type === 'good' ? 'Great Job' : 'Needs Work'}
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{t.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DetailsProps {
  feedback: Feedback;
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <Accordion defaultOpen="tone-style" className="space-y-4">
        <AccordionItem id="tone-style" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <AccordionHeader itemId="tone-style" className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
            <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-style" className="px-4 sm:px-6">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <AccordionHeader itemId="content" className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
            <CategoryHeader title="Content" categoryScore={feedback.content.score} />
          </AccordionHeader>
          <AccordionContent itemId="content" className="px-4 sm:px-6">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <AccordionHeader itemId="structure" className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
            <CategoryHeader title="Structure" categoryScore={feedback.structure.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure" className="px-4 sm:px-6">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <AccordionHeader itemId="skills" className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
            <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills" className="px-4 sm:px-6">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;