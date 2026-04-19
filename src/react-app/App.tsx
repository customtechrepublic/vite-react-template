import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
	AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
	XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
	Headphones, Cloud, Mail, Folder, Briefcase, Award, Send,
	Linkedin, Server, Code, CheckCircle, Menu, X,
	Sun, Moon, Phone, Globe,
	Activity, TrendingUp, Calendar
} from "lucide-react";
import "./App.css";

const skillProficiency = [
	{ skill: "Microsoft 365", level: 95, category: "cloud", years: 8 },
	{ skill: "Azure AD/Entra", level: 92, category: "cloud", years: 6 },
	{ skill: "Intune/MEM", level: 92, category: "security", years: 5 },
	{ skill: "Azure Cloud", level: 90, category: "cloud", years: 6 },
	{ skill: "Active Directory", level: 90, category: "infrastructure", years: 8 },
	{ skill: "Exchange Server", level: 88, category: "cloud", years: 7 },
	{ skill: "PowerShell", level: 88, category: "automation", years: 6 },
	{ skill: "Endpoint Security", level: 87, category: "security", years: 5 },
	{ skill: "Networking", level: 85, category: "infrastructure", years: 6 },
	{ skill: "Defender ATP", level: 85, category: "security", years: 4 },
	{ skill: "SharePoint/Teams", level: 90, category: "cloud", years: 7 },
	{ skill: "SQL Server", level: 80, category: "database", years: 5 },
];

const skillTree = {
	cloud: ["Microsoft 365", "Azure AD", "Exchange", "SharePoint", "Teams", "OneDrive", "Intune"],
	security: ["Intune", "Endpoint Security", "Defender ATP", "Conditional Access", "MFA", "Zero Trust"],
	infrastructure: ["Active Directory", "DHCP", "DNS", "GPO", "Networking", "VPN", "VLAN"],
	automation: ["PowerShell", "Bash", "GraphAPI", "Automation", "YAML", "REST API"],
	database: ["SQL Server", "Azure SQL", "Database Admin", "Always On"],
};

const timelineEvents = [
	{ year: "2016", month: "Feb", title: "Matrix Warehouse IT Consultant", type: "job", description: "IT support & sales, highest customer ratings" },
	{ year: "2017", month: "Sep", title: "Nerospec Group - Junior IT Manager", type: "job", description: "Hybrid AD migration, Teams deployment" },
	{ year: "2018", month: "", title: "CloudScale365 - Technical Support Engineer", type: "job", description: "100+ tickets weekly, Solutions Architect" },
	{ year: "2018", month: "", title: "tekRESCUE - Tier 3 IT & QuickBooks", type: "job", description: "Tier 3 support, QuickBooks SME" },
	{ year: "2021", month: "Apr", title: "Support Adventure Ltd - IT Support Engineer", type: "job", description: "Intune/MAM, 30+ digital projects" },
	{ year: "2023", month: "Mar", title: "Microsoft Customer Service Ambassador", type: "job", description: "5-star rating, MacOS specialist" },
	{ year: "2024", month: "Aug", title: "US-based CPA Firm - Lead Consultant", type: "job", description: "M365 migration, Azure VM ZTNA" },
	{ year: "2026", month: "Feb", title: "Logics Technology - Tier 2 IT Support", type: "job", description: "Automated workflows, Copilot integration" },
	{ year: "2016", month: "", title: "CompTIA A+", type: "cert", description: "IT Systems Support" },
	{ year: "2017", month: "", title: "MCSA 70-697", type: "cert", description: "Windows Server 2016" },
	{ year: "2022", month: "", title: "SC-300", type: "cert", description: "Identity & Access Administrator" },
	{ year: "2024", month: "", title: "MS-900", type: "cert", description: "Microsoft 365 Fundamentals" },
];

const techKeywords = [
	"Microsoft365", "AzureAD", "ExchangeOnline", "SharePoint", "Teams", "OneDrive", "Intune",
	"AzureVM", "VirtualNetwork", "VPN", "ZTNA", "ConditionalAccess", "MFA", "SSO",
	"PowerShell", "Bash", "GraphAPI", "YAML", "RESTAPI", "Automation",
	"ActiveDirectory", "HybridAD", "GPO", "DHCP", "DNS", "DFS", "ADFS",
	"DefenderATP", "Sentinel", "EndpointSecurity", "Compliance", "MEM",
	"SQLServer", "AlwaysOn", "AzureSQL", "Database",
	"VLAN", "Firewall", "Cisco", "Fortinet", "SonicWall", "ZeroTrust",
	"Exchange2016", "Exchange2019", "DAG", "Transport",
	"ConnectWise", "NinjaOne", "ITGlue", "Kanban", "Jira",
	"MacOS", "WindowsServer", "Linux", "Ubuntu", "CentOS"
];

const experienceData = [
	{ year: "2016", projects: 15, clients: 8, tickets: 200 },
	{ year: "2017", projects: 25, clients: 12, tickets: 350 },
	{ year: "2018", projects: 45, clients: 20, tickets: 520 },
	{ year: "2019", projects: 65, clients: 28, tickets: 480 },
	{ year: "2020", projects: 75, clients: 32, tickets: 420 },
	{ year: "2021", projects: 90, clients: 40, tickets: 380 },
	{ year: "2022", projects: 100, clients: 45, tickets: 350 },
	{ year: "2023", projects: 110, clients: 50, tickets: 320 },
	{ year: "2024", projects: 120, clients: 55, tickets: 300 },
	{ year: "2025", projects: 125, clients: 58, tickets: 280 },
];

const radarData = [
	{ subject: "Microsoft 365", A: 95, fullMark: 100 },
	{ subject: "Azure", A: 90, fullMark: 100 },
	{ subject: "Security", A: 88, fullMark: 100 },
	{ subject: "Networking", A: 85, fullMark: 100 },
	{ subject: "Automation", A: 88, fullMark: 100 },
	{ subject: "Servers", A: 90, fullMark: 100 },
	{ subject: "Database", A: 80, fullMark: 100 },
];

function MatrixBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const columns = Math.floor(canvas.width / 20);
		const drops: number[] = new Array(columns).fill(1);
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>[]{}".split("");
		
		const draw = () => {
			ctx.fillStyle = "rgba(10, 10, 26, 0.05)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.font = "14px monospace";
			ctx.fillStyle = "#00b7c3";
			
			for (let i = 0; i < drops.length; i++) {
				const char = chars[Math.floor(Math.random() * chars.length)];
				const text = Math.random() > 0.9 ? `[${char}]` : char;
				ctx.fillStyle = `rgba(0, 183, 195, ${Math.random() * 0.5 + 0.5})`;
				ctx.fillText(text, i * 20, drops[i] * 20);
				
				if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		};
		
		const interval = setInterval(draw, 50);
		
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		
		window.addEventListener("resize", handleResize);
		
		return () => {
			clearInterval(interval);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas 
			ref={canvasRef} 
			className="matrix-canvas"
		/>
	);
}

function LogStream() {
	const logRef = useRef<HTMLDivElement>(null);
	const [logs, setLogs] = useState<string[]>([]);
	
	useEffect(() => {
		const logMessages = [
			"[2026-04-19 10:23:45] INFO: Connecting to Azure AD tenant...",
			"[2026-04-19 10:23:46] INFO: Authenticating user session...",
			"[2026-04-19 10:23:47] INFO: Fetching Intune policies...",
			"[2026-04-19 10:23:48] DEBUG: Processing conditional access rules...",
			"[2026-04-19 10:23:49] INFO: Applying MFA challenge...",
			"[2026-04-19 10:23:50] SUCCESS: User authenticated (SAML assertion verified)",
			"[2026-04-19 10:23:51] INFO: Checking mailbox permissions...",
			"[2026-04-19 10:23:52] DEBUG: Query: Get-Mailbox -Identity daniel@custompcrepublic.com",
			"[2026-04-19 10:23:53] INFO: Exchange Online connection established",
			"[2026-04-19 10:23:54] INFO: Syncing calendar entries...",
			"[2026-04-19 10:23:55] DEBUG: GraphAPI: /users/daniel@example.com/calendar/events",
			"[2026-04-19 10:23:56] SUCCESS: 47 events synced",
			"[2026-04-19 10:23:57] INFO: Checking SharePoint permissions...",
			"[2026-04-19 10:23:58] DEBUG: Get-SPOTenantSyncClientRestriction",
			"[2026-04-19 10:23:59] INFO: Tenant sync enabled",
			"[2026-04-19 10:24:00] INFO: Deploying Intune device policies...",
			"[2026-04-19 10:24:01] DEBUG: Create-DeviceConfigurationPolicy",
			"[2026-04-19 10:24:02] SUCCESS: Policy deployed to 250 devices",
			"[2026-04-19 10:24:03] INFO: Scanning endpoint security...",
			"[2026-04-19 10:24:04] WARN: 3 devices require attention",
			"[2026-04-19 10:24:05] INFO: Initiating Defender scan...",
			"[2026-04-19 10:24:06] DEBUG: ATP API: deviceactions/run antivirus scan",
			"[2026-04-19 10:24:07] INFO: Scan completed - No threats detected",
			"[2026-04-19 10:24:08] INFO: Checking VPN connections...",
			"[2026-04-19 10:24:09] DEBUG: Get-VpnConnection | Where-Object {$_.Status -eq 'Connected'}",
			"[2026-04-19 10:24:10] INFO: 15 active VPN sessions",
			"[2026-04-19 10:24:11] INFO: Monitoring Azure VM health...",
			"[2026-04-19 10:24:12] DEBUG: Get-AzVM | Select-Object Name, Status",
			"[2026-04-19 10:24:13] INFO: All 12 VMs running optimally",
			"[2026-04-19 10:24:14] INFO: Processing support tickets...",
			"[2026-04-19 10:24:15] DEBUG: Get-Service @support | Where-Object Priority -eq 'High'",
			"[2026-04-19 10:24:16] INFO: 5 high priority tickets pending",
			"[2026-04-19 10:24:17] SYSTEM: Auto-assigning tickets to Available Engineers",
		];
		
		let index = 0;
		const interval = setInterval(() => {
			setLogs(prev => {
				const newLog = [...prev, logMessages[index % logMessages.length]];
				if (newLog.length > 15) newLog.shift();
				index++;
				return newLog;
			});
		}, 150);
		
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="log-stream" ref={logRef}>
			{logs.map((log, i) => (
				<div key={i} className="log-line">
					{log}
				</div>
			))}
		</div>
	);
}

const certifications = [
	{ name: "SC-300", issuer: "Microsoft", year: "2022", desc: "Identity & Access Administrator" },
	{ name: "MS-900", issuer: "Microsoft", year: "2024", desc: "M365 Fundamentals" },
	{ name: "MCSA 70-697", issuer: "Microsoft", year: "2017", desc: "Windows Server 2016" },
	{ name: "CompTIA A+", issuer: "CompTIA", year: "2016", desc: "IT Systems Support" },
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
					<MatrixBackground />
					<div className="hero-content">
						<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
							<p className="hero-greeting">Hello, I'm</p>
							<h1 className="hero-name">Daniel R Jacobs</h1>
							<p className="hero-title">
								Tier 2 IT Support Engineer • Cloud Systems Engineer
							</p>
							<p className="hero-description">
								8+ years enterprise IT experience. SC-300 & MS-900 certified.
								Specializing in Microsoft 365, Azure, and cloud infrastructure.
							</p>
							<div className="hero-stats">
								<div className="stat-box">
									<TrendingUp size={24} />
									<span className="stat-value">125+</span>
									<span className="stat-label">Projects Delivered</span>
								</div>
								<div className="stat-box">
									<Folder size={24} />
									<span className="stat-value">58+</span>
									<span className="stat-label">Organizations</span>
								</div>
								<div className="stat-box">
									<Activity size={24} />
									<span className="stat-value">8+</span>
									<span className="stat-label">Years XP</span>
								</div>
								<div className="stat-box">
									<CheckCircle size={24} />
									<span className="stat-value">385+</span>
									<span className="stat-label">Upwork Hours</span>
								</div>
							</div>
							<div className="hero-badges">
								<span className="badge">SOC 2 Compliant</span>
								<span className="badge">MacOS Specialist</span>
								<span className="badge">MSP Expert</span>
								<span className="badge">$30/hr Rate</span>
							</div>
							<div className="hero-buttons">
								<button className="btn btn-primary" onClick={() => scrollToSection("contact")}>
									<Send size={18} /> Get In Touch
								</button>
								<button className="btn btn-secondary" onClick={() => scrollToSection("skills")}>
									<Code size={18} /> View Skills
								</button>
							</div>
						</motion.div>
					</div>
					<div className="log-panel">
						<LogStream />
					</div>
				</section>

				<section id="about" className="section about">
					<div className="section-content">
						<motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
							<h2>Experience Timeline</h2>
							<p>My journey through IT</p>
						</motion.div>

						<div className="timeline-container">
							{timelineEvents.sort((a, b) => {
								const yearA = parseInt(a.year + (a.month ? "0" + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(a.month) : "0"));
								const yearB = parseInt(b.year + (b.month ? "0" + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(b.month) : "0"));
								return yearA - yearB;
							}).map((event, i) => (
								<motion.div 
									key={i}
									className={`timeline-event ${event.type}`}
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05 }}
								>
									<div className="event-date">
										<Calendar size={14} />
										{event.month && `${event.month}/`}{event.year}
									</div>
									<div className="event-title">{event.title}</div>
									<div className="event-desc">{event.description}</div>
								</motion.div>
							))}
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
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
										<XAxis dataKey="year" stroke="var(--text-secondary)" />
										<YAxis stroke="var(--text-secondary)" />
										<Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
										<Legend />
										<Area type="monotone" dataKey="projects" stroke="#00b7c3" fillOpacity={1} fill="url(#colorProj)" name="Projects" />
										<Area type="monotone" dataKey="clients" stroke="#8764B8" fillOpacity={0.3} fill="#8764B8" name="Clients" />
										<Area type="monotone" dataKey="tickets" stroke="#0078d4" fillOpacity={0.2} fill="#0078d4" name="Tickets" />
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className="certifications-section">
							<h3>Certifications</h3>
							<div className="cert-grid">
								{certifications.map((cert) => (
									<motion.div 
										key={cert.name} 
										className="cert-card"
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
transition={{ delay: 0.1 }}
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
							{services.map((service) => (
								<motion.div 
									key={service.id}
									className="service-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
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
							<h2>Skills & Expertise</h2>
							<p>Technical proficiency over time</p>
						</motion.div>

						<div className="skilltree-section">
							<h3>Skill Tree</h3>
							<div className="skilltree">
								{Object.entries(skillTree).map(([category, skills]) => (
									<div key={category} className={`skill-branch ${category}`}>
										<h4>{category.toUpperCase()}</h4>
										<div className="skill-nodes">
											{skills.map((skill) => (
												<span key={skill} className="skill-node">{skill}</span>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="skills-visual">
							<div className="chart-container">
								<ResponsiveContainer width="100%" height={350}>
									<RadarChart data={radarData}>
										<PolarGrid stroke="var(--border)" />
										<PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" />
										<PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-secondary)" />
										<Radar name="Proficiency" dataKey="A" stroke="#00b7c3" fill="#00b7c3" fillOpacity={0.3} />
										<Tooltip />
									</RadarChart>
								</ResponsiveContainer>
							</div>

							<div className="skills-timeline">
								<h3>Proficiency Over Years</h3>
								<div className="timeline-bars">
									{skillProficiency.sort((a, b) => b.years - a.years).slice(0, 8).map((skill) => (
										<div key={skill.skill} className="timeline-skill">
											<div className="skill-info">
												<span className="skill-name">{skill.skill}</span>
												<span className="skill-years">{skill.years} years</span>
											</div>
											<div className="skill-bar">
												<motion.div 
													className="skill-progress"
													initial={{ width: 0 }}
													whileInView={{ width: `${skill.level}%` }}
												/>
												<span className="skill-percent">{skill.level}%</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="wordcloud-section">
							<h3>Technology Word Cloud</h3>
							<div className="word-cloud">
								{techKeywords.map((word, idx) => (
									<span 
										key={word} 
										className="word-tag"
										style={{ 
											fontSize: `${0.7 + (idx % 5) * 0.15}rem`,
											opacity: 0.6 + (idx % 4) * 0.1,
											animationDelay: `${(idx % 5) * 0.3}s`
										}}
									>
										{word}
									</span>
								))}
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
							{projects.map((project) => (
								<motion.div 
									key={project.id}
									className="project-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
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
								<p>Ready to discuss your IT needs?</p>
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
				<p>SC-300 & MS-900 Certified • 8+ Years Experience</p>
			</footer>
		</div>
	);
}

export default App;