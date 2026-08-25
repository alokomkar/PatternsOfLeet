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

export const DISCOVERY_RADIUS_KM = 5;

export function normalizeIndianMobile(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function resolveDemoOrigin(value = "", locations = []) {
  const query = normalizeSearch(value);
  if (!query) return null;
  return locations.find((location) => {
    const locationText = normalizeSearch(`${location.label || ""} ${location.address || ""} ${location.pincode || ""}`);
    return query.split(" ").filter(Boolean).every((term) => locationText.includes(term));
  }) || null;
}

export function filterSchoolDirectory(schools = [], options = {}) {
  const query = normalizeSearch(options.query);
  const terms = query.split(" ").filter(Boolean);
  const requestedRadius = Number(options.radiusKm);
  const radiusKm = Number.isFinite(requestedRadius) && requestedRadius > 0
    ? Math.min(requestedRadius, DISCOVERY_RADIUS_KM)
    : DISCOVERY_RADIUS_KM;
  const hasOrigin = Number.isFinite(options.origin?.lat) && Number.isFinite(options.origin?.lng);
  const boards = new Set((options.boards || []).map(normalizeSearch).filter(Boolean));
  const schoolTypes = new Set((options.schoolTypes || []).map(normalizeSearch).filter(Boolean));
  const minimumRating = Number(options.minimumRating) || 0;
  const recentReviewsOnly = options.recentReviewsOnly === true;

  return schools.flatMap((school) => {
    const schoolText = normalizeSearch(`${school.name} ${school.board || ""} ${(school.tags || []).join(" ")}`);
    const schoolMatches = terms.length > 0 && terms.every((term) => schoolText.includes(term));
    const matchesBoard = boards.size === 0 || boards.has(normalizeSearch(school.board));
    const matchesType = schoolTypes.size === 0 || (school.types || []).some((type) => schoolTypes.has(normalizeSearch(type)));
    const matchesRating = Number(school.rating || 0) >= minimumRating;
    const matchesReviewFreshness = !recentReviewsOnly || Number(school.recentReviewCount || 0) > 0;
    if (!matchesBoard || !matchesType || !matchesRating || !matchesReviewFreshness) return [];
    const campuses = (school.campuses || []).map((campus) => {
      const distance = hasOrigin ? distanceKm(options.origin, campus) : null;
      return { ...campus, distanceKm: distance };
    }).filter((campus) => {
      const campusText = normalizeSearch(`${campus.name} ${campus.area} ${campus.address} ${campus.city} ${campus.pincode}`);
      const matchesQuery = terms.length === 0 || schoolMatches || terms.every((term) => `${schoolText} ${campusText}`.includes(term));
      const matchesRadius = !hasOrigin || (campus.distanceKm !== null && campus.distanceKm <= radiusKm);
      return matchesQuery && matchesRadius;
    }).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

    if (!campuses.length) return [];
    return [{ ...school, campuses, nearestDistanceKm: campuses[0].distanceKm }];
  }).sort((a, b) => (a.nearestDistanceKm ?? Infinity) - (b.nearestDistanceKm ?? Infinity) || a.name.localeCompare(b.name));
}

export function comparisonRows(schools = [], campusIds = []) {
  const selected = [...new Set(campusIds)].slice(0, 3);
  return selected.flatMap((campusId) => schools.flatMap((school) => {
    const campus = (school.campuses || []).find((item) => item.id === campusId);
    if (!campus) return [];
    return [{
      campusId,
      schoolId: school.id,
      schoolName: school.name,
      campusName: campus.name,
      board: school.board,
      rating: Number(school.rating || 0),
      fees: school.fees || "Contact school",
      teacherRatio: school.teacherRatio || "Not published",
      classStrength: school.classStrength || "Not published",
      transport: Boolean(school.transport),
      activities: school.activities || [],
      facilities: school.facilities || [],
      yearsOpen: Number(school.yearsOpen || 0),
    }];
  }));
}

export function validateAppointmentDraft(input = {}, today = new Date()) {
  const errors = {};
  const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0);
  const required = ["schoolId", "campusId", "parentName", "mobile", "email", "childName", "childDob", "gender", "schoolType", "schoolPreference", "syllabus", "appointmentDate", "slot"];
  required.forEach((field) => { if (!String(input[field] || "").trim()) errors[field] = "Required"; });
  const mobile = normalizeIndianMobile(input.mobile);
  if (input.mobile && !/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Enter a valid 10-digit Indian mobile number";
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email))) errors.email = "Enter a valid email address";
  const dob = new Date(`${input.childDob || ""}T00:00:00`);
  if (input.childDob && (!Number.isFinite(dob.getTime()) || dob >= todayStart)) errors.childDob = "Date of birth must be in the past";
  const appointment = new Date(`${input.appointmentDate || ""}T23:59:59`);
  if (input.appointmentDate && (!Number.isFinite(appointment.getTime()) || appointment < todayStart)) errors.appointmentDate = "Choose today or a future date";
  return { valid: Object.keys(errors).length === 0, errors, normalized: { ...input, mobile } };
}

export function nextAppointmentCode(records = [], year = new Date().getFullYear()) {
  const largest = records.reduce((max, record) => {
    const match = String(record.code || "").match(/APT-\d{2}-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `APT-${String(year).slice(-2)}-${String(largest + 1).padStart(4, "0")}`;
}

export function directorySummary(schools = []) {
  return {
    schools: schools.length,
    campuses: schools.reduce((total, school) => total + (school.campuses?.length || 0), 0),
  };
}
