export declare function assertInterpolationSymbols(identifier: string, value: any): void;
export declare class InterpolationConfig {
    start: string;
    end: string;
    static fromArray(markers: [string, string]): InterpolationConfig;
    constructor(start: string, end: string);
}
export declare const DEFAULT_INTERPOLATION_CONFIG: InterpolationConfig;
