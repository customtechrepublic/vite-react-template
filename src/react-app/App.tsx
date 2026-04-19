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
	Cpu
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
	{ name: "Microsoft 365", icon: <Cloud size={24} />, description: "Exchange Online, SharePoint, Teams, OneDrive, Intune", level: 95 },
	{ name: "Azure AD", icon: <Shield size={24} />, description: "Conditional Access, MFA, SSO, Identity Protection", level: 90 },
	{ name: "Exchange Server", icon: <Mail size={24} />, description: "Exchange 2016/2019/Online, DAG, Transport", level: 92 },
	{ name: "Azure", icon: <Cloud size={24} />, description: "VM, Storage, Networking, Functions, Logic Apps", level: 88 },
	{ name: "Active Directory", icon: <Server size={24} />, description: "Domain Controllers, GPO, DFS, ADFS", level: 90 },
	{ name: "PowerShell", icon: <Code size={24} />, description: "Scripting, Automation, Exchange, Azure AD", level: 85 },
	{ name: "Intune/MEM", icon: <Shield size={24} />, description: "Device Management, MAM, Compliance Policies", level: 87 },
	{ name: "SQL Server", icon: <Database size={24} />, description: "Administration, Always On,-backup", level: 80 },
];

const certifications = [
	"Microsoft 365 Certified: Administrator Expert",
	"Microsoft Azure Administrator (AZ-104)",
	"Microsoft 70-345: Exchange Server",
	"CompTIA Security+",
	"ITIL Foundation",
];

const services = [
	{
		id: "tier3-support",
		title: "Tier 3 Helpdesk Support",
		description: "Advanced technical support for complex issues escalations from Tier 1/2 support teams. Deep troubleshooting of Exchange, M365, and Azure AD problems.",
		icon: <Headphones size={32} />,
		features: [
			"Exchange Server troubleshooting & migration",
			"Microsoft 365 tenant issues",
			"Azure AD and identity problems",
			"Email flow and transport issues",
			" mailbox permissions and shared mailboxes",
			"Advanced Teams and SharePoint issues",
		],
	},
	{
		id: "azure-projects",
		title: "Azure/M365 Projects",
		description: "Planning and implementing Microsoft 365 and Azure solutions for businesses of all sizes. From migrations to new deployments.",
		icon: <Cloud size={32} />,
		features: [
			"Microsoft 365 tenant setup",
			"Exchange Online migration",
			"Azure AD implementation",
			"Intune device management",
			"SharePoint/Teams deployment",
			"Hybrid Exchange configuration",
		],
	},
	{
		id: "consulting",
		title: "IT Consulting",
		description: "Strategic IT advice and architecture design for Microsoft solutions. Optimize your M365 and Azure environment.",
		icon: <Briefcase size={32} />,
		features: [
			"Architecture design reviews",
			"Security assessments",
			"Migration planning",
			"License optimization",
			"Compliance recommendations",
			"Best practices guidance",
		],
	},
];

const projects = [
	{
		id: "exchange-migration",
		title: "Exchange 2016 to Exchange Online Migration",
		description: "Complete hybrid migration for a 500-user organization. Migrated from on-premises Exchange 2016 to Exchange Online with minimal downtime.",
		tags: ["Exchange Online", "Azure AD Connect", "Hybrid"],
		year: "2024",
	},
	{
		id: "azure-ad-setup",
		title: "Azure AD Implementation",
		description: "Implemented Azure AD for a mid-size company with 300 employees. Set up conditional access, MFA, and SSO for 15+ SaaS applications.",
		tags: ["Azure AD", "Conditional Access", "SSO"],
		year: "2024",
	},
	{
		id: "intune-deployment",
		title: "Intune Device Management",
		description: "Deployed Intune for device management across 200+ Windows and mobile devices. Implemented compliance policies and MAM.",
		tags: ["Intune", "MEM", "MAM"],
		year: "2023",
	},
	{
		id: "sharepoint-migration",
		title: "SharePoint Online Migration",
		description: "Migrated 2TB of data from on-premises SharePoint 2016 to SharePoint Online. Implemented proper permissions and metadata.",
		tags: ["SharePoint", "M365", "Migration"],
		year: "2023",
	},
	{
		id: "security-hardening",
		title: "M365 Security Hardening",
		description: "Comprehensive security assessment and hardening for a financial services company. Implemented zero-trust model with Conditional Access.",
		tags: ["Security", "Zero Trust", "Compliance"],
		year: "2024",
	},
	{
		id: "teams-voicemail",
		title: "Teams Voicemail Migration",
		description: "Migrated voicemail from on-premises Exchange UM to Exchange Online UM for Teams. Integrated with existing voicemail system.",
		tags: ["Teams", "Voicemail", "Exchange"],
		year: "2023",
	},
];

function App() {
	const [activeSection, setActiveSection] = useState("home");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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
							<h1 className="hero-name">Freelance IT Engineer</h1>
							<p className="hero-title">
								Tier 3 Helpdesk & Azure/M365 Project Specialist
							</p>
							<p className="hero-description">
								Expert in Microsoft 365, Exchange Server, Azure Active Directory,
								and enterprise IT solutions. Providing advanced technical support
								and infrastructure projects for businesses worldwide.
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