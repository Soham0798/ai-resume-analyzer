export type Suggestion = {
    type: "good" | "improve";
    tip: string;
};

export type ATSProps = {
    score: number;
    suggestions: Suggestion[];
};

const ATS = ({ score, suggestions }: ATSProps) => {
    let gradientStart = '';
    let atsIcon = '';

    if (score > 69) {
        gradientStart = 'from-green-100';
        atsIcon = '/icons/ats-good.svg';
    } else if (score > 49) {
        gradientStart = 'from-yellow-100';
        atsIcon = '/icons/ats-warning.svg';
    } else {
        gradientStart = 'from-red-100';
        atsIcon = '/icons/ats-bad.svg';
    }

    return (
        <div className={`p-6 rounded-2xl shadow-sm bg-gradient-to-br ${gradientStart} to-white`}>
            <div className="flex items-center gap-4 mb-4">
                <img src={atsIcon} alt="ATS score indicator" className="w-12 h-12" />
                <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">How an ATS sees your resume</h3>
                <p className="text-gray-600">
                    Applicant Tracking Systems (ATS) scan your resume for keywords, formatting, and overall readability. 
                    Based on your score, here is a breakdown of what you did well and what you can improve to increase your chances of passing the initial automated screening.
                </p>
            </div>

            <ul className="flex flex-col gap-3 mb-6">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <img 
                            src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'} 
                            alt={suggestion.type === 'good' ? 'Good' : 'Needs Improvement'} 
                            className="w-5 h-5 mt-0.5" 
                        />
                        <span className="text-gray-800">{suggestion.tip}</span>
                    </li>
                ))}
            </ul>

            <p className="text-sm font-medium text-gray-700 italic border-t pt-4 border-gray-200">
                Keep refining your content and formatting to maximize your ATS compatibility and secure that interview!
            </p>
        </div>
    );
};

export default ATS;