export function validateDate(dateString: string): boolean {
    const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateString.match(datePattern);
    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    return date.getFullYear() === year
        && date.getMonth() === month
        && date.getDate() === day;
}

export function validateGUID(guid: string): boolean {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(guid);
}

export function validateIPV6(ipv6: string): boolean {
    if (!ipv6.includes(":")) {
        return false;
    }

    try {
        const url = new URL(`http://[${ipv6}]/`);
        return url.hostname.startsWith("[") && url.hostname.endsWith("]");
    } catch {
        return false;
    }
}
