import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { 
	AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
	XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
	Headphones, Cloud, Mail, Folder, User, Briefcase, Award, Send,
	Linkedin, Server, Shield, Code, CheckCircle, Menu, X,
	Sun, Moon, Phone, Globe, Wifi,
	Activity, TrendingUp, MousePointer
} from "lucide-react";
import "./App.css";

const skillData = [
	{ name: "Microsoft 365", value: 95, color: "#0078d4" },
	{ name: "Azure AD/Entra", value: 92, color: "#0078d4" },
	{ name: "Azure Cloud", value: 90, color: "#0078d4" },
	{ name: "Intune/MEM", value: 92, color: "#0078d4" },
	{ name: "Active Directory", value: 90, color: "#0078d4" },
	{ name: "PowerShell/Bash", value: 88, color: "#0078d4" },
	{ name: "Networking", value: 85, color: "#0078d4" },
	{ name: "Endpoint Security", value: 87, color: "#0078d4" },
];

const experienceData = [
	{ year: "2016", projects: 15, clients: 8 },
	{ year: "2017", projects: 25, clients: 12 },
	{ year: "2018", projects: 40, clients: 18 },
	{ year: "2019", projects: 60, clients: 25 },
	{ year: "2020", projects: 75, clients: 30 },
	{ year: "2021", projects: 90, clients: 40 },
	{ year: "2022", projects: 100, clients: 45 },
	{ year: "2023", projects: 110, clients: 50 },
	{ year: "2024", projects: 120, clients: 55 },
];

const technologyDistribution = [
	{ name: "Microsoft 365", value: 35, color: "#0078d4" },
	{ name: "Azure", value: 25, color: "#00809F" },
	{ name: "Intune", value: 20, color: "#00b7c3" },
	{ name: "Security", value: 15, color: "#8764B8" },
	{ name: "Other", value: 5, color: "#323130" },
];

const jobHistory = [
	{
		company: "Logics Technology",
		role: "Tier 2 IT Support Engineer",
		duration: "Feb 2026 – Apr 2026",
		highlights: ["Automated workflows", "Copilot integration", "Contract extension"]
	},
	{
		company: "US-based CPA Firm",
		role: "Lead Technology Consultant",
		duration: "Aug 2024 – Feb 2025",
		highlights: ["20+ user M365 migration", "Azure VM ZTNA", "40% Teams efficiency"]
	},
	{
		company: "Microsoft",
		role: "Customer Service Ambassador",
		duration: "Mar 2023 – Jul 2024",
		highlights: ["5-star rating", "85% bonus targets", "MacOS specialist"]
	},
	{
		company: "Support Adventure Ltd",
		role: "IT Support Engineer",
		duration: "Apr 2021 – Dec 2022",
		highlights: ["30+ digital projects", "11+ tickets daily", "Exec training"]
	},
	{
		company: "CloudScale365",
		role: "Technical Support Engineer",
		duration: "2018 – 2021",
		highlights: ["100+ tickets weekly", "100+ projects delivered", "Solutions Architect"]
	},
	{
		company: "Nerospec Group",
		role: "Junior IT Manager",
		duration: "Sep 2017 – Jul 2018",
		highlights: ["Hybrid AD migration", "Teams deployment", "Multi-office support"]
	},
];

const certifications = [
	{ name: "SC-300", issuer: "Microsoft", year: "2022" },
	{ name: "MS-900", issuer: "Microsoft", year: "2024" },
	{ name: "MCSA 70-697", issuer: "Microsoft", year: "2017" },
	{ name: "CompTIA A+", issuer: "CompTIA", year: "2016" },
];

