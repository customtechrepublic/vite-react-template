import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Headphones,
	Cloud,
	Mail,
	Folder,
	User,
	Briefcase,
	Award,
	Send,
	Linkedin,
	Github,
	ExternalLink,
	Server,
	Shield,
	Database,
	Code,
	CheckCircle,
	Menu,
	X,
	Cpu,
	Sun,
	Moon
} from "lucide-react";
import "./App.css";

interface NavItem {
	id: string;
	label: string;
	icon: React.ReactNode;
}

const navItems: NavItem[] = [
	{ id: "home", label: "Home", icon: <User size={20} /> },
	{ id: "about", label: "About", icon: <Briefcase size={20} /> },
	{ id: "services", label: "Services", icon: <Headphones size={20} /> },
	{ id: "skills", label: "Skills", icon: <Award size={20} /> },
	{ id: "projects", label: "Projects", icon: <Folder size={20} /> },
	{ id: "contact", label: "Contact", icon: <Mail size={20} /> },
];

const skills = [
	{ name: "Microsoft 365", icon: <Cloud size={24} />, description: "Exchange, Teams, SharePoint, OneDrive, Intune", level: 95 },
	{ name: "Azure AD/Entra", icon: <Shield size={24} />, description: "Conditional Access, MFA, SSO, Identity Protection", level: 92 },
	{ name: "Azure Cloud", icon: <Cloud size={24} />, description: "Virtual Machines, Networking, Defender, Sentinel", level: 90 },
	{ name: "Intune/MEM", icon: <Shield size={24} />, description: "MDM, MAM, Compliance, Endpoint Security", level: 92 },
	{ name: "Active Directory", icon: <Server size={24} />, description: "Domain Controllers, GPO, ADFS, Hybrid AD", level: 90 },
	{ name: "PowerShell/Bash", icon: <Code size={24} />, description: "Scripting, Automation, GraphAPI, YAML", level: 88 },
	{ name: "Networking", icon: <Shield size={24} />, description: "VLAN, VPN, Firewall, Cisco, Fortinet, Zero Trust", level: 85 },
	{ name: "Endpoint Security", icon: <Shield size={24} />, description: "Windows, macOS, Linux, Android, iOS", level: 87 },
];

const certifications = [
	"SC-300: Microsoft Identity & Access Administrator",
	"MS-900: Microsoft 365 Fundamentals",
	"MCSA Windows Server 2016 (70-697)",
	"CompTIA A+",
];

const services = [
	{
		id: "tier3-support",
		title: "Tier 2/3 IT Support",
		description: "Advanced technical support for desktop, server, and cloud systems. Escalations, troubleshooting, and resolution for complex IT issues.",
		icon: <Headphones size={32} />,
		features: [
			"Tier 2/3 support escalations",
			"Desktop & server troubleshooting",
			"Cloud systems engineering",
			"Microsoft 365 support",
			"Intune & endpoint management",
			"QuickBooks support specialist",
		],
	},
	{
		id: "azure-projects",
		title: "Cloud & M365 Projects",
		description: "Migrations to Microsoft 365 and Azure, implementation of Modern Workplace solutions, and business continuity design.",
		icon: <Cloud size={32} />,
		features: [
			"Google Workspace to M365 migration",
			"Azure VM replication & ZTNA",
			"Intune & Defender deployment",
			"Teams adoption & training",
			"Conditional access policies",
			"Cloud infrastructure design",
		],
	},
	{
		id: "consulting",
		title: "IT Consulting",
		description: "Strategic IT advice and architecture design. Cloud transformation, security hardening, and compliance implementation.",
		icon: <Briefcase size={32} />,
		features: [
			"Cloud migration planning",
			"Security & compliance",
			"Zero Trust architecture",
			"Azure Well Architected",
			"IT automation",
			"Documentation & best practices",
		],
	},
];

const projects = [
	{
		id: "workspace-migration",
		title: "Google Workspace to M365 Migration",
		description: "Migrated 20+ users from Google Workspace to Microsoft 365. Zero downtime and data loss.",
		tags: ["M365", "Migration", "Teams"],
		year: "2024",
	},
	{
		id: "azure-replication",
		title: "Azure VM Replication & ZTNA",
		description: "Designed and implemented Azure Virtual Machine replication for business continuity and Zero Trust Network Access.",
		tags: ["Azure", "ZTNA", "Security"],
		year: "2024",
	},
	{
		id: "intune-defender",
		title: "Intune & Defender ATP Deployment",
		description: "Secured endpoints using Intune and Defender ATP. Improved threat protection across the organization.",
		tags: ["Intune", "Defender", "Security"],
		year: "2024",
	},
	{
		id: "modern-workplace",
		title: "100+ Modern Workplace Projects",
		description: "Designed, architected, and delivered 100+ Modern Workplace and Cloud projects as Solutions Architect.",
		tags: ["Azure AD", "M365", "Intune"],
		year: "2021-2025",
	},
	{
		id: "teams-adoption",
		title: "Microsoft Teams Adoption",
		description: "Led Teams adoption for US-based CPA firm, increasing collaboration efficiency by ~40%.",
		tags: ["Teams", "SharePoint", "Adoption"],
		year: "2024",
	},
	{
		id: "hybrid-ad",
		title: "Hybrid Azure AD Migration",
		description: "Migrated all company devices to Hybrid Azure AD and Windows ADDS network for Nerospec Group.",
		tags: ["Azure AD", "Hybrid", "Windows Server"],
		year: "2017",
	},
];

