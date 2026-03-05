import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function InteractiveRobotSpline({ scene, className }) {
    return (
        <Suspense
            fallback={
                <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-indigo-200/70 font-medium">Loading 3D scene...</span>
                    </div>
                </div>
            }
        >
            <Spline
                scene={scene}
                className={className}
            />
        </Suspense>
    );
}