const skills = [
	{ name: "Microsoft 365", icon: <Cloud size={24} />, description: "Exchange, Teams, SharePoint, OneDrive, Intune", level: 95 },
	{ name: "Azure AD/Entra", icon: <Shield size={24} />, description: "Conditional Access, MFA, SSO, Identity Protection", level: 92 },
	{ name: "Azure Cloud", icon: <Cloud size={24} />, description: "VM, Networking, Defender, Sentinel", level: 90 },
	{ name: "Intune/MEM", icon: <Shield size={24} />, description: "MDM, MAM, Compliance, Endpoint Security", level: 92 },
	{ name: "Active Directory", icon: <Server size={24} />, description: "Domain Controllers, GPO, ADFS, Hybrid AD", level: 90 },
	{ name: "PowerShell/Bash", icon: <Code size={24} />, description: "Scripting, Automation, GraphAPI", level: 88 },
	{ name: "Networking", icon: <Wifi size={24} />, description: "VLAN, VPN, Firewall, Zero Trust", level: 85 },
	{ name: "Endpoint Security", icon: <Shield size={24} />, description: "Windows, macOS, Linux, Android", level: 87 },
];

const services = [
	{
		id: "tier3-support",
		title: "Tier 2/3 IT Support",
		description: "Advanced technical support for desktop, server, and cloud systems.",
		icon: <Headphones size={32} />,
		features: ["Tier 2/3 escalations", "Desktop & server", "Cloud engineering", "Intune support", "QuickBooks support"],
	},
	{
		id: "azure-projects",
		title: "Cloud & M365 Projects",
		description: "Migrations to Microsoft 365 and Azure, Modern Workplace solutions.",
		icon: <Cloud size={32} />,
		features: ["Google to M365", "Azure VM ZTNA", "Intune/Defender", "Teams adoption", "Cloud design"],
	},
	{
		id: "consulting",
		title: "IT Consulting",
		description: "Strategic IT advice, cloud transformation, and security.",
		icon: <Briefcase size={32} />,
		features: ["Cloud migration", "Zero Trust", "Security", "Automation", "Best practices"],
	},
];

const projects = [
	{ id: "workspace-migration", title: "Google Workspace to M365", desc: "20+ users migrated, zero downtime", tags: ["M365", "Migration"], year: "2024", metric: "100%" },
	{ id: "azure-replication", title: "Azure VM & ZTNA", desc: "Business continuity design", tags: ["Azure", "ZTNA"], year: "2024", metric: "99.9%" },
	{ id: "intune-defender", title: "Intune & Defender", desc: "Endpoint security deployment", tags: ["Security"], year: "2024", metric: "200+" },
	{ id: "modern-workplace", title: "Modern Workplace", desc: "100+ projects delivered", tags: ["Cloud"], year: "2021-2025", metric: "100+" },
	{ id: "teams-adoption", title: "Teams Adoption", desc: "40% efficiency increase", tags: ["Teams"], year: "2024", metric: "40%" },
	{ id: "hybrid-ad", title: "Hybrid Azure AD", desc: "Full migration", tags: ["Azure AD"], year: "2017", metric: "50+" },
];

function DataCenterBackground() {
	const gridRef = useRef<THREE.Group>(null);
	
	useFrame(({ clock }) => {
		if (gridRef.current) {
			gridRef.current.rotation.x = clock.getElapsedTime() * 0.02;
			gridRef.current.rotation.y = clock.getElapsedTime() * 0.01;
		}
	});

	const servers = useMemo(() => {
		const coords = [
			[-5,-3,-2], [3,-2,4], [-2,1,5], [4,2,-3], [-4,0,1],
			[2,-1,-4], [0,3,2], [-3,-1,-1], [5,-2,0], [-1,2,-3],
			[1,-3,3], [-5,1,-2], [3,0,1], [-2,-2,4], [4,-1,-1],
			[0,1,-4], [-3,2,0], [2,3,-2], [-1,-3,2], [5,1,3]
		];
		return coords.map((pos, idx) => ({
			position: pos as [number, number, number],
			scale: 0.15 + (idx % 5) * 0.04,
			color: idx % 2 === 0 ? "#00b7c3" : "#8764B8",
		}));
	}, []);

	return (
		<group ref={gridRef}>
			<Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
			{/* Server racks */}
			{servers.map((server, i) => (
				<Float key={i} speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
					<mesh position={server.position} scale={server.scale}>
						<boxGeometry args={[1, 1.5, 0.5]} />
						<meshStandardMaterial 
							color="#1a1a2e" 
							emissive={server.color}
							emissiveIntensity={0.3}
							metalness={0.8}
							roughness={0.2}
						/>
					</mesh>
				</Float>
			))}
			{/* LED strips */}
			<mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[30, 30]} />
				<meshBasicMaterial color="#0a0a1a" transparent opacity={0.9} />
			</mesh>
			<pointLight position={[0, 5, 0]} intensity={0.5} color="#00b7c3" />
			<pointLight position={[-5, 3, 5]} intensity={0.3} color="#8764B8" />
			<pointLight position={[5, 3, -5]} intensity={0.3} color="#0078d4" />
		</group>
	);
}