function App() {
	const [activeSection, setActiveSection] = useState("home");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	useEffect(() => {
		const handleScroll = () => {
			const sections = navItems.map((item) => item.id);
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
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
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
			} else {
				setFormStatus("error");
			}
		} catch {
			setFormStatus("error");
		}
	};

	return (
		<div className="app">
			<header className="header">
				<div className="header-content">
					<motion.div
						className="logo"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<Cpu size={28} />
						<span>IT Engineer</span>
					</motion.div>
					<button
						className="theme-toggle"
						onClick={() => setDarkMode(!darkMode)}
						aria-label="Toggle dark mode"
					>
						{darkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
					<nav className="desktop-nav">
						{navItems.map((item) => (
							<button
								key={item.id}
								className={`nav-item ${activeSection === item.id ? "active" : ""}`}
								onClick={() => scrollToSection(item.id)}
							>
								{item.icon}
								<span>{item.label}</span>
							</button>
						))}
					</nav>
					<button
						className="mobile-menu-toggle"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</header>

			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						className="mobile-nav"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						{navItems.map((item) => (
							<button
								key={item.id}
								className={`nav-item ${activeSection === item.id ? "active" : ""}`}
								onClick={() => scrollToSection(item.id)}
							>
								{item.icon}
								<span>{item.label}</span>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			<main>
				<section id="home" className="hero">
					<div className="hero-content">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<p className="hero-greeting">Hello, I'm</p>
							<h1 className="hero-name">Daniel Richard Jacobs</h1>
							<p className="hero-title">
								Tier 3 Helpdesk & Azure/M365 Engineer
							</p>
							<p className="hero-description">
								8+ years of experience in enterprise IT support and infrastructure.
								MS900, SC-300 certified with CompTIA A+ diploma in IT support.
								Specializing in Microsoft 365, Exchange Server, Azure AD, and
								advanced technical support escalations.
							</p>
							<div className="hero-buttons">
								<button
									className="btn btn-primary"
									onClick={() => scrollToSection("contact")}
								>
									<Send size={18} />
									Get In Touch
								</button>
								<button
									className="btn btn-secondary"
									onClick={() => scrollToSection("projects")}
								>
									<Folder size={18} />
									View Projects
								</button>
							</div>
						</motion.div>
						<motion.div
							className="hero-visual"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="hero-cards">
								<motion.div
									className="hero-card"
									animate={{ y: [0, -10, 0] }}
									transition={{ duration: 3, repeat: Infinity }}
								>
									<Cloud size={32} />
									<span>Azure/M365</span>
								</motion.div>
								<motion.div
									className="hero-card"
									animate={{ y: [0, -10, 0] }}
									transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
								>
									<Mail size={32} />
									<span>Exchange</span>
								</motion.div>
								<motion.div
									className="hero-card"
									animate={{ y: [0, -10, 0] }}
									transition={{ duration: 3, repeat: Infinity, delay: 1 }}
								>
									<Shield size={32} />
									<span>Security</span>
								</motion.div>
							</div>
						</motion.div>
					</div>
				</section>

				<section id="about" className="section about">
					<div className="section-content">
						<motion.div
							className="section-header"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h2>About Me</h2>
							<p>Get to know my expertise and background</p>
						</motion.div>
						<div className="about-grid">
							<motion.div
								className="about-card"
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<div className="about-icon">
									<User size={32} />
								</div>
								<h3>Who I Am</h3>
								<p>
									A dedicated IT professional with extensive experience in
									Microsoft technologies. Specializing in Tier 3 helpdesk support
									and delivering complex Azure/M365 projects for enterprise clients.
								</p>
							</motion.div>
							<motion.div
								className="about-card"
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<div className="about-icon">
									<Briefcase size={32} />
								</div>
								<h3>What I Do</h3>
								<p>
									I provide advanced technical support and implement robust IT
									solutions. From troubleshooting complex Exchange issues to
									designing and deploying complete Microsoft 365 environments.
								</p>
							</motion.div>
						</div>
						<motion.div
							className="certifications"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h3>Certifications</h3>
							<div className="cert-badges">
								{certifications.map((cert, index) => (
									<motion.div
										key={cert}
										className="cert-badge"
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
									>
										<Award size={18} />
										<span>{cert}</span>
									</motion.div>
								))}
							</div>
						</motion.div>
					</div>
				</section>

				<section id="services" className="section services">
					<div className="section-content">
						<motion.div
							className="section-header"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h2>Services</h2>
							<p>Expert solutions for your IT needs</p>
						</motion.div>
						<div className="services-grid">
							{services.map((service, index) => (
								<motion.div
									key={service.id}
									className="service-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
								>
									<div className="service-icon">{service.icon}</div>
									<h3>{service.title}</h3>
									<p>{service.description}</p>
									<ul>
										{service.features.map((feature) => (
											<li key={feature}>
												<CheckCircle size={16} />
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="skills" className="section skills">
					<div className="section-content">
						<motion.div
							className="section-header"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h2>Skills</h2>
							<p>Technical expertise and technologies</p>
						</motion.div>
						<div className="skills-grid">
							{skills.map((skill, index) => (
								<motion.div
									key={skill.name}
									className="skill-card"
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.05 }}
								>
									<div className="skill-header">
										<div className="skill-icon">{skill.icon}</div>
										<div className="skill-info">
											<h4>{skill.name}</h4>
											<p>{skill.description}</p>
										</div>
									</div>
									<div className="skill-bar">
										<motion.div
											className="skill-progress"
											initial={{ width: 0 }}
											whileInView={{ width: `${skill.level}%` }}
											viewport={{ once: true }}
											transition={{ duration: 1, delay: 0.2 }}
										/>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="projects" className="section projects">
					<div className="section-content">
						<motion.div
							className="section-header"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h2>Projects</h2>
							<p>Recent work and case studies</p>
						</motion.div>
						<div className="projects-grid">
							{projects.map((project, index) => (
								<motion.div
									key={project.id}
									className="project-card"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
								>
									<div className="project-header">
										<h3>{project.title}</h3>
										<span className="project-year">{project.year}</span>
									</div>
									<p>{project.description}</p>
									<div className="project-tags">
										{project.tags.map((tag) => (
											<span key={tag} className="tag">
												{tag}
											</span>
										))}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="contact" className="section contact">
					<div className="section-content">
						<motion.div
							className="section-header"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<h2>Contact</h2>
							<p>Get in touch for your IT needs</p>
						</motion.div>
						<div className="contact-grid">
							<motion.div
								className="contact-info"
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<h3>Let's Connect</h3>
								<p>
									Ready to discuss your Azure or Microsoft 365 needs? Fill out
									the form or reach out directly through social media.
								</p>
								<div className="contact-links">
									<a href="mailto:daniel@custompcrepublic.com" className="contact-link">
										<Mail size={24} />
										<span>daniel@custompcrepublic.com</span>
										<ExternalLink size={16} />
									</a>
									<a href="#" className="contact-link">
										<Linkedin size={24} />
										<span>LinkedIn</span>
										<ExternalLink size={16} />
									</a>
									<a href="#" className="contact-link">
										<Github size={24} />
										<span>GitHub</span>
										<ExternalLink size={16} />
									</a>
								</div>
							</motion.div>
							<motion.form
								className="contact-form"
								onSubmit={handleFormSubmit}
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<div className="form-group">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
										placeholder="Your name"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
										placeholder="your.email@example.com"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="message">Message</label>
									<textarea
										id="message"
										value={formData.message}
										onChange={(e) =>
											setFormData({ ...formData, message: e.target.value })
										}
										required
										placeholder="Tell me about your project or issue..."
										rows={5}
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={formStatus === "sending"}
								>
									{formStatus === "sending" ? (
										<span>Sending...</span>
									) : (
										<>
											<Send size={18} />
											Send Message
										</>
									)}
								</button>
								{formStatus === "success" && (
									<p className="form-success">
										Message sent successfully! I'll get back to you soon.
									</p>
								)}
								{formStatus === "error" && (
									<p className="form-error">
										Failed to send message. Please try again or contact
										directly.
									</p>
								)}
							</motion.form>
						</div>
					</div>
				</section>
			</main>

			<footer className="footer">
				<div className="footer-content">
					<p>&copy; {new Date().getFullYear()} Freelance IT Engineer. All rights reserved.</p>
					<p>Built with React, Vite, and deployed on Cloudflare Workers</p>
				</div>
			</footer>
		</div>
	);
}

export default App;