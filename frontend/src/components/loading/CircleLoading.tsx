
interface LoadingProps {
    className?: string
}

function CirceLoading({ className }: LoadingProps) {
    return (
        <div className={className}>
            <div className="rounded-full w-8 h-8 border-primary border-4 border-t-transparent animate-spin" />
        </div>
    );
}

export default CirceLoading;