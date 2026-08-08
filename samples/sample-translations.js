(function () {
  const languages = {
    en: "English",
    kn: "ಕನ್ನಡ",
    hi: "हिन्दी",
    ta: "தமிழ்",
    te: "తెలుగు",
    ml: "മലയാളം"
  };

  const translations = {
    kn: {
      "Sample clinic website - fictional business for demonstration": "ಮಾದರಿ ಕ್ಲಿನಿಕ್ ವೆಬ್‌ಸೈಟ್ - ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಲ್ಪಿತ ವ್ಯವಹಾರ",
      "Sample school website - fictional institution for demonstration": "ಮಾದರಿ ಶಾಲಾ ವೆಬ್‌ಸೈಟ್ - ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಲ್ಪಿತ ಸಂಸ್ಥೆ",
      "Sample coaching centre website - fictional business for demonstration": "ಮಾದರಿ ಕೋಚಿಂಗ್ ಸೆಂಟರ್ ವೆಬ್‌ಸೈಟ್ - ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಲ್ಪಿತ ವ್ಯವಹಾರ",
      "Sample service business website - fictional business for demonstration": "ಮಾದರಿ ಸೇವಾ ವ್ಯವಹಾರ ವೆಬ್‌ಸೈಟ್ - ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಲ್ಪಿತ ವ್ಯವಹಾರ",
      "Sample sites by SortedQueue - fictional businesses for demonstration": "SortedQueue ಮಾದರಿ ಸೈಟ್‌ಗಳು - ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಲ್ಪಿತ ವ್ಯವಹಾರಗಳು",
      "Family clinic in Shivamogga": "ಶಿವಮೊಗ್ಗದ ಕುಟುಂಬ ಕ್ಲಿನಿಕ್",
      "Primary care that is clear, accessible, and appointment-friendly.": "ಸ್ಪಷ್ಟ, ಸುಲಭವಾಗಿ ಲಭ್ಯವಿರುವ ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗೆ ಅನುಕೂಲಕರವಾದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಸೇವೆ.",
      "A sample clinic website showing how doctors, timings, services, location, and appointment actions can be presented for patient trust.": "ವೈದ್ಯರು, ಸಮಯ, ಸೇವೆಗಳು, ಸ್ಥಳ ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕ್ರಮಗಳನ್ನು ರೋಗಿಯ ನಂಬಿಕೆಗೆ ಹೇಗೆ ತೋರಿಸಬಹುದು ಎಂಬುದನ್ನು ತೋರಿಸುವ ಮಾದರಿ ಕ್ಲಿನಿಕ್ ವೆಬ್‌ಸೈಟ್.",
      "Call or WhatsApp": "ಕಾಲ್ ಅಥವಾ WhatsApp",
      "View services": "ಸೇವೆಗಳು ನೋಡಿ",
      "Open today: 9:00 AM - 7:30 PM": "ಇಂದು ತೆರೆದಿದೆ: ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 7:30",
      "General consultation, diabetes follow-up, fever care, preventive checks.": "ಸಾಮಾನ್ಯ ಸಲಹೆ, ಮಧುಮೇಹ ಫಾಲೋ-ಅಪ್, ಜ್ವರ ಆರೈಕೆ, ತಡೆಗಟ್ಟುವ ತಪಾಸಣೆಗಳು.",
      "Services": "ಸೇವೆಗಳು",
      "Patients should understand care options before calling.": "ಕಾಲ್ ಮಾಡುವ ಮೊದಲು ರೋಗಿಗಳು ಆರೈಕೆ ಆಯ್ಕೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬೇಕು.",
      "General consultation": "ಸಾಮಾನ್ಯ ಸಲಹೆ",
      "Everyday illness, fever, infections, pain, and family health concerns.": "ದೈನಂದಿನ ಕಾಯಿಲೆ, ಜ್ವರ, ಸೋಂಕು, ನೋವು ಮತ್ತು ಕುಟುಂಬ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು.",
      "Chronic care": "ದೀರ್ಘಕಾಲದ ಆರೋಗ್ಯ ಆರೈಕೆ",
      "Diabetes, blood pressure, thyroid follow-ups, and routine monitoring.": "ಮಧುಮೇಹ, ರಕ್ತದೊತ್ತಡ, ಥೈರಾಯ್ಡ್ ಫಾಲೋ-ಅಪ್ ಮತ್ತು ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ.",
      "Preventive checks": "ತಡೆಗಟ್ಟುವ ತಪಾಸಣೆಗಳು",
      "Health screening guidance, reports review, and lifestyle counselling.": "ಆರೋಗ್ಯ ತಪಾಸಣೆ ಮಾರ್ಗದರ್ಶನ, ವರದಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಜೀವನಶೈಲಿ ಸಲಹೆ.",
      "Sample doctor profile": "ಮಾದರಿ ವೈದ್ಯರ ಪ್ರೊಫೈಲ್",
      "12 years of family medicine experience. Languages: Kannada, English, Hindi.": "ಕುಟುಂಬ ವೈದ್ಯಕೀಯದಲ್ಲಿ 12 ವರ್ಷದ ಅನುಭವ. ಭಾಷೆಗಳು: ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ.",
      "Why this section matters": "ಈ ವಿಭಾಗ ಏಕೆ ಮುಖ್ಯ",
      "Patients want qualification and language clarity.": "ರೋಗಿಗಳು ಅರ್ಹತೆ ಮತ್ತು ಭಾಷೆಯ ಸ್ಪಷ್ಟತೆಯನ್ನು ಬಯಸುತ್ತಾರೆ.",
      "Timings and location reduce phone friction.": "ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಮಾಹಿತಿ ಫೋನ್ ಅಡೆತಡೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
      "Appointment CTAs should stay visible on mobile.": "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ CTA ಮೊಬೈಲ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಬೇಕು.",
      "Appointment flow": "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪ್ರಕ್ರಿಯೆ",
      "Clear call, WhatsApp, location, and timing actions.": "ಕಾಲ್, WhatsApp, ಸ್ಥಳ ಮತ್ತು ಸಮಯ ಕ್ರಮಗಳನ್ನು ಸ್ಪಷ್ಟಗೊಳಿಸಿ.",
      "Discuss clinic site": "ಕ್ಲಿನಿಕ್ ಸೈಟ್ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ",
      "Sample site - not a real clinic": "ಮಾದರಿ ಸೈಟ್ - ನಿಜವಾದ ಕ್ಲಿನಿಕ್ ಅಲ್ಲ",
      "Admissions sample for Karnataka schools": "ಕರ್ನಾಟಕ ಶಾಲೆಗಳ ಪ್ರವೇಶ ಮಾದರಿ",
      "A parent-friendly school website for admissions season.": "ಪ್ರವೇಶ ಅವಧಿಗೆ ಪೋಷಕರಿಗೆ ಅನುಕೂಲಕರವಾದ ಶಾಲಾ ವೆಬ್‌ಸೈಟ್.",
      "A sample school website showing admissions clarity, programs, campus trust, parent FAQs, and multilingual enquiry support.": "ಪ್ರವೇಶ ಸ್ಪಷ್ಟತೆ, ಕಾರ್ಯಕ್ರಮಗಳು, ಕ್ಯಾಂಪಸ್ ನಂಬಿಕೆ, ಪೋಷಕರ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಬಹುಭಾಷಾ ವಿಚಾರಣೆ ಬೆಂಬಲವನ್ನು ತೋರಿಸುವ ಮಾದರಿ ಶಾಲಾ ವೆಬ್‌ಸೈಟ್.",
      "Admissions open": "ಪ್ರವೇಶಗಳು ಆರಂಭವಾಗಿವೆ",
      "View programs": "ಕಾರ್ಯಕ್ರಮಗಳು ನೋಡಿ",
      "Admissions 2026-27": "ಪ್ರವೇಶಗಳು 2026-27",
      "Nursery to Grade 10 - campus visit and parent counselling available.": "ನರ್ಸರಿಯಿಂದ 10ನೇ ತರಗತಿ - ಕ್ಯಾಂಪಸ್ ಭೇಟಿ ಮತ್ತು ಪೋಷಕರ ಸಲಹೆ ಲಭ್ಯ.",
      "Programs": "ಕಾರ್ಯಕ್ರಮಗಳು",
      "Parents need a clear view of academics and student life.": "ಪೋಷಕರಿಗೆ ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ಜೀವನದ ಸ್ಪಷ್ಟ ಚಿತ್ರ ಬೇಕು.",
      "Early years": "ಆರಂಭಿಕ ತರಗತಿಗಳು",
      "Activity-based learning, safety routines, and parent communication.": "ಚಟುವಟಿಕೆ ಆಧಾರಿತ ಕಲಿಕೆ, ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು ಮತ್ತು ಪೋಷಕರ ಸಂವಹನ.",
      "Primary school": "ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
      "Core academics, language development, projects, and foundation skills.": "ಮೂಲಭೂತ ಶಿಕ್ಷಣ, ಭಾಷಾ ಅಭಿವೃದ್ಧಿ, ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು ಮತ್ತು ನೆಲೆ ಕೌಶಲ್ಯಗಳು.",
      "High school": "ಹೈಸ್ಕೂಲ್",
      "Exam readiness, mentoring, labs, sports, and co-curricular exposure.": "ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ, ಮಾರ್ಗದರ್ಶನ, ಪ್ರಯೋಗಾಲಯಗಳು, ಕ್ರೀಡೆ ಮತ್ತು ಸಹಪಠ್ಯ ಅವಕಾಶಗಳು.",
      "Admission information": "ಪ್ರವೇಶ ಮಾಹಿತಿ",
      "Eligibility and documents required.": "ಅರ್ಹತೆ ಮತ್ತು ಅಗತ್ಯ ದಾಖಲೆಗಳು.",
      "Campus visit booking.": "ಕ್ಯಾಂಪಸ್ ಭೇಟಿ ಬುಕ್ಕಿಂಗ್.",
      "Fee enquiry and transport information.": "ಶುಲ್ಕ ವಿಚಾರಣೆ ಮತ್ತು ಸಾರಿಗೆ ಮಾಹಿತಿ.",
      "Kannada, English, and Hindi enquiry support.": "ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಹಿಂದಿ ವಿಚಾರಣೆ ಬೆಂಬಲ.",
      "Schools often lose serious parents when admissions information is scattered across posts, PDFs, and phone calls. A website should make the next step obvious.": "ಪ್ರವೇಶ ಮಾಹಿತಿ ಪೋಸ್ಟ್‌ಗಳು, PDFಗಳು ಮತ್ತು ಫೋನ್ ಕರೆಗಳಲ್ಲಿ ಚದುರಿದರೆ ಗಂಭೀರ ಪೋಷಕರು ದೂರವಾಗಬಹುದು. ವೆಬ್‌ಸೈಟ್ ಮುಂದಿನ ಹಂತವನ್ನು ಸ್ಪಷ್ಟಗೊಳಿಸಬೇಕು.",
      "Parent enquiry flow": "ಪೋಷಕರ ವಿಚಾರಣೆ ಪ್ರಕ್ರಿಯೆ",
      "Make admissions enquiry simple from mobile.": "ಮೊಬೈಲ್‌ನಿಂದ ಪ್ರವೇಶ ವಿಚಾರಣೆಯನ್ನು ಸರಳಗೊಳಿಸಿ.",
      "Discuss school site": "ಶಾಲಾ ಸೈಟ್ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ",
      "Sample site - not a real school": "ಮಾದರಿ ಸೈಟ್ - ನಿಜವಾದ ಶಾಲೆ ಅಲ್ಲ",
      "Coaching centre sample": "ಕೋಚಿಂಗ್ ಸೆಂಟರ್ ಮಾದರಿ",
      "Turn admissions posts into a credible enquiry funnel.": "ಪ್ರವೇಶ ಪೋಸ್ಟ್‌ಗಳನ್ನು ನಂಬಿಕೆಯೋಗ್ಯ ವಿಚಾರಣೆ ಮಾರ್ಗವನ್ನಾಗಿ ಮಾಡಿ.",
      "A sample coaching website showing courses, batches, results, faculty proof, parent trust, and WhatsApp-led admissions.": "ಕೋರ್ಸ್‌ಗಳು, ಬ್ಯಾಚ್‌ಗಳು, ಫಲಿತಾಂಶಗಳು, ಶಿಕ್ಷಕರ ಸಾಕ್ಷ್ಯ, ಪೋಷಕರ ನಂಬಿಕೆ ಮತ್ತು WhatsApp ಆಧಾರಿತ ಪ್ರವೇಶಗಳನ್ನು ತೋರಿಸುವ ಮಾದರಿ ಕೋಚಿಂಗ್ ವೆಬ್‌ಸೈಟ್.",
      "View batches": "ಬ್ಯಾಚ್‌ಗಳು ನೋಡಿ",
      "Ask about admission": "ಪ್ರವೇಶ ಕುರಿತು ಕೇಳಿ",
      "New batches open": "ಹೊಸ ಬ್ಯಾಚ್‌ಗಳು ಆರಂಭ",
      "Class 8-10 foundation, SSLC revision, CBSE support, weekend doubt sessions.": "8-10ನೇ ತರಗತಿ ಫೌಂಡೇಶನ್, SSLC ರಿವಿಷನ್, CBSE ಬೆಂಬಲ, ವೀಕೆಂಡ್ ಸಂಶಯ ನಿವಾರಣೆ.",
      "Courses": "ಕೋರ್ಸ್‌ಗಳು",
      "Course clarity helps parents compare without repeated calls.": "ಕೋರ್ಸ್ ಸ್ಪಷ್ಟತೆ ಪೋಷಕರು ಮರುಮರು ಕರೆ ಮಾಡದೆ ಹೋಲಿಕೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      "Class 8-10 foundation": "8-10ನೇ ತರಗತಿ ಫೌಂಡೇಶನ್",
      "Math, science, English, study discipline, and periodic parent updates.": "ಗಣಿತ, ವಿಜ್ಞಾನ, ಇಂಗ್ಲಿಷ್, ಅಧ್ಯಯನ ಶಿಸ್ತು ಮತ್ತು ನಿಯಮಿತ ಪೋಷಕರ ಅಪ್‌ಡೇಟ್‌ಗಳು.",
      "SSLC revision": "SSLC ರಿವಿಷನ್",
      "Board-focused revision, test practice, performance tracking, and doubt clearing.": "ಬೋರ್ಡ್ ಕೇಂದ್ರೀಕೃತ ರಿವಿಷನ್, ಟೆಸ್ಟ್ ಅಭ್ಯಾಸ, ಪ್ರಗತಿ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸಂಶಯ ನಿವಾರಣೆ.",
      "CBSE support": "CBSE ಬೆಂಬಲ",
      "Concept strengthening, chapter tests, and structured homework support.": "ಕಾನ್ಸೆಪ್ಟ್ ಬಲಪಡಿಸುವಿಕೆ, ಅಧ್ಯಾಯ ಟೆಸ್ಟ್‌ಗಳು ಮತ್ತು ಸಂಘಟಿತ ಹೋಂವರ್ಕ್ ಬೆಂಬಲ.",
      "Proof parents look for": "ಪೋಷಕರು ಹುಡುಕುವ ಸಾಕ್ಷ್ಯ",
      "Batch sizes and timings.": "ಬ್ಯಾಚ್ ಗಾತ್ರ ಮತ್ತು ಸಮಯ.",
      "Faculty background.": "ಶಿಕ್ಷಕರ ಹಿನ್ನೆಲೆ.",
      "Past student outcomes.": "ಹಿಂದಿನ ವಿದ್ಯಾರ್ಥಿಗಳ ಫಲಿತಾಂಶಗಳು.",
      "Location and transport clarity.": "ಸ್ಥಳ ಮತ್ತು ಸಾರಿಗೆ ಸ್ಪಷ್ಟತೆ.",
      "Website role": "ವೆಬ್‌ಸೈಟ್ ಪಾತ್ರ",
      "A coaching centre website should reduce uncertainty and make it easy to enquire about the right batch, not just display posters.": "ಕೋಚಿಂಗ್ ಸೆಂಟರ್ ವೆಬ್‌ಸೈಟ್ ಪೋಸ್ಟರ್‌ಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸದೆ ಸರಿಯಾದ ಬ್ಯಾಚ್ ಬಗ್ಗೆ ವಿಚಾರಿಸಲು ಸುಲಭಗೊಳಿಸಬೇಕು.",
      "Admissions flow": "ಪ್ರವೇಶ ಪ್ರಕ್ರಿಯೆ",
      "Route parent enquiries into call or WhatsApp with course context.": "ಕೋರ್ಸ್ ವಿವರಗಳೊಂದಿಗೆ ಪೋಷಕರ ವಿಚಾರಣೆಗಳನ್ನು ಕಾಲ್ ಅಥವಾ WhatsApp ಗೆ ಮಾರ್ಗಗೊಳಿಸಿ.",
      "Discuss coaching site": "ಕೋಚಿಂಗ್ ಸೈಟ್ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ",
      "Sample site - not a real coaching centre": "ಮಾದರಿ ಸೈಟ್ - ನಿಜವಾದ ಕೋಚಿಂಗ್ ಸೆಂಟರ್ ಅಲ್ಲ",
      "Professional services sample": "ವೃತ್ತಿಪರ ಸೇವೆಗಳ ಮಾದರಿ",
      "A website for service businesses that sell trust before price.": "ಬೆಲೆಯ ಮೊದಲು ನಂಬಿಕೆಯನ್ನು ಮಾರುವ ಸೇವಾ ವ್ಯವಹಾರಗಳ ವೆಬ್‌ಸೈಟ್.",
      "A sample website for consultants, architects, interior designers, CAs, lawyers, and local service firms that need credibility and consultation flow.": "ಕನ್ಸಲ್ಟೆಂಟ್‌ಗಳು, ಆರ್ಕಿಟೆಕ್ಟ್‌ಗಳು, ಇಂಟೀರಿಯರ್ ಡಿಸೈನರ್‌ಗಳು, CAಗಳು, ವಕೀಲರು ಮತ್ತು ಸ್ಥಳೀಯ ಸೇವಾ ಸಂಸ್ಥೆಗಳಿಗೆ ಮಾದರಿ ವೆಬ್‌ಸೈಟ್.",
      "Book consultation": "ಸಲಹೆ ಬುಕ್ ಮಾಡಿ",
      "Consultation-led service website": "ಸಲಹೆ ಆಧಾರಿತ ಸೇವಾ ವೆಬ್‌ಸೈಟ್",
      "Clear services, process, proof, FAQs, and booking path.": "ಸ್ಪಷ್ಟ ಸೇವೆಗಳು, ಪ್ರಕ್ರಿಯೆ, ಸಾಕ್ಷ್ಯ, FAQಗಳು ಮತ್ತು ಬುಕ್ಕಿಂಗ್ ಮಾರ್ಗ.",
      "Make intangible expertise easier to evaluate.": "ಅಮೂರ್ತ ಪರಿಣತಿಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ಸುಲಭಗೊಳಿಸಿ.",
      "Consultation": "ಸಲಹೆ",
      "Explain the problem, scope, constraints, and recommended next steps.": "ಸಮಸ್ಯೆ, ವ್ಯಾಪ್ತಿ, ಮಿತಿಗಳು ಮತ್ತು ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಹಂತಗಳನ್ನು ವಿವರಿಸಿ.",
      "Project planning": "ಪ್ರಾಜೆಕ್ಟ್ ಯೋಜನೆ",
      "Turn vague requirements into milestones, deliverables, and decisions.": "ಅಸ್ಪಷ್ಟ ಅಗತ್ಯಗಳನ್ನು ಮೈಲಿಗಲ್ಲುಗಳು, ಡೆಲಿವರೆಬಲ್‌ಗಳು ಮತ್ತು ನಿರ್ಧಾರಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ.",
      "Execution support": "ಕಾರ್ಯಗತಗೊಳಿಸುವ ಬೆಂಬಲ",
      "Show how the business works, what clients provide, and how outcomes are reviewed.": "ವ್ಯವಹಾರ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ, ಕ್ಲೈಂಟ್ ಏನು ಒದಗಿಸುತ್ತಾರೆ ಮತ್ತು ಫಲಿತಾಂಶಗಳನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ತೋರಿಸಿ.",
      "Trust elements": "ನಂಬಿಕೆ ಅಂಶಗಳು",
      "Founder or team profile.": "ಸ್ಥಾಪಕ ಅಥವಾ ತಂಡದ ಪ್ರೊಫೈಲ್.",
      "Past work categories.": "ಹಿಂದಿನ ಕೆಲಸದ ವರ್ಗಗಳು.",
      "Clear engagement process.": "ಸ್ಪಷ್ಟ ಕಾರ್ಯಪದ್ಧತಿ.",
      "FAQ for pricing and timelines.": "ಬೆಲೆ ಮತ್ತು ವೇಳಾಪಟ್ಟಿ FAQ.",
      "For service businesses, the website should qualify leads, explain fit, and reduce low-quality enquiries before the first call.": "ಸೇವಾ ವ್ಯವಹಾರಗಳಿಗೆ, ವೆಬ್‌ಸೈಟ್ ಮೊದಲ ಕರೆಗೂ ಮುನ್ನ ಸರಿಯಾದ ಗ್ರಾಹಕರನ್ನು ಗುರುತಿಸಿ, ಹೊಂದಾಣಿಕೆಯನ್ನು ವಿವರಿಸಿ, ಕಡಿಮೆ ಗುಣಮಟ್ಟದ ವಿಚಾರಣೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಬೇಕು.",
      "Consultation flow": "ಸಲಹೆ ಪ್ರಕ್ರಿಯೆ",
      "Convert vague interest into a structured first conversation.": "ಅಸ್ಪಷ್ಟ ಆಸಕ್ತಿಯನ್ನು ಸಂಘಟಿತ ಮೊದಲ ಮಾತುಕತೆಯಾಗಿ ಪರಿವರ್ತಿಸಿ.",
      "Discuss service site": "ಸೇವಾ ಸೈಟ್ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ",
      "Sample site - not a real business": "ಮಾದರಿ ಸೈಟ್ - ನಿಜವಾದ ವ್ಯವಹಾರ ಅಲ್ಲ",
      "Language": "ಭಾಷೆ",
      "Demo translations. Final client sites should use reviewed business-approved copy.": "ಮಾದರಿ ಅನುವಾದಗಳು. ಅಂತಿಮ ಕ್ಲೈಂಟ್ ಸೈಟ್‌ಗಳಲ್ಲಿ ವ್ಯವಹಾರ ಅನುಮೋದಿತ ಪ್ರತಿಯನ್ನು ಬಳಸಬೇಕು."
    },
    hi: {},
    ta: {},
    te: {},
    ml: {}
  };

  const quick = {
    hi: {
      "Language": "भाषा",
      "Demo translations. Final client sites should use reviewed business-approved copy.": "डेमो अनुवाद। अंतिम क्लाइंट साइटों में समीक्षा की गई और व्यवसाय द्वारा स्वीकृत कॉपी का उपयोग होना चाहिए.",
      "Sample clinic website - fictional business for demonstration": "नमूना क्लिनिक वेबसाइट - प्रदर्शन के लिए काल्पनिक व्यवसाय",
      "Sample school website - fictional institution for demonstration": "नमूना स्कूल वेबसाइट - प्रदर्शन के लिए काल्पनिक संस्था",
      "Sample coaching centre website - fictional business for demonstration": "नमूना कोचिंग सेंटर वेबसाइट - प्रदर्शन के लिए काल्पनिक व्यवसाय",
      "Sample service business website - fictional business for demonstration": "नमूना सेवा व्यवसाय वेबसाइट - प्रदर्शन के लिए काल्पनिक व्यवसाय",
      "Call or WhatsApp": "कॉल या WhatsApp",
      "View services": "सेवाएं देखें",
      "Services": "सेवाएं",
      "Book appointment": "अपॉइंटमेंट बुक करें",
      "Admissions open": "प्रवेश खुले हैं",
      "View programs": "कार्यक्रम देखें",
      "Enquire now": "अभी पूछताछ करें",
      "View batches": "बैच देखें",
      "Ask about admission": "प्रवेश के बारे में पूछें",
      "Courses": "कोर्स",
      "Book consultation": "परामर्श बुक करें",
      "Discuss clinic site": "क्लिनिक साइट पर चर्चा करें",
      "Discuss school site": "स्कूल साइट पर चर्चा करें",
      "Discuss coaching site": "कोचिंग साइट पर चर्चा करें",
      "Discuss service site": "सेवा साइट पर चर्चा करें"
    },
    ta: {
      "Language": "மொழி",
      "Demo translations. Final client sites should use reviewed business-approved copy.": "டெமோ மொழிபெயர்ப்புகள். இறுதி வாடிக்கையாளர் தளங்களில் சரிபார்க்கப்பட்ட வணிக அங்கீகாரம் பெற்ற உரை பயன்படுத்த வேண்டும்.",
      "Sample clinic website - fictional business for demonstration": "மாதிரி கிளினிக் இணையதளம் - விளக்கத்திற்கான கற்பனை வணிகம்",
      "Sample school website - fictional institution for demonstration": "மாதிரி பள்ளி இணையதளம் - விளக்கத்திற்கான கற்பனை நிறுவனம்",
      "Sample coaching centre website - fictional business for demonstration": "மாதிரி பயிற்சி மைய இணையதளம் - விளக்கத்திற்கான கற்பனை வணிகம்",
      "Sample service business website - fictional business for demonstration": "மாதிரி சேவை வணிக இணையதளம் - விளக்கத்திற்கான கற்பனை வணிகம்",
      "Call or WhatsApp": "அழைப்பு அல்லது WhatsApp",
      "View services": "சேவைகள் பார்க்க",
      "Services": "சேவைகள்",
      "Book appointment": "நேரம் பதிவு செய்க",
      "Admissions open": "சேர்க்கைகள் திறந்துள்ளன",
      "View programs": "நிகழ்ச்சிகள் பார்க்க",
      "Enquire now": "இப்போது விசாரிக்கவும்",
      "View batches": "பேட்ச்கள் பார்க்க",
      "Ask about admission": "சேர்க்கை பற்றி கேளுங்கள்",
      "Courses": "பாடநெறிகள்",
      "Book consultation": "ஆலோசனை பதிவு செய்க",
      "Discuss clinic site": "கிளினிக் தளம் பற்றி பேசுங்கள்",
      "Discuss school site": "பள்ளி தளம் பற்றி பேசுங்கள்",
      "Discuss coaching site": "கோச்சிங் தளம் பற்றி பேசுங்கள்",
      "Discuss service site": "சேவை தளம் பற்றி பேசுங்கள்"
    },
    te: {
      "Language": "భాష",
      "Demo translations. Final client sites should use reviewed business-approved copy.": "డెమో అనువాదాలు. తుది క్లయింట్ సైట్లలో సమీక్షించిన వ్యాపార-ఆమోదిత కాపీ వాడాలి.",
      "Sample clinic website - fictional business for demonstration": "నమూనా క్లినిక్ వెబ్‌సైట్ - ప్రదర్శన కోసం కల్పిత వ్యాపారం",
      "Sample school website - fictional institution for demonstration": "నమూనా స్కూల్ వెబ్‌సైట్ - ప్రదర్శన కోసం కల్పిత సంస్థ",
      "Sample coaching centre website - fictional business for demonstration": "నమూనా కోచింగ్ సెంటర్ వెబ్‌సైట్ - ప్రదర్శన కోసం కల్పిత వ్యాపారం",
      "Sample service business website - fictional business for demonstration": "నమూనా సేవా వ్యాపార వెబ్‌సైట్ - ప్రదర్శన కోసం కల్పిత వ్యాపారం",
      "Call or WhatsApp": "కాల్ లేదా WhatsApp",
      "View services": "సేవలు చూడండి",
      "Services": "సేవలు",
      "Book appointment": "అపాయింట్‌మెంట్ బుక్ చేయండి",
      "Admissions open": "అడ్మిషన్లు ప్రారంభం",
      "View programs": "ప్రోగ్రామ్‌లు చూడండి",
      "Enquire now": "ఇప్పుడే విచారించండి",
      "View batches": "బ్యాచ్‌లు చూడండి",
      "Ask about admission": "అడ్మిషన్ గురించి అడగండి",
      "Courses": "కోర్సులు",
      "Book consultation": "కన్సల్టేషన్ బుక్ చేయండి",
      "Discuss clinic site": "క్లినిక్ సైట్ గురించి చర్చించండి",
      "Discuss school site": "స్కూల్ సైట్ గురించి చర్చించండి",
      "Discuss coaching site": "కోచింగ్ సైట్ గురించి చర్చించండి",
      "Discuss service site": "సేవా సైట్ గురించి చర్చించండి"
    },
    ml: {
      "Language": "ഭാഷ",
      "Demo translations. Final client sites should use reviewed business-approved copy.": "ഡെമോ വിവർത്തനങ്ങൾ. അന്തിമ ക്ലയന്റ് സൈറ്റുകൾ പരിശോധിച്ചും ബിസിനസ് അംഗീകരിച്ചും ഉള്ള കോപ്പി ഉപയോഗിക്കണം.",
      "Sample clinic website - fictional business for demonstration": "സാമ്പിൾ ക്ലിനിക് വെബ്സൈറ്റ് - പ്രദർശനത്തിനായുള്ള സാങ്കൽപ്പിക ബിസിനസ്",
      "Sample school website - fictional institution for demonstration": "സാമ്പിൾ സ്കൂൾ വെബ്സൈറ്റ് - പ്രദർശനത്തിനായുള്ള സാങ്കൽപ്പിക സ്ഥാപനം",
      "Sample coaching centre website - fictional business for demonstration": "സാമ്പിൾ കോച്ചിംഗ് സെന്റർ വെബ്സൈറ്റ് - പ്രദർശനത്തിനായുള്ള സാങ്കൽപ്പിക ബിസിനസ്",
      "Sample service business website - fictional business for demonstration": "സാമ്പിൾ സേവന ബിസിനസ് വെബ്സൈറ്റ് - പ്രദർശനത്തിനായുള്ള സാങ്കൽപ്പിക ബിസിനസ്",
      "Call or WhatsApp": "വിളിക്കുക അല്ലെങ്കിൽ WhatsApp",
      "View services": "സേവനങ്ങൾ കാണുക",
      "Services": "സേവനങ്ങൾ",
      "Book appointment": "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
      "Admissions open": "അഡ്മിഷൻ ആരംഭിച്ചു",
      "View programs": "പ്രോഗ്രാമുകൾ കാണുക",
      "Enquire now": "ഇപ്പോൾ അന്വേഷിക്കുക",
      "View batches": "ബാച്ചുകൾ കാണുക",
      "Ask about admission": "അഡ്മിഷൻ ചോദിക്കുക",
      "Courses": "കോഴ്സുകൾ",
      "Book consultation": "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക",
      "Discuss clinic site": "ക്ലിനിക് സൈറ്റ് ചർച്ച ചെയ്യുക",
      "Discuss school site": "സ്കൂൾ സൈറ്റ് ചർച്ച ചെയ്യുക",
      "Discuss coaching site": "കോച്ചിംഗ് സൈറ്റ് ചർച്ച ചെയ്യുക",
      "Discuss service site": "സേവന സൈറ്റ് ചർച്ച ചെയ്യുക"
    }
  };

  Object.assign(translations.hi, quick.hi);
  Object.assign(translations.ta, quick.ta);
  Object.assign(translations.te, quick.te);
  Object.assign(translations.ml, quick.ml);

  const originalTexts = new Map();

  function textNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && ["SCRIPT", "STYLE", "OPTION"].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang === "en" ? "en" : lang;
    textNodes(document.body).forEach((node) => {
      if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
      const original = originalTexts.get(node);
      const key = original.trim();
      const translated = lang === "en" ? key : translations[lang][key];
      if (!translated) {
        node.nodeValue = original;
        return;
      }
      node.nodeValue = original.replace(key, translated);
    });
    localStorage.setItem("sortedqueueSampleLanguage", lang);
  }

  function addToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "language-tools";
    toolbar.innerHTML = `
      <div class="shell">
        <label for="sampleLanguage">Language</label>
        <select id="sampleLanguage" aria-label="Language">
          ${Object.entries(languages).map(([code, label]) => `<option value="${code}">${label}</option>`).join("")}
        </select>
        <span class="language-note">Demo translations. Final client sites should use reviewed business-approved copy.</span>
      </div>
    `;
    const ribbon = document.querySelector(".sample-ribbon");
    ribbon.insertAdjacentElement("afterend", toolbar);
    const select = toolbar.querySelector("select");
    const saved = localStorage.getItem("sortedqueueSampleLanguage") || "en";
    select.value = languages[saved] ? saved : "en";
    select.addEventListener("change", () => applyLanguage(select.value));
    applyLanguage(select.value);
  }

  document.addEventListener("DOMContentLoaded", addToolbar);
})();
