import React from 'react';
import { FiArrowRight, FiClock } from 'react-icons/fi';

const posts = [
  {
    title: '10 Tips for Writing Better Essays with AI',
    excerpt: 'Learn how to leverage AI tools to improve your essay writing, from brainstorming ideas to polishing your final draft.',
    category: 'Writing Tips',
    date: 'Mar 15, 2026',
    color: '#6366f1',
  },
  {
    title: 'Understanding Essay Structure: A Complete Guide',
    excerpt: 'Master the art of essay structure with our comprehensive guide covering introduction, body paragraphs, and conclusions.',
    category: 'Academics',
    date: 'Mar 10, 2026',
    color: '#10b981',
  },
  {
    title: 'How to Choose the Perfect Essay Topic',
    excerpt: 'Stuck on choosing a topic? Our guide walks you through a proven process to find engaging and manageable essay topics.',
    category: 'Writing Tips',
    date: 'Mar 5, 2026',
    color: '#f59e0b',
  },
  {
    title: 'The Future of Academic Writing: AI-Assisted Research',
    excerpt: 'Explore how AI is transforming academic writing and research, and what it means for students and researchers.',
    category: 'Industry',
    date: 'Feb 28, 2026',
    color: '#06b6d4',
  },
];

function BlogFeed() {
  return (
    <section className="blog-section reveal">
      <div className="container">
        <div className="section-label">Resources</div>
        <h2>Writing Tips & Resources</h2>
        <p className="section-desc">Stay updated with the latest writing guides and AI insights</p>
        <div className="blog-grid">
          {posts.map((post, i) => (
            <article className="blog-card" key={i}>
              <div className="blog-category" style={{ background: `${post.color}18`, color: post.color }}>
                {post.category}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="blog-footer">
                <span className="blog-date"><FiClock size={13} /> {post.date}</span>
                <span className="blog-read-more">Read More <FiArrowRight size={14} /></span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogFeed;
