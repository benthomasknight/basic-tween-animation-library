function getDefaultUnitForKey (key: string) {
    switch (key) {
        case 'rotate': return 'turn';
        case 'width': return '%';
        case 'height': return '%';
        default: return 'px';
    }
}

export function getUnit(value: string | number, key: string) {
    const defaultUnit = getDefaultUnitForKey(key);
    if (typeof value !== "string") return defaultUnit;
    const unit = value.replace(/[\d.-]/g, '');
    return unit.length > 0 ? unit : defaultUnit;
}

export function stripUnit(value: string | number) {
    if (typeof value !== "string") return value;

    return parseFloat(value.replace(/[^\d.-]/g, ''));
}

export function getValueAsCss(value: string | number, unit: string) {
    if (value === undefined || value === null) return ''

    return value.toString() + unit;
}