export interface Coordinate {
    latitude: number;
    longitude: number;
}

export function getDistanceBetweenCoordinates(
    from: Coordinate,
    to: Coordinate,
): number {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(to.latitude - from.latitude);
    const dLon = degreesToRadians(to.longitude - from.longitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(from.latitude)) *
            Math.cos(degreesToRadians(to.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;

    return distance;
}

function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}