function App() {
	const [activeSection, setActiveSection] = useState("home");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(true);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const sections = ["home", "about", "services", "skills", "projects", "contact"];
			for (const section of sections.reverse()) {
				const element = document.getElementById(section);
				if (element) {
					const rect = element.getBoundingClientRect();
					if (rect.top <= 150) {
						setActiveSection(section);
						break;
					}
				}
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (id: string) => {
		setMobileMenuOpen(false);
		const element = document.getElementById(id);
		if (element) element.scrollIntoView({ behavior: "smooth" });
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormStatus("sending");
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				setFormStatus("success");
				setFormData({ name: "", email: "", message: "" });
			} else setFormStatus("error");
		} catch { setFormStatus("error"); }
	};

	return (
		<div className="app" ref={containerRef}>
			<motion.div 
				className="custom-cursor"
				style={{ left: mousePos.x - 10, top: mousePos.y - 10 }}
			/>

			<header className="header">
				<div className="header-content">
					<motion.div 
						className="logo" 
						initial={{ opacity: 0, x: -20 }} 
						animate={{ opacity: 1, x: 0 }}
					>
						<Server size={28} />
						<span>Daniel R Jacobs</span>
					</motion.div>
					<div className="header-links">
						<a href="https://www.custompcrepublic.com" target="_blank" rel="noopener">
							<Globe size={18} />
							www.custompcrepublic.com
						</a>
						<a href="https://danieljacobs.custompcrepublic.com" target="_blank" rel="noopener">
							<Folder size={18} />
							Portfolio
						</a>
					</div>
					<button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
						{darkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
					<nav className="desktop-nav">
						{["home", "about", "services", "skills", "projects", "contact"].map((item) => (
							<button 
								key={item} 
								className={`nav-item ${activeSection === item ? "active" : ""}`}
								onClick={() => scrollToSection(item)}
							>
								{item.charAt(0).toUpperCase() + item.slice(1)}
							</button>
						))}
					</nav>
					<button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</header>

			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div className="mobile-nav" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
						{["home", "about", "services", "skills", "projects", "contact"].map((item) => (
							<button key={item} className={`nav-item ${activeSection === item ? "active" : ""}`} onClick={() => scrollToSection(item)}>
								{item.charAt(0).toUpperCase() + item.slice(1)}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			<main>
				<section id="home" className="hero">
					<Canvas className="hero-canvas">
						<Suspense fallback={null}>
							<DataCenterBackground />
						</Suspense>
						<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
					</Canvas>
					<div className="hero-content">
						<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
							<p className="hero-greeting">Hello, I'm</p>
							<h1 className="hero-name">Daniel R Jacobs</h1>
							<p className="hero-title">
								Tier 2 IT Support Engineer • Cloud Systems Engineer
							</p>
							<p className="hero-description">
								8+ years of enterprise IT experience. SC-300 & MS-900 certified.
								Specializing in Microsoft 365, Azure, and cloud infrastructure.
							</p>
							<div className="hero-stats">
								<div className="stat-box">
									<TrendingUp size={24} />
									<span className="stat-value">120+</span>
									<span className="stat-label">Projects</span>
								</div>
								<div className="stat-box">
									<User size={24} />
									<span className="stat-value">55+</span>
									<span className="stat-label">Clients</span>
								</div>
								<div className="stat-box">
									<Activity size={24} />
									<span className="stat-value">8+</span>
									<span className="stat-label">Years</span>
								</div>
							</div>
							<div className="hero-buttons">
								<button className="btn btn-primary" onClick={() => scrollToSection("contact")}>
									<Send size={18} /> Get In Touch
								</button>
								<button className="btn btn-secondary" onClick={() => scrollToSection("projects")}>
									<Folder size={18} /> View Projects
								</button>
							</div>
						</motion.div>
					</div>
					<motion.div className="hero-scroll-indicator" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
						<MousePointer size={24} />
					</motion.div>
				</section>

				<section id="about" className="section about">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>About Me</h2>
							<p>Experience that delivers results</p>
						</motion.div>

						<div className="about-grid">
							<motion.div className="about-card" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
								<div className="about-icon"><User size={32} /></div>
								<h3>Who I Am</h3>
								<p>8+ years experience in IT systems support, Microsoft 365 & Azure cloud, and cybersecurity. Passionate about scalable, secure solutions.</p>
							</motion.div>
							<motion.div className="about-card" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
								<div className="about-icon"><Briefcase size={32} /></div>
								<h3>What I Do</h3>
								<p>Tier 2/3 support, cloud migrations, M365 deployment, Intune management, security hardening, and IT consulting.</p>
							</motion.div>
						</div>

						<div className="charts-section">
							<h3>Experience Growth</h3>
							<div className="chart-container">
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart data={experienceData}>
										<defs>
											<linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#00b7c3" stopOpacity={0.8}/>
												<stop offset="95%" stopColor="#00b7c3" stopOpacity={0}/>
											</linearGradient>
											<linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#8764B8" stopOpacity={0.8}/>
												<stop offset="95%" stopColor="#8764B8" stopOpacity={0}/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
										<XAxis dataKey="year" stroke="var(--text-secondary)" />
										<YAxis stroke="var(--text-secondary)" />
										<Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
										<Legend />
										<Area type="monotone" dataKey="projects" stroke="#00b7c3" fillOpacity={1} fill="url(#colorProj)" name="Projects" />
										<Area type="monotone" dataKey="clients" stroke="#8764B8" fillOpacity={1} fill="url(#colorClient)" name="Clients" />
									</AreaChart>
								</ResponsiveContainer>
							</div>

							<div className="chart-container">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={experienceData}>
										<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
										<XAxis dataKey="year" stroke="var(--text-secondary)" />
										<YAxis stroke="var(--text-secondary)" />
										<Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
										<Legend />
										<Bar dataKey="projects" fill="#0078d4" name="Projects" radius={[4, 4, 0, 0]} />
										<Bar dataKey="clients" fill="#00b7c3" name="Clients" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className="job-history-section">
							<h3>Work History</h3>
							<div className="timeline">
								{jobHistory.map((job, i) => (
									<motion.div 
										key={job.company} 
										className="timeline-item"
										initial={{ opacity: 0, x: -30 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.1 }}
									>
										<div className="timeline-dot" />
										<div className="timeline-content">
											<h4>{job.role}</h4>
											<p className="timeline-company">{job.company}</p>
											<p className="timeline-duration">{job.duration}</p>
											<div className="timeline-highlights">
												{job.highlights.map(h => <span key={h}>{h}</span>)}
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>

						<div className="certifications-section">
							<h3>Certifications</h3>
							<div className="cert-grid">
								{certifications.map((cert, i) => (
									<motion.div 
										key={cert.name} 
										className="cert-card"
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ delay: i * 0.1 }}
									>
										<Award size={24} />
										<h4>{cert.name}</h4>
										<p>{cert.issuer}</p>
										<span>{cert.year}</span>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section id="services" className="section services">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>Services</h2>
							<p>Expert solutions for your IT needs</p>
						</motion.div>
						<div className="services-grid">
							{services.map((service, i) => (
								<motion.div 
									key={service.id}
									className="service-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.1 }}
									whileHover={{ scale: 1.02, y: -5 }}
								>
									<div className="service-icon">{service.icon}</div>
									<h3>{service.title}</h3>
									<p>{service.description}</p>
									<ul>
										{service.features.map(f => (
											<li key={f}><CheckCircle size={14} /> {f}</li>
										))}
									</ul>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="skills" className="section skills">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>Skills</h2>
							<p>Technical expertise</p>
						</motion.div>
						<div className="skills-charts">
							<div className="chart-container">
								<ResponsiveContainer width="100%" height={350}>
									<PieChart>
										<Pie 
											data={skillData} 
											dataKey="value" 
											nameKey="name"
											cx="50%" cy="50%" 
											innerRadius={60} 
											outerRadius={100}
											label={({ name, value }) => `${name}: ${value}%`}
										>
											{skillData.map((entry) => (
												<Cell key={entry.name} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="skills-progress">
								{skills.map((skill, i) => (
									<motion.div 
										key={skill.name} 
										className="skill-item"
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05 }}
									>
										<div className="skill-header">
											{skill.icon}
											<span>{skill.name}</span>
											<span className="skill-level">{skill.level}%</span>
										</div>
										<div className="skill-bar">
											<motion.div 
												className="skill-progress"
												initial={{ width: 0 }}
												whileInView={{ width: `${skill.level}%` }}
											/>
										</div>
									</motion.div>
								))}
							</div>
						</div>
						<div className="tech-distribution">
							<h3>Technology Focus</h3>
							<div className="chart-container">
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie 
											data={technologyDistribution}
											dataKey="value"
											nameKey="name"
											cx="50%" cy="50%"
											outerRadius={100}
											label
										>
											{technologyDistribution.map((entry) => (
												<Cell key={entry.name} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</section>

				<section id="projects" className="section projects">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>Projects</h2>
							<p>Recent work & achievements</p>
						</motion.div>
						<div className="projects-grid">
							{projects.map((project, i) => (
								<motion.div 
									key={project.id}
									className="project-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.1 }}
									whileHover={{ scale: 1.02, y: -5 }}
								>
									<div className="project-metric">{project.metric}</div>
									<h3>{project.title}</h3>
									<p>{project.desc}</p>
									<div className="project-tags">
										{project.tags.map(t => <span key={t}>{t}</span>)}
									</div>
									<span className="project-year">{project.year}</span>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="contact" className="section contact">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>Contact</h2>
							<p>Let's connect</p>
						</motion.div>
						<div className="contact-grid">
							<motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
								<h3>Get In Touch</h3>
								<p>Ready to discuss your IT needs? Reach out directly or use the form.</p>
								<div className="contact-links">
									<a href="tel:+27752031016"><Phone size={24} />+27 75 203 1016</a>
									<a href="mailto:custompcrepublic@gmail.com"><Mail size={24} />custompcrepublic@gmail.com</a>
									<a href="https://linkedin.com/in/daniel-jacobs-b961a8148"><Linkedin size={24} />LinkedIn</a>
									<a href="https://upwork.com/freelancers/~01919773e8e8eed423"><Briefcase size={24} />Upwork</a>
									<a href="https://www.custompcrepublic.com"><Globe size={24} />Website</a>
									<a href="https://danieljacobs.custompcrepublic.com"><Folder size={24} />Portfolio</a>
								</div>
							</motion.div>
							<motion.form className="contact-form" onSubmit={handleFormSubmit} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
								<div className="form-group">
									<label>Name</label>
									<input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Your name" />
								</div>
								<div className="form-group">
									<label>Email</label>
									<input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="your@email.com" />
								</div>
								<div className="form-group">
									<label>Message</label>
									<textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows={4} placeholder="Tell me about your project..." />
								</div>
								<button type="submit" className="btn btn-primary" disabled={formStatus === "sending"}>
									{formStatus === "sending" ? "Sending..." : <><Send size={18} />Send Message</>}
								</button>
								{formStatus === "success" && <p className="form-success">Message sent! I'll get back to you soon.</p>}
								{formStatus === "error" && <p className="form-error">Failed to send. Try again.</p>}
							</motion.form>
						</div>
					</div>
				</section>
			</main>

			<footer className="footer">
				<p>&copy; {new Date().getFullYear()} Daniel R Jacobs. All rights reserved.</p>
				<p>8+ Years Experience • SC-300 & MS-900 Certified</p>
			</footer>
		</div>
	);
}

export default App;