import { useEffect, useState } from 'react'

type PostFrontmatter = {
  title: string
  date: string
  excerpt: string
  image?: string
  author?: string
  category?: string
  featured?: boolean
}

interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  image: string
  author: string
  category: string
  featured: boolean
  content: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selected, setSelected] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const manifest = await fetch('/blog/manifest.json').then(r => r.json())
        const postsList: BlogPost[] = []
        for (const p of manifest.posts) {
          const mdPath = `/blog/${p.slug}.md`
          const md = await fetch(mdPath).then(r => r.text())
          const front = extractFrontmatter(md)
          const body = md.split('|---')[2] || md
          postsList.push({
            slug: p.slug,
            title: front.title || p.title,
            date: front.date || p.date,
            excerpt: front.excerpt || p.excerpt,
            image: front.image || p.image || '/blog/default.jpg',
            author: front.author || p.author || 'Daniel R Jacobs',
            category: front.category || p.category || 'General',
            featured: !!front.featured || !!p.featured,
            content: body
          })
        }
        setPosts(postsList)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const parse = (md: string) => {
    // Very lightweight markdown to html converter
    let html = md
    html = html
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([a-z]+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gim, '<li>$1</li>');	
    html = '<p>' + html + '</p>'
    return html
  }

  // Tiny helper to extract frontmatter from a markdown string
  const extractFrontmatter = (text: string): PostFrontmatter => {
    const fm = { title: '', date: '', excerpt: '', image: '', author: '', category: '', featured: false } as PostFrontmatter
    const m = text.match(/^---\n([\s\S]*?)\n---/)
    if (m) {
      const content = m[1]
      content.split('\n').forEach(line => {
        const idx = line.indexOf(':')
        if (idx > -1) {
          const key = line.substring(0, idx).trim()
          const val = line.substring(idx + 1).trim()
          if (key && val !== '') (fm as any)[key] = val
          if (val === 'true') (fm as any)[key] = true
        }
      })
    }
    return fm
  }

  return (
    <div className="blog-container">
      <section className="blog-hero">
        <div className="hero-content"/>
      </section>
      <section className="blog-grid">
        {loading && <p className="loading">Loading posts...</p>}
        {!loading && posts.map(p => (
          <article key={p.slug} className="blog-card" onClick={() => setSelected(p)}>
            {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
            <div className="blog-card-content">
              <div className="blog-card-meta"><span>{p.date}</span><span>{p.category}</span></div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </div>
          </article>
        ))}
      </section>
      {selected && (
        <section className="blog-post-detail">
          <button onClick={() => setSelected(null)}>Back</button>
          <h1>{selected.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: parse(selected.content) }} />
        </section>
      )}
    </div>
  )
}
