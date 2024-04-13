export const EasingFunctions = {
    linear: (percentageElapsed: number, startValue: number, endValue: number) => {
        const normalisedPercentage = Math.min(Math.max(percentageElapsed, 0), 1);
        return startValue + ((endValue - startValue) * normalisedPercentage);
    },
    easeInOutSine: (percentageElapsed: number, startValue: number, endValue: number): number => {
        const normalisedPercentage = Math.min(Math.max(percentageElapsed, 0), 1);
        const easingPercentage = -(Math.cos(Math.PI * normalisedPercentage) - 1) / 2;
        return startValue + ((endValue - startValue) * easingPercentage);
    },
    easeInOutSineBounce: (percentageElapsed: number, startValue: number, endValue: number): number => {
        const normalisedPercentage = Math.min(Math.max(percentageElapsed, 0), 1);
        const doubledPercentage = normalisedPercentage * 2;
        const easingPercentage = -(Math.cos(Math.PI * doubledPercentage) - 1) / 2;
        return startValue + ((endValue - startValue) * easingPercentage);
    }
} as const;

export const EasingsThatEndAtStart = new Set(['easeInOutSineBounce'])

export type EasingFunctionTypes = keyof typeof EasingFunctions;