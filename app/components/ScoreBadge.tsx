const ScoreBadge = ({ score }: { score: number }) => {
    let bgColor = '';
    let textColor = '';
    let label = '';

    if (score > 70) {
        bgColor = 'bg-green-100';
        textColor = 'text-green-600';
        label = 'Strong';
    } else if (score > 49) {
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-600';
        label = 'Good start';
    } else {
        bgColor = 'bg-red-100';
        textColor = 'text-red-600';
        label = 'Needs Work';
    }

    return (
        <div className={`px-2 py-0.5 rounded-full ${bgColor} inline-block`}>
            <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
        </div>
    );
};

export default ScoreBadge;
