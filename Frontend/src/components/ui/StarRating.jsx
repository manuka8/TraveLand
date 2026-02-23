import { FiStar } from 'react-icons/fi';
import { MdStar } from 'react-icons/md';

export default function StarRating({ rating = 0, max = 5, size = 16 }) {
    return (
        <span className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <MdStar key={i} size={size} className={i < Math.round(rating) ? 'text-amber-400' : 'text-slate-600'} />
            ))}
        </span>
    );
}
