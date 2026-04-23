import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	image: string;
	author: string;
	category: string;
	featured: boolean;
	content: string;
}

interface BlogCardProps {
	post: BlogPost;
	onClick: () => void;
}

function parseMarkdown(text: string): string {
	let html = text;
	
	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
	
	html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
	
	html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
	
	html = html.replace(/`(.*?)`/g, '<code>$1</code>');
	
	html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
	html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
	
	html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
	
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
	
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:1rem 0;" />');
	
	html = html.replace(/\n\n/g, '</p><p>');
	html = '<p>' + html + '</p>';
	
	html = html.replace(/<p><\/p>/g, '');
	html = html.replace(/<p>(<h[1-3]>)/g, '$1');
	html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
	html = html.replace(/<p>(<ul>)/g, '$1');
	html = html.replace(/(<\/ul>)<\/p>/g, '$1');
	html = html.replace(/<p>(<pre>)/g, '$1');
	html = html.replace(/(<\/pre>)<\/p>/g, '$1');
	
	return html;
}

function BlogCard({ post, onClick }: BlogCardProps) {
	return (
		<motion.article 
			className="blog-card"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -5 }}
			onClick={onClick}
			style={{ cursor: 'pointer' }}
		>
			{post.image && (
				<div className="blog-card-image">
					<img src={post.image} alt={post.title} onError={(e) => {
						(e.target as HTMLImageElement).style.display = 'none';
					}} />
					{post.featured && <span className="featured-badge">Featured</span>}
				</div>
			)}
			<div className="blog-card-content">
				<div className="blog-card-meta">
					<span><Calendar size={14} /> {post.date}</span>
					<span><Tag size={14} /> {post.category}</span>
				</div>
				<h3>{post.title}</h3>
				<p>{post.excerpt}</p>
				<div className="blog-card-footer">
					<span><User size={14} /> {post.author}</span>
					<span className="read-more">Read More <ArrowRight size={14} /></span>
				</div>
			</div>
		</motion.article>
	);
}

export default function Blog() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<string>("All");

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const response = await fetch("/blog/");
				const text = await response.text();
				
				const fileMatches = text.match(/href="([^"]+\.md)"/g) || [];
				const slugs = fileMatches.map(m => m.match(/href="([^"]+)"/)?.[1]).filter(Boolean) as string[];
				
				const loadedPosts = await Promise.all(
					slugs.map(async (slug) => {
						try {
							const res = await fetch(slug);
							const content = await res.text();
							
							const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
							const frontmatter: Record<string, string | boolean> = {};
							let body = content;
							
							if (frontmatterMatch) {
								const frontmatterText = frontmatterMatch[1];
								frontmatterText.split('\n').forEach(line => {
									const [key, ...valueParts] = line.split(':');
									if (key && valueParts.length) {
										let value: string | boolean = valueParts.join(':').trim();
										if (value === 'true') value = true;
										if (value === 'false') value = false;
										frontmatter[key.trim()] = value;
									}
								});
								body = content.slice(frontmatterMatch[0].length).trim();
							}
							
							return {
								slug: slug.replace('/blog/', '').replace('.md', ''),
								title: (frontmatter.title as string) || 'Untitled',
								date: (frontmatter.date as string) || '',
								excerpt: (frontmatter.excerpt as string) || '',
								image: (frontmatter.image as string) || '',
								author: (frontmatter.author as string) || 'Daniel R Jacobs',
								category: (frontmatter.category as string) || 'General',
								featured: (frontmatter.featured as boolean) || false,
								content: body
							};
						} catch {
							return null;
						}
					})
				);
				
				const validPosts = loadedPosts.filter((p): p is BlogPost => p !== null);
				setPosts(validPosts.sort((a, b) => 
					new Date(b.date).getTime() - new Date(a.date).getTime()
				));
			} catch (error) {
				console.error("Error loading blog posts:", error);
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, []);

	const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];
	const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter);

	if (selectedPost) {
		return (
			<div className="blog-container">
				<motion.div 
					className="blog-post"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<button className="back-button" onClick={() => setSelectedPost(null)}>
						<ArrowLeft size={20} /> Back to Posts
					</button>
					
					{selectedPost.image && (
						<div className="blog-post-hero">
							<img src={selectedPost.image} alt={selectedPost.title} onError={(e) => {
								(e.target as HTMLImageElement).style.display = 'none';
							}} />
						</div>
					)}
					
					<div className="blog-post-header">
						<h1>{selectedPost.title}</h1>
						<div className="blog-post-meta">
							<span><Calendar size={16} /> {selectedPost.date}</span>
							<span><User size={16} /> {selectedPost.author}</span>
							<span><Tag size={16} /> {selectedPost.category}</span>
						</div>
					</div>
					
					<div 
						className="blog-post-content"
						dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedPost.content) }}
					/>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="blog-container">
			<section className="blog-hero">
				<motion.div 
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<h1>Tech Stories & Insights</h1>
					<p>Real-world IT solutions, project case studies, and industry best practices</p>
				</motion.div>
			</section>

			<section className="blog-filters">
				{categories.map(cat => (
					<button
						key={cat}
						className={`filter-btn ${filter === cat ? 'active' : ''}`}
						onClick={() => setFilter(cat)}
					>
						{cat}
					</button>
				))}
			</section>

			<section className="blog-grid">
				{loading ? (
					<p className="loading">Loading posts...</p>
				) : filteredPosts.length === 0 ? (
					<p className="no-posts">No posts found</p>
				) : (
					filteredPosts.map((post) => (
						<BlogCard 
							key={post.slug} 
							post={post} 
							onClick={() => setSelectedPost(post)} 
						/>
					))
				)}
			</section>
		</div>
	);
}