"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
	Megaphone,
	Car,
	Plane,
	IdCard,
	ShieldCheck,
	CalendarCheck,
} from "lucide-react";
import HudumaLogo from "@/app/_components/HudumaLogo";
import { PrimaryLink } from "@/app/_components/ui";
import { usePhone } from "@/app/_lib/usePhone";

const TICKER_ITEMS: React.ReactNode[] = [
	<>Customer Satisfaction: 86.40%</>,
	<>
		Did you know? Huduma Kenya offers free tele-counselling with licensed
		counsellors. Call{" "}
		<a href="tel:1919" className="font-semibold underline underline-offset-2">
			1919
		</a>{" "}
		or visit{" "}
		<a
			href="https://www.hudumakenya.go.ke"
			target="_blank"
			rel="noopener noreferrer"
			className="font-semibold underline underline-offset-2"
		>
			www.hudumakenya.go.ke
		</a>{" "}
		for details.
	</>,
	<>
		Daily Stats: Huduma Centres: 60 · Total Bookings Today, Thursday, 9th
		July 2026: 10,592 · Last Week Bookings: 207,223 · Total Bookings Since
		Inception: 25,277,550 · Customer Satisfaction: 86.40%
	</>,
];

type Slide = {
	tag?: string;
	title: string;
	desc: string;
	icon: React.ElementType;
	from: string;
	to: string;
};

const SLIDES: Slide[] = [
	{
		tag: "NEW",
		title: "NTSA Smart Driving Licence",
		desc: "Renew or upgrade to a smart DL with biometric capture at your nearest centre.",
		icon: Car,
		from: "#0b8a3e",
		to: "#0f766e",
	},
	{
		title: "Passport Services",
		desc: "Apply for or renew your passport — one visit, no middlemen.",
		icon: Plane,
		from: "#1746e0",
		to: "#0ea5e9",
	},
	{
		title: "National ID Card",
		desc: "Apply, replace or collect your National ID card.",
		icon: IdCard,
		from: "#d6281f",
		to: "#b0161c",
	},
	{
		title: "Certificate of Good Conduct",
		desc: "Get your police clearance certificate from the DCI desk.",
		icon: ShieldCheck,
		from: "#10224e",
		to: "#1e3a8a",
	},
];

function Carousel() {
	const [index, setIndex] = useState(0);
	const touchX = useRef<number | null>(null);
	const count = SLIDES.length;

	useEffect(() => {
		const t = setInterval(() => setIndex(i => (i + 1) % count), 4500);
		return () => clearInterval(t);
	}, [count]);

	function onTouchStart(e: React.TouchEvent) {
		touchX.current = e.touches[0].clientX;
	}
	function onTouchEnd(e: React.TouchEvent) {
		if (touchX.current === null) return;
		const dx = e.changedTouches[0].clientX - touchX.current;
		if (Math.abs(dx) > 40) {
			setIndex(i =>
				dx < 0 ? (i + 1) % count : (i - 1 + count) % count,
			);
		}
		touchX.current = null;
	}

	return (
		<div>
			<div
				className="overflow-hidden rounded-2xl"
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
			>
				<div
					className="flex transition-transform duration-500 ease-out"
					style={{ transform: `translateX(-${index * 100}%)` }}
				>
					{SLIDES.map(slide => {
						const Icon = slide.icon;
						return (
							<div key={slide.title} className="w-full shrink-0">
								<div
									className="relative flex min-h-[168px] flex-col justify-between overflow-hidden p-5 text-white"
									style={{
										backgroundImage: `linear-gradient(135deg, ${slide.from}, ${slide.to})`,
									}}
								>
									<div
										className="animate-floaty absolute -top-6 -right-6 opacity-20"
										aria-hidden
									>
										<Icon className="h-32 w-32" />
									</div>
									<div className="relative flex items-center gap-2">
										<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
											<Icon className="h-5 w-5" />
										</span>
										{slide.tag && (
											<span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
												{slide.tag}
											</span>
										)}
									</div>
									<div className="relative">
										<h3 className="text-lg font-semibold leading-tight">
											{slide.title}
										</h3>
										<p className="mt-1 text-sm text-white/90">
											{slide.desc}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="mt-3 flex justify-center gap-1.5">
				{SLIDES.map((_, i) => (
					<button
						key={i}
						aria-label={`Go to slide ${i + 1}`}
						onClick={() => setIndex(i)}
						className={`h-1.5 rounded-full transition-all ${
							i === index ? "w-5 bg-hgreen" : "w-1.5 bg-line"
						}`}
					/>
				))}
			</div>
		</div>
	);
}

export default function HomePage() {
	const phone = usePhone();
	const phoneQ = phone ? `?phone=${encodeURIComponent(phone)}` : "";
	const bookHref = `/book${phoneQ}`;

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white pb-8">
			<header className="px-5 pt-4">
				<HudumaLogo />
			</header>

			<div className="ticker-pause mt-4 overflow-hidden bg-hred py-2 text-white">
				<div className="flex items-center">
					<span className="ml-3 mr-2 flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase">
						<Megaphone className="h-3 w-3" />
						Updates
					</span>
					<div className="relative flex-1 overflow-hidden">
						<div className="animate-ticker flex w-max gap-10 whitespace-nowrap text-xs font-medium">
							{[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
								<span key={i}>{t}</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<section className="flex justify-center px-6 py-6">
				<Image
					src="/huduma.jpeg"
					alt="Huduma Kenya — Service Excellence"
					width={462}
					height={560}
					priority
					className="h-auto w-full max-w-[260px] object-contain"
				/>
			</section>

			<section className="px-5">
				<h1 className="text-center text-2xl font-semibold text-navy">
					Book Appointment
				</h1>
				<p className="mt-2 text-center text-sm text-muted">
					All government services in one place. Book your visit and
					skip the queue.
				</p>
				<PrimaryLink href={bookHref} className="mt-5 gap-2">
					<CalendarCheck className="h-5 w-5" />
					Book an Appointment
				</PrimaryLink>
			</section>

			<section className="mt-8 px-5">
				<h2 className="mb-3 text-sm font-semibold text-navy">
					Featured services
				</h2>
				<Carousel />
			</section>
		</div>
	);
}
