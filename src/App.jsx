import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL,
import.meta.env.VITE_SUPABASE_ANON_KEY
)

const TABS = ['Customers', 'Inventory', 'Time Clock', 'Calendar', 'Goals']

const colors = {
bg: '#0a0a0a',
card: '#1a1a2e',
accent: '#FFD700',
blue: '#1E90FF',
text: '#ffffff',
subtext: '#aaaaaa',
input: '#2a2a4a',
border: '#FFD700',
}

const s = {
app: { fontFamily: 'Arial', maxWidth: 650, margin: '0 auto', padding: 20, background: colors.bg, minHeight: '100vh', color: colors.text },
header: { textAlign: 'center', marginBottom: 24, borderBottom: `2px solid ${colors.accent}`, paddingBottom: 16 },
title: { color: colors.accent, fontSize: 28, margin: 0 },
subtitle: { color: colors.blue, fontSize: 14, margin: '4px 0 0' },
tabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
tab: { padding: '8px 16px', cursor: 'pointer', border: `1px solid ${colors.blue}`, borderRadius: 6, background: 'transparent', color: colors.blue, fontWeight: 'bold' },
activeTab: { padding: '8px 16px', cursor: 'pointer', border: `1px solid ${colors.accent}`, borderRadius: 6, background: colors.accent, color: '#000', fontWeight: 'bold' },
input: { padding: 10, border: `1px solid ${colors.blue}`, borderRadius: 6, width: '100%', marginBottom: 10, boxSizing: 'border-box', background: colors.input, color: colors.text },
btn: { padding: '10px 20px', background: colors.accent, color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' },
btnBlue: { padding: '8px 14px', background: colors.blue, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' },
card: { border: `1px solid ${colors.blue}`, borderRadius: 8, padding: 14, marginBottom: 10, background: colors.card },
sectionTitle: { color: colors.accent, borderBottom: `1px solid ${colors.blue}`, paddingBottom: 6, marginBottom: 14 },
total: { marginTop: 12, fontSize: 20, color: colors.accent, fontWeight: 'bold' },
calCard: { border: `1px solid ${colors.accent}`, borderRadius: 8, padding: 14, marginBottom: 10, background: colors.card },
label: { color: colors.subtext, fontSize: 12, marginBottom: 4 },
}

export default function App() {
const [tab, setTab] = useState('Customers')

const [customers, setCustomers] = useState([])
const [form, setForm] = useState({ name: '', phone: '', address: '', service: '' })

const [inventory, setInventory] = useState([])
const [item, setItem] = useState({ name: '', cost: '' })

const [clocks, setClocks] = useState([])
const [employee, setEmployee] = useState('')
const [jobDesc, setJobDesc] = useState('')

const [events, setEvents] = useState([])
const [event, setEvent] = useState({ title: '', date: '', time: '', notes: '' })

const [goals, setGoals] = useState([])
const [goal, setGoal] = useState({ text: '', period: 'Weekly' })

useEffect(() => { loadAll() }, [])

const loadAll = async () => {
const [c, i, j, a, g] = await Promise.all([
supabase.from('customers').select('*').order('created_at', { ascending: false }),
supabase.from('inventory').select('*').order('created_at', { ascending: false }),
supabase.from('jobs').select('*').order('created_at', { ascending: false }),
supabase.from('appointments').select('*').order('date'),
supabase.from('goals').select('*').order('created_at', { ascending: false }),
])
if (c.data) setCustomers(c.data)
if (i.data) setInventory(i.data)
if (j.data) setClocks(j.data)
if (a.data) setEvents(a.data)
if (g.data) setGoals(g.data)
}

const addCustomer = async () => {
if (!form.name) return
const { data } = await supabase.from('customers').insert([form]).select()
if (data) setCustomers([...data, ...customers])
setForm({ name: '', phone: '', address: '', service: '' })
}

const addItem = async () => {
if (!item.name) return
const { data } = await supabase.from('inventory').insert([item]).select()
if (data) setInventory([...data, ...inventory])
setItem({ name: '', cost: '' })
}

const clockIn = async () => {
if (!employee || !jobDesc) return
const entry = { employee, job: jobDesc, time_in: new Date().toLocaleTimeString(), time_out: null, duration: null }
const { data } = await supabase.from('jobs').insert([entry]).select()
if (data) setClocks([...data, ...clocks])
setEmployee('')
setJobDesc('')
}

const clockOut = async (id) => {
const job = clocks.find(c => c.id === id)
if (!job || job.time_out) return
const time_out = new Date().toLocaleTimeString()
const duration = 'Job complete'
await supabase.from('jobs').update({ time_out, duration }).eq('id', id)
setClocks(clocks.map(c => c.id === id ? { ...c, time_out, duration } : c))
}

const addEvent = async () => {
if (!event.title || !event.date) return
const { data } = await supabase.from('appointments').insert([event]).select()
if (data) setEvents([...events, ...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
setEvent({ title: '', date: '', time: '', notes: '' })
}

const addGoal = async () => {
if (!goal.text) return
const { data } = await supabase.from('goals').insert([{ ...goal, done: false }]).select()
if (data) setGoals([...data, ...goals])
setGoal({ text: '', period: 'Weekly' })
}

const toggleGoal = async (id, done) => {
await supabase.from('goals').update({ done: !done }).eq('id', id)
setGoals(goals.map(g => g.id === id ? { ...g, done: !done } : g))
}

const total = inventory.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0)

return (
<div style={s.app}>
<div style={s.header}>
<h1 style={s.title}>⚡ Tyme2Shine</h1>
<p style={s.subtitle}>Mobile Detailing Management</p>
</div>

<div style={s.tabs}>
{TABS.map(t => (
<button key={t} style={tab === t ? s.activeTab : s.tab} onClick={() => setTab(t)}>{t}</button>
))}
</div>

{tab === 'Customers' && (
<div>
<h2 style={s.sectionTitle}>➕ Add Customer</h2>
<div style={s.label}>Name</div>
<input style={s.input} placeholder="Customer name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
<div style={s.label}>Phone</div>
<input style={s.input} placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
<div style={s.label}>Address</div>
<input style={s.input} placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
<div style={s.label}>Service Description</div>
<input style={s.input} placeholder="What was done to the vehicle" value={form.service} onChange={e => setForm({...form, service: e.target.value})} />
<button style={s.btn} onClick={addCustomer}>Add Customer</button>
<h2 style={{...s.sectionTitle, marginTop: 24}}>👥 Customers ({customers.length})</h2>
{customers.length === 0 && <p style={{color: colors.subtext}}>No customers yet.</p>}
{customers.map(c => (
<div key={c.id} style={s.card}>
<strong style={{color: colors.accent}}>{c.name}</strong> &nbsp;
<span style={{color: colors.blue}}>{c.phone}</span><br />
<span style={{color: colors.subtext}}>{c.address}</span><br />
<em style={{color: colors.text}}>{c.service}</em>
</div>
))}
</div>
)}

{tab === 'Inventory' && (
<div>
<h2 style={s.sectionTitle}>➕ Add Item</h2>
<div style={s.label}>Item Name</div>
<input style={s.input} placeholder="Item name" value={item.name} onChange={e => setItem({...item, name: e.target.value})} />
<div style={s.label}>Cost ($)</div>
<input style={s.input} placeholder="0.00" type="number" value={item.cost} onChange={e => setItem({...item, cost: e.target.value})} />
<button style={s.btn} onClick={addItem}>Add Item</button>
<h2 style={{...s.sectionTitle, marginTop: 24}}>📦 Items ({inventory.length})</h2>
{inventory.length === 0 && <p style={{color: colors.subtext}}>No items yet.</p>}
{inventory.map(i => (
<div key={i.id} style={s.card}>
<span style={{color: colors.text}}>{i.name}</span> —{' '}
<strong style={{color: colors.accent}}>${parseFloat(i.cost).toFixed(2)}</strong>
</div>
))}
<div style={s.total}>💰 Total: ${total.toFixed(2)}</div>
</div>
)}

{tab === 'Time Clock' && (
<div>
<h2 style={s.sectionTitle}>⏱ Start Job</h2>
<div style={s.label}>Employee Name</div>
<input style={s.input} placeholder="Employee name" value={employee} onChange={e => setEmployee(e.target.value)} />
<div style={s.label}>Job Description</div>
<input style={s.input} placeholder="e.g. Full detail - Honda Civic" value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
<button style={s.btn} onClick={clockIn}>Start Job</button>
<h2 style={{...s.sectionTitle, marginTop: 24}}>📋 Job Entries</h2>
{clocks.length === 0 && <p style={{color: colors.subtext}}>No jobs yet.</p>}
{clocks.map(c => (
<div key={c.id} style={s.card}>
<strong style={{color: colors.accent}}>{c.employee}</strong><br />
<span style={{color: colors.text}}>{c.job}</span><br />
<span style={{color: colors.blue}}>Started: {c.time_in}</span><br />
{c.time_out
? <span style={{color: '#00ff99'}}>Finished: {c.time_out}</span>
: <button style={{...s.btnBlue, marginTop: 8}} onClick={() => clockOut(c.id)}>Finish Job</button>
}
</div>
))}
</div>
)}

{tab === 'Calendar' && (
<div>
<h2 style={s.sectionTitle}>➕ Add Appointment</h2>
<div style={s.label}>Title</div>
<input style={s.input} placeholder="e.g. Full detail - John's truck" value={event.title} onChange={e => setEvent({...event, title: e.target.value})} />
<div style={s.label}>Date</div>
<input style={s.input} type="date" value={event.date} onChange={e => setEvent({...event, date: e.target.value})} />
<div style={s.label}>Time</div>
<input style={s.input} type="time" value={event.time} onChange={e => setEvent({...event, time: e.target.value})} />
<div style={s.label}>Notes</div>
<input style={s.input} placeholder="Any extra notes" value={event.notes} onChange={e => setEvent({...event, notes: e.target.value})} />
<button style={s.btn} onClick={addEvent}>Add Appointment</button>
<h2 style={{...s.sectionTitle, marginTop: 24}}>📅 Upcoming Appointments ({events.length})</h2>
{events.length === 0 && <p style={{color: colors.subtext}}>No appointments yet.</p>}
{events.map(ev => (
<div key={ev.id} style={s.calCard}>
<strong style={{color: colors.accent}}>{ev.title}</strong><br />
<span style={{color: colors.blue}}>📅 {ev.date} {ev.time && `@ ${ev.time}`}</span><br />
{ev.notes && <em style={{color: colors.subtext}}>{ev.notes}</em>}
</div>
))}
</div>
)}

{tab === 'Goals' && (
<div>
<h2 style={s.sectionTitle}>🎯 Add Goal</h2>
<div style={s.label}>Goal</div>
<input style={s.input} placeholder="e.g. Book 10 details this month" value={goal.text} onChange={e => setGoal({...goal, text: e.target.value})} />
<div style={s.label}>Timeframe</div>
<select style={s.input} value={goal.period} onChange={e => setGoal({...goal, period: e.target.value})}>
<option value="Weekly">Weekly</option>
<option value="Monthly">Monthly</option>
<option value="Yearly">Yearly</option>
</select>
<button style={s.btn} onClick={addGoal}>Add Goal</button>
{['Weekly', 'Monthly', 'Yearly'].map(period => (
<div key={period}>
<h2 style={{...s.sectionTitle, marginTop: 24}}>{period} Goals</h2>
{goals.filter(g => g.period === period).length === 0 && <p style={{color: colors.subtext}}>No {period.toLowerCase()} goals yet.</p>}
{goals.filter(g => g.period === period).map(g => (
<div key={g.id} style={{...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
<span style={{color: g.done ? '#00ff99' : colors.text, textDecoration: g.done ? 'line-through' : 'none'}}>{g.text}</span>
<button style={g.done ? {...s.btnBlue, background: '#00ff99', color: '#000'} : s.btnBlue} onClick={() => toggleGoal(g.id, g.done)}>
{g.done ? '✅' : 'Done'}
</button>
</div>
))}
</div>
))}
</div>
)}

</div>
)
}
