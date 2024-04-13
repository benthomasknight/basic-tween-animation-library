import { EasingFunctions, EasingsThatEndAtStart, type EasingFunctionTypes } from "./Easing";
import { Transforms } from "./Transforms";
import { getUnit, getValueAsCss, stripUnit } from "./Units";

type ValidTweenProperties = {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    height?: string | number;
    rotate?: string | number;
}

type TweenConstructorParams<T> = {
    element: HTMLElement;
    duration: number;
    infinite?: boolean;
    startState: T;
    endState: T;
    easing?: EasingFunctionTypes;
}

export class Tween<T extends ValidTweenProperties> {
    private element: HTMLElement;
    private startState: T;
    private endState: T;
    private easing: EasingFunctionTypes;
    private duration: number;
    private infinite: boolean;

    // Is the animation currently running
    private running: boolean = false;

    // Timestamp of the first tick
    private startTickTime: number = 0;

    // Timestamp of the last tick then complete
    private lastTickTime: number = 0;

    constructor({ element, duration, infinite, startState, endState, easing = 'linear' }: TweenConstructorParams<T>) {
        this.element = element;
        this.duration = duration;
        this.startState = startState;
        this.endState = endState;
        this.easing = easing;
        this.infinite = infinite ?? false;

        // Make sure the start and end states have the same keys
        Object.keys({ ...this.startState, ...this.endState }).forEach((key) => {
            const startHasKey = key in this.startState;
            const endHasKey = key in this.endState;

            if (!startHasKey || !endHasKey) throw new Error(`Both start and end need a defined state for key ${key}`);

            const firstUnit = getUnit(this.startState[key as keyof ValidTweenProperties]!, key);
            const secondUnit = getUnit(this.startState[key as keyof ValidTweenProperties]!, key);

            if (firstUnit !== secondUnit) throw new Error(`Start and end have different units for key ${key}`);
        });
    }

    restart() {
        // Record that the animation has been started
        this.running = true;

        // Reset the startTickTime
        this.startTickTime = 0;

        // browser animation callback
        requestAnimationFrame((...args) => this.onTick(...args));
    }

    start() {
        this.running = true;

        requestAnimationFrame((time) => {
            if (this.startTickTime !== 0) {
                // start animation from where it was paused
                const elapsed = this.lastTickTime - this.startTickTime;
                this.startTickTime = time - elapsed;
            }
            this.onTick(time);
        });
        
    }

    stop() {
        this.running = false;
    }

    onTick(time: number) {
        // Cancel early if the animation has stopped
        if (!this.running) return;

        // If this is the first frame, set the start time
        if (!this.startTickTime) this.startTickTime = time;

        // Current animation time - used to know when we stopped the animation
        this.lastTickTime = time;

        const isFinished = !this.infinite ? this.startTickTime + this.duration < time : false;

        if (isFinished) {
            const transforms: string[] = [];
            Object.keys(this.startState).forEach((key) => {
                const value = EasingsThatEndAtStart.has(this.easing)
                    ? this.setElementValue(key, this.startState[key as keyof ValidTweenProperties]!)
                    : this.setElementValue(key, this.endState[key as keyof ValidTweenProperties]!)

                if (value) {
                    transforms.push(value)
                }
            })

            if (transforms.length > 0) {
                this.element.style.transform = transforms.join(' ');
            }
            this.stop();
            this.startTickTime = 0;
            return;
        }

        const timeElapsed = time - this.startTickTime
        const percentageElapsed = this.infinite
            ? (timeElapsed % this.duration) / this.duration
            : timeElapsed / this.duration;

        const transforms: string[] = [];
        Object.keys(this.startState).forEach((key) => {
            const startValue = stripUnit(this.startState[key as keyof ValidTweenProperties]!)
            const endValue = stripUnit(this.endState[key as keyof ValidTweenProperties]!)
            const tweenValue = this.getValueForTween(this.easing, percentageElapsed, startValue, endValue)
            const value = this.setElementValue(key, tweenValue);

            if (value) {
                transforms.push(value)
            }
        })

        if (transforms.length > 0) {
            this.element.style.transform = transforms.join(' ');
        }

        requestAnimationFrame((...args) => this.onTick(...args));
    }

    private setElementValue(key: string, value: string | number) {
        const unit = getUnit(this.startState[key as keyof ValidTweenProperties]!, key);
        const strippedValue = stripUnit(value);

        if (key in Transforms) {
            // Combine transforms as they are faster than default style changes
            return Transforms[key](strippedValue, unit);
        } else {
            this.element.style[key as any] = getValueAsCss(strippedValue, unit);
        }
    }

    private getValueForTween(
        easing: EasingFunctionTypes,
        percentageElapsed: number,
        startValue: number,
        endValue: number
    ) {
        return EasingFunctions[easing](percentageElapsed, startValue, endValue);
    }
}
