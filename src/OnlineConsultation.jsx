import React, { useMemo, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Lottie from "lottie-react";
import paymentQR from './assets/images/payment-qr.jpeg';
import { getAllDoctors, bookConsultation, getImageUrl } from './api';

// 30-min slots between 9–5
const generateTimeSlots = () => {
	const slots = [];
	const start = 9 * 60;
	const end = 17 * 60;
	for (let t = start; t < end; t += 30) {
		const h = Math.floor(t / 60);
		const m = t % 60;
		const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
		slots.push(time);
	}
	return slots;
};
const timeSlots = generateTimeSlots();

// Helper: format date nicely
const formatDayLabel = (date) =>
	date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

// Helper: check weekends
const isWeekend = (date) => {
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const day = d.getDay();
	return day === 0 || day === 6;
};

// Main component
export default function OnlineConsultation() {
	const [doctors, setDoctors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const response = await getAllDoctors();
				if (response.success) {
					setDoctors(response.doctors);
				} else {
					setError(response.message || 'Failed to fetch doctors');
				}
			} catch (err) {
				setError('Failed to fetch doctors');
			} finally {
				setLoading(false);
			}
		};
		fetchDoctors();
	}, []);

	// UI / filters / search
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSpecializations, setActiveSpecializations] = useState(new Set());
	const specializations = useMemo(
		() => Array.from(new Set(doctors.map((d) => d.specialization))),
		[doctors]
	);

	// Booking modal states
	const [showBooking, setShowBooking] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [selectedDateISO, setSelectedDateISO] = useState(""); // "YYYY-MM-DD"
	const [selectedTime, setSelectedTime] = useState("");
	const [userEmail, setUserEmail] = useState("");

	// Payment states
	const [showPayment, setShowPayment] = useState(false);
	const [paymentComplete, setPaymentComplete] = useState(false);

	// Derived filtered doctors (search + pill filters)
	const filteredDoctors = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return doctors.filter((d) => {
            // specializations filter (if none selected -> allow all)
            if (activeSpecializations.size > 0 && !activeSpecializations.has(d.specialization)) {
                return false;
            }
            if (!q) return true;
            return (
                d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                d.location.toLowerCase().includes(q)
            );
        });
    }, [searchQuery, activeSpecializations, doctors]);

	// Mini calendar: next N days to choose from (14 days)
	const nextDates = useMemo(() => {
		const arr = [];
		const now = new Date();
		for (let i = 0; i < 14; i++) {
			const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
			arr.push(d);
		}
		return arr;
	}, []);

	// Slot enabled check (disable past times for today)
	const isSlotDisabled = (dateISO, time) => {
		// weekends disabled
		const [y, m, d] = dateISO.split("-").map(Number);
		const dt = new Date(y, m - 1, d);
		if (isWeekend(dt)) return true;

		// if date is today, disable past times
		const todayISO = new Date().toISOString().split("T")[0];
		if (dateISO === todayISO) {
			const [h, min] = time.split(":").map(Number);
			const slotDate = new Date();
			slotDate.setHours(h, min, 0, 0);
			return slotDate.getTime() <= Date.now(); // disable <= now
		}
		return false;
	};

	// UI actions
	const toggleSpec = (spec) => {
		const s = new Set(activeSpecializations);
		if (s.has(spec)) s.delete(spec);
		else s.add(spec);
		setActiveSpecializations(s);
	};

	const openBookingFor = (doctor) => {
		setSelectedDoctor(doctor);
		setShowBooking(true);
		setSelectedDateISO(""); // reset selection
		setSelectedTime("");
		setUserEmail("");
	};

	const closeBooking = () => {
		setShowBooking(false);
		setSelectedDoctor(null);
		setSelectedDateISO("");
		setSelectedTime("");
		setUserEmail("");
	};

	// Separate the calendar redirect logic
	const handleCalendarRedirect = () => {
		const [hour, minute] = selectedTime.split(":").map(Number);
		const start = new Date(selectedDateISO);
		start.setHours(hour, minute, 0, 0);
		const end = new Date(start.getTime() + 30 * 60000);

		const formatDate = (date) =>
			date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

		const startStr = formatDate(start);
		const endStr = formatDate(end);

		const url =
			`https://calendar.google.com/calendar/render?action=TEMPLATE` +
			`&text=${encodeURIComponent(`Consultation with ${selectedDoctor.name}`)}` +
			`&details=${encodeURIComponent(
				`Online Ayurvedic consultation via Google Meet.\nDoctor: ${selectedDoctor.name}\nSpecialization: ${selectedDoctor.specialization}`
			)}` +
			`&dates=${startStr}/${endStr}` +
			`&add=${selectedDoctor.email},${userEmail}` +
			`&location=${encodeURIComponent("Google Meet")}`;
			
		window.open(url, "_blank");
		closeBooking();
	};

	// Update the handleConfirmBooking function
	const handleConfirmBooking = () => {
		if (!selectedDateISO || !selectedTime || !userEmail || !selectedDoctor) {
			alert("Please select date, time and enter your email before confirming.");
			return;
		}
		setShowPayment(true);
	};

	const PaymentSection = () => (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<img
							src={getImageUrl(selectedDoctor.avatar)}
							alt={selectedDoctor.name}
							className="w-12 h-12 rounded-full border-2 border-gray-200"
						/>
						<div>
							<h3 className="text-xl font-bold text-gray-800">Pay to {selectedDoctor.name}</h3>
							<p className="text-sm text-gray-500">Consultation Fee</p>
						</div>
					</div>
					<div className="text-2xl font-bold text-[#1F4F2B]">₹500</div>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Left: Payment Details */}
					<div className="space-y-4">
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-gray-600 mb-1">Bank Account</p>
							<p className="font-medium">Ayush Healthcare Bank</p>
						</div>

						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-gray-600 mb-1">UPI ID</p>
							<p className="font-medium">ayush.healthcare@upi</p>
						</div>

						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-gray-600 mb-1">Appointment Details</p>
							<p className="font-medium">{selectedDateISO} at {selectedTime}</p>
							<p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
						</div>
					</div>

					{/* Right: QR Code */}
					<div className="flex flex-col items-center justify-center">
						<div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-100">
							<img 
								src={paymentQR}
								alt="Payment QR Code"
								className="w-48 h-48 object-contain"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3EPayment QR Code%3C/text%3E%3C/svg%3E";
								}}
							/>
						</div>
						<p className="mt-4 text-sm text-gray-600">Scan with any UPI app</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-8 flex gap-4">
					<button
						onClick={async () => {
							// First book the consultation
							const bookingData = {
								doctorId: selectedDoctor._id,
								doctorName: selectedDoctor.name,
								specialization: selectedDoctor.specialization,
								date: selectedDateISO,
								time: selectedTime,
							};
							const bookingResponse = await bookConsultation(bookingData);
							if (bookingResponse.success) {
								setPaymentComplete(true);
								setShowPayment(false);
								handleCalendarRedirect();
							} else {
								alert("Failed to book consultation: " + bookingResponse.message);
							}
						}}
						className="flex-1 px-6 py-3 rounded-lg bg-[#2F6B3A] text-white font-semibold
							hover:bg-[#245a33] transition duration-300"
					>
						Payment Complete
					</button>
					<button
						onClick={() => setShowPayment(false)}
						className="px-6 py-3 rounded-lg bg-white border border-gray-200
							text-gray-700 hover:bg-gray-50 transition duration-300"
					>
						Cancel
					</button>
				</div>

				<p className="mt-4 text-center text-xs text-gray-500">
					Please ensure payment is completed before clicking "Payment Complete"
				</p>
			</div>
		</div>
	);

	// Small UI helpers for styling
	const greenBg = "bg-gradient-to-r from-[#DFF3E0] to-[#CFE9D4]";
	const accent = "text-[#2F6B3A]";

	return (
		<div className="font-sans text-gray-900">
			<Navbar />

			{/* Hero */}
			<section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-primary/20 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-24">
				{/* Video background */}
				<video
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					className="absolute inset-0 w-full h-full object-cover z-0"
				>
					<source src="/videos/online.mp4" type="video/mp4" />
				</video>

				<div 
					className="absolute inset-0 bg-black/40 z-0 backdrop-blur-[1px]"
					style={{ 
						mixBlendMode: 'multiply',
						backdropFilter: 'brightness(0.7) contrast(1.1)'
					}}
				></div>

				{/* Content */}
				<div className="z-10 px-4">
					<h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white">
						Consult Ayush Practitioners
					</h1>
					<p className="text-lg md:text-2xl mb-6 text-white">
						Choose a trusted practitioner, pick a weekday slot and get a Google Meet link.
					</p>
				</div>

			</section>

			{/* Main Content Area with Sidebar */}
			<div className="py-10">
				<div className="flex flex-col md:flex-row">
					{/* Left Sidebar - increased width */}
					<div className="md:w-80 flex-shrink-0 px-6">
						{/* Search Bar */}
						<div className="mb-6">
							<input
								type="search"
								placeholder="Search doctors..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full p-3 rounded-xl shadow-sm border border-[#d6ecd6] focus:outline-none focus:ring-2 focus:ring-[#bde0b0]"
								aria-label="Search doctors"
							/>
						</div>

						{/* Filters */}
						<div className="bg-white rounded-xl p-6 shadow-sm border border-[#d6ecd6] w-full">
							<h3 className="text-lg font-semibold text-[#2F6B3A] mb-4">Specializations</h3>
							<div className="space-y-2">
								{specializations.map((spec) => {
									const active = activeSpecializations.has(spec);
									return (
										<label key={spec} className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={active}
												onChange={() => toggleSpec(spec)}
												className="w-4 h-4 rounded text-[#2F6B3A] focus:ring-[#2F6B3A]"
											/>
											<span className="text-sm text-gray-700">{spec}</span>
										</label>
									);
								})}
							</div>
							{activeSpecializations.size > 0 && (
								<button
									onClick={() => setActiveSpecializations(new Set())}
									className="mt-4 w-full px-3 py-2 rounded-lg text-sm text-[#2F6B3A] bg-white border border-[#d6ecd6] hover:bg-[#f1fbf1]"
								>
									Clear Filters
								</button>
							)}
						</div>
					</div>

					{/* Right Content Area - modified grid */}
					<div className="flex-1 px-6">
						<h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#234b2a]">
							Available Practitioners
						</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
							{loading ? (
								<div className="col-span-full text-center text-gray-500 py-12">
									Loading doctors...
								</div>
							) : filteredDoctors.length === 0 ? (
								<div className="col-span-full text-center text-gray-500 py-12">
									No doctors found — try adjusting your filters or search.
								</div>
							) : (
								filteredDoctors.map((doc) => (
								<div
									key={doc.email}
									className="relative backdrop-blu	r-md bg-white/30 rounded-2xl p-6 
									shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
									border border-white/20
									flex flex-col items-center text-center 
									hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] 
									hover:backdrop-blur-lg
									transition-all duration-300
									group"
								>
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 opacity-50"></div>
									
									<div className="relative z-10 flex flex-col items-center">
									{/* Profile Image centered */}
									<img
										src={getImageUrl(doc.avatar)}
										alt={doc.name}
										className="w-24 h-24 rounded-full border-4 border-white/50 object-cover mb-4"
									/>

									{/* Doctor Info */}
									<h3 className="text-xl font-semibold mb-1 text-[#1F4F2B]">{doc.name}</h3>
									<div className="text-sm text-[#2F6B3A]/90 font-medium mb-2">{doc.specialization}</div>
									<p className="text-gray-700/90 text-sm mb-4">{doc.experience} yrs • {doc.location}</p>
									<div className="flex items-center justify-center gap-3 mb-4">
										<div className="text-yellow-500 font-semibold">⭐ {doc.rating}</div>
									</div>

									{/* Book Consultation button centered below info */}
									<button
										onClick={() => openBookingFor(doc)}
										className="px-6 py-2 rounded-full bg-[#2F6B3A]/90 text-white 
										hover:bg-[#245a33] transition-colors duration-300"
									>
										Book Consultation
									</button>
									</div>
								</div>
								)))}
						</div>
					</div>
				</div>
			</div>

			{/* Booking Modal */}
			{showBooking && selectedDoctor && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<img src={selectedDoctor.avatar} alt="" className="w-16 h-16 rounded-full border-2" />
								<div>
									<h3 className="text-xl font-bold" style={{ color: "#1F4F2B" }}>{selectedDoctor.name}</h3>
									<div className="text-sm text-gray-600">{selectedDoctor.specialization}</div>
								</div>
							</div>

							<button onClick={closeBooking} className="text-gray-500 hover:text-gray-700">✕</button>
						</div>

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
							{/* Left: date grid */}
							<div className="overflow-x-auto">
								<div className="text-sm font-semibold mb-3 text-[#2F6B3A]">Choose Date (next 14 days)</div>
								<div className="grid grid-cols-7 gap-3">
									{nextDates.map((d) => {
										const iso = d.toLocaleDateString("en-CA"); // ✅ stays in local timezone (IST)
										const disabled = isWeekend(d) || new Date(iso) < new Date(new Date().toDateString());
										const selected = iso === selectedDateISO;
										const future = d > new Date(new Date().toDateString());
										return (
											<button
												key={iso}
												onClick={() => {
													if (disabled) return;
													setSelectedDateISO(iso);
													setSelectedTime("");
												}}
												className={`p-3 rounded-md text-center transition min-w-[65px] min-h-[65px] flex flex-col items-center justify-center ${
													disabled
														? "bg-gray-100 text-gray-400 cursor-not-allowed"
														: selected
														? "bg-[#2F6B3A] text-white"
														: future
														? "bg-[#EAF8EE] text-[#1F4F2B] hover:bg-[#d7f0d6]"
														: "bg-white text-[#1F4F2B] hover:bg-[#f4fff4]"
												}`}
												title={formatDayLabel(d)}
											>
												<div className="font-medium text-sm whitespace-nowrap">
													{d.toLocaleDateString(undefined, { weekday: "short" })}
												</div>
												<div className="text-xs mt-2">{d.getDate()}</div>
											</button>
										);
									})}
								</div>

								<div className="mt-4 text-xs text-gray-600 flex gap-4">
									<span>• Weekends disabled</span>
									<span>• Past dates disabled</span>
									<span>• Future days highlighted</span>
								</div>
							</div>

							{/* Right: time slots & email */}
							<div className="space-y-6">
								<div>
									<div className="text-sm font-semibold mb-2 text-[#2F6B3A]">
										Choose Time (30 min slots — 09:00 to 16:30)
									</div>

									{!selectedDateISO && (
										<div className="text-sm text-gray-500 mb-3">Select a date to see available slots.</div>
									)}

									{selectedDateISO && (
										<div className="flex flex-wrap gap-2 mb-4">
											{timeSlots.map((ts) => {
												const disabled = isSlotDisabled(selectedDateISO, ts);
												const active = selectedTime === ts;
												return (
													<button
														key={ts}
														onClick={() => {
															if (disabled) return;
															setSelectedTime(ts);
														}}
														className={`px-3 py-2 rounded-full text-sm transition ${
															disabled
																? "bg-gray-100 text-gray-400 cursor-not-allowed"
																: active
																? "bg-[#2F6B3A] text-white"
																: "bg-white border border-[#e6f2e6] text-[#1F4F2B] hover:bg-[#eaf8ee]"
														}`}
													>
														{ts}
													</button>
												);
											})}
										</div>
									)}

									<label className="block text-sm font-semibold text-[#2F6B3A]">Your Email</label>
									<input
										type="email"
										value={userEmail}
										onChange={(e) => setUserEmail(e.target.value)}
										placeholder="you@example.com"
										className="w-full p-3 rounded-lg border border-[#e6f2e6] mb-4 focus:outline-none focus:ring-2 focus:ring-[#bde0b0]"
									/>

									<div className="flex gap-3">
										<button
											onClick={handleConfirmBooking}
											className="flex-1 px-4 py-3 rounded-lg bg-[#2F6B3A] text-white font-semibold hover:bg-[#245a33] transition"
										>
											Confirm & Open Google Calendar
										</button>
										<button onClick={closeBooking} className="px-4 py-3 rounded-lg bg-white border border-[#e6f2e6]">
											Cancel
										</button>
									</div>

									<div className="mt-3 text-xs text-gray-500">
										Note: Only weekdays are available. Past times today are disabled. Calendar link will open in a new tab for final confirmation and Meet link generation.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Payment Section - new component for payments */}
			{showPayment && (
				<PaymentSection />
			)}

			{/* Footer CTA */}
			<section className="py-12 px-6 md:px-20 bg-[#F6FBF6] mt-8">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-xl font-semibold text-[#234b2a] mb-2">Need help picking a slot?</h3>
					</div>
			</section>
		</div>
	);
}