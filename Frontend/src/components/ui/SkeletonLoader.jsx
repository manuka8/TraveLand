export default function SkeletonLoader({ className = 'h-48 w-full' }) {
    return (
        <div className={`bg-dark-800 rounded-2xl animate-pulse ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="card p-0 overflow-hidden animate-pulse">
            <div className="h-48 bg-dark-800" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-dark-800 rounded w-3/4" />
                <div className="h-3 bg-dark-800 rounded w-1/2" />
                <div className="h-3 bg-dark-800 rounded w-full" />
                <div className="h-3 bg-dark-800 rounded w-4/5" />
            </div>
        </div>
    );
}
