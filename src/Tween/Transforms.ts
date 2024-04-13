export const Transforms: Record<string, (value: string | number, unit: string) => string> = {
    rotate: (value: string | number, unit: string) => `rotate(${value}${unit})`,
    x: (value: string | number, unit: string) => `translateX(${value}${unit})`,
    y: (value: string | number, unit: string) => `translateY(${value}${unit})`,
}