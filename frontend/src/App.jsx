import { useState, useEffect } from 'react'

function App() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({
    slug: '', title: '', client_label: '', category: '', summary: '',
    problem: '', my_role: '', key_decision: '', outcome: '', 
    tech_stack: '', 
    is_featured: false, sort_order: 0
  })

  const fetchProjects = () => {
    fetch('http://localhost:8080/api/project')
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(err => console.error("Fetch error:", err))
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const payload = {
      ...form,
      sort_order: parseInt(form.sort_order, 10),
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      metrics: {},
      architecture: {}
    }

    fetch('http://localhost:8080/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok")
        return res.json()
      })
      .then(() => {
        setForm({
          slug: '', title: '', client_label: '', category: '', summary: '',
          problem: '', my_role: '', key_decision: '', outcome: '', 
          tech_stack: '', is_featured: false, sort_order: 0
        })
        fetchProjects()
      })
      .catch(err => console.error("Submit error:", err))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const inputStyles = "bg-black border border-neutral-800 text-white p-3 w-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"

  return (
    <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top_right,_#1a0000,_#000)]">
      <header className="bg-red-600 text-black px-12 py-4 inline-block -skew-x-12 mb-12 shadow-[8px_8px_0_rgba(255,255,255,0.1)]">
        <h1 className="skew-x-12 uppercase font-black tracking-widest text-3xl m-0">B2B Architecture CMS</h1>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        
        {/* FORM SECTION */}
        <section className="lg:col-span-1 bg-neutral-950 border-2 border-neutral-900 p-8 -skew-x-[2deg] relative group">
          <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-red-600 transition-all duration-300 group-hover:w-12 group-hover:h-12"></div>
          
          <h2 className="skew-x-[2deg] text-red-600 uppercase font-bold text-xl mt-0 mb-6 tracking-wide">Inject Case Study</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 skew-x-[2deg]">
            <div className="flex gap-4">
              <input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} className={inputStyles} required />
              <input name="slug" placeholder="URL Slug" value={form.slug} onChange={handleChange} className={inputStyles} required />
            </div>
            
            <div className="flex gap-4">
              <input name="client_label" placeholder="Client Label" value={form.client_label} onChange={handleChange} className={inputStyles} required />
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className={inputStyles} required />
            </div>

            <textarea name="summary" placeholder="Executive Summary" value={form.summary} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
            
            <div className="grid grid-cols-2 gap-4">
              <textarea name="problem" placeholder="The Problem" value={form.problem} onChange={handleChange} className={`${inputStyles} min-h-[80px]`} required />
              <textarea name="my_role" placeholder="My Role" value={form.my_role} onChange={handleChange} className={`${inputStyles} min-h-[80px]`} required />
              <textarea name="key_decision" placeholder="Key Decision" value={form.key_decision} onChange={handleChange} className={`${inputStyles} min-h-[80px]`} required />
              <textarea name="outcome" placeholder="The Outcome" value={form.outcome} onChange={handleChange} className={`${inputStyles} min-h-[80px]`} required />
            </div>

            <input name="tech_stack" placeholder="Tech Stack (Go, React, Redis)" value={form.tech_stack} onChange={handleChange} className={inputStyles} required />
            
            <button type="submit" className="bg-white text-black font-bold uppercase p-4 -skew-x-6 hover:bg-red-600 hover:text-white transition-colors duration-200 mt-4 tracking-wider">
              Deploy Case Study
            </button>
          </form>
        </section>

        {/* LIST*/}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {projects.map(p => (
            <div key={p.id} className="flex bg-neutral-900 -skew-x-[2deg] hover:-translate-x-2 hover:shadow-[-5px_5px_0_#e60000] transition-all duration-200">
              <div className="w-4 bg-red-600 shrink-0"></div>
              <div className="p-6 skew-x-[2deg] w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold m-0 flex items-center gap-3">
                    {p.title} 
                    <span className="text-xs bg-neutral-800 px-3 py-1 rounded-full text-gray-300 font-normal tracking-wide">{p.category}</span>
                  </h3>
                  <p className="text-red-500 font-bold uppercase text-sm tracking-wider m-0">{p.client_label}</p>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-4">{p.summary}</p>
                
                <div className="flex flex-wrap gap-2">
                  {p.tech_stack && p.tech_stack.map(tech => (
                    <span key={tech} className="bg-black border border-red-600/50 text-white px-3 py-1 text-xs -skew-x-12 uppercase tracking-wide">
                      <span className="block skew-x-12">{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  )
}

export default App