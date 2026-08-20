export function normalizeSearch(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function distanceKm(origin, destination) {
  const points = [origin, destination];
  if (points.some((point) => !Number.isFinite(point?.lat) || !Number.isFinite(point?.lng))) return null;
  const radians = (degrees) => degrees * Math.PI / 180;
  const latDelta = radians(destination.lat - origin.lat);
  const lngDelta = radians(destination.lng - origin.lng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(radians(origin.lat)) * Math.cos(radians(destination.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterSchoolDirectory(schools = [], options = {}) {
  const query = normalizeSearch(options.query);
  const terms = query.split(" ").filter(Boolean);
  const radiusKm = Number(options.radiusKm);
  const hasRadius = Number.isFinite(radiusKm) && radiusKm > 0;
  const hasOrigin = Number.isFinite(options.origin?.lat) && Number.isFinite(options.origin?.lng);

  return schools.flatMap((school) => {
    const schoolText = normalizeSearch(`${school.name} ${school.board || ""} ${(school.tags || []).join(" ")}`);
    const schoolMatches = terms.length > 0 && terms.every((term) => schoolText.includes(term));
    const campuses = (school.campuses || []).map((campus) => {
      const distance = hasOrigin ? distanceKm(options.origin, campus) : null;
      return { ...campus, distanceKm: distance };
    }).filter((campus) => {
      const campusText = normalizeSearch(`${campus.name} ${campus.area} ${campus.address} ${campus.city} ${campus.pincode}`);
      const matchesQuery = terms.length === 0 || schoolMatches || terms.every((term) => `${schoolText} ${campusText}`.includes(term));
      const matchesRadius = !hasOrigin || !hasRadius || (campus.distanceKm !== null && campus.distanceKm <= radiusKm);
      return matchesQuery && matchesRadius;
    }).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

    if (!campuses.length) return [];
    return [{ ...school, campuses, nearestDistanceKm: campuses[0].distanceKm }];
  }).sort((a, b) => (a.nearestDistanceKm ?? Infinity) - (b.nearestDistanceKm ?? Infinity) || a.name.localeCompare(b.name));
}

export function directorySummary(schools = []) {
  return {
    schools: schools.length,
    campuses: schools.reduce((total, school) => total + (school.campuses?.length || 0), 0),
  };
}
