import { useState } from 'react'

const TABS = ['Customers', 'Inventory', 'Time Clock']

export default function App() {
const [tab, setTab] = useState('Customers')
const [customers, setCustomers] = useState([])
const [form, setForm] = useState({ name: '', phone: '', address: '', service: '' })
const [inventory, setInventory] = useState([])
const [item, setItem] = useState({ name: '', cost: '' })
const [clocks, setClocks] = useState([])
const [employee, setEmployee] = useState('')

const addCustomer = () => {
if (!form.name) return
setCustomers([...customers, { ...form, id: Date.now() }])
setForm({ name: '', phone: '', address: '', service: '' })
}

const addItem = () => {
if (!item.name) return
setInventory([...inventory, { ...item, id: Date.now() }])
setItem({ name: '', cost: '' })
}

const clockIn = () => {
if (!employee) return
setClocks([...clocks, { employee, in: new Date().toLocaleTimeString(), out: null, id: Date.now() }])
setEmployee('')
}

const clockOut = (id) => {
setClocks(clocks.map(c => c.id === id && !c.out ? { ...c, out: new Date().toLocaleTimeString() } : c))
}

const total = inventory.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0)

const s = {
app: { fontFamily: 'Arial', maxWidth: 600, margin: '0 auto', padding: 20 },
tabs: { display: 'flex', gap: 10, marginBottom: 20 },
tab: { padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: 6, background: '#f5f5f5' },
activeTab: { padding: '8px 16px', cursor: 'pointer', border: '1px solid #000', borderRadius: 6, background: '#000', color: '#fff' },
input: { padding: 8, border: '1px solid #ccc', borderRadius: 6, width: '100%', marginBottom: 8, boxSizing: 'border-box' },
btn: { padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
card: { border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 10 },
}

return (
<div style={s.app}>
<h1 style={{ marginBottom: 20 }}>Tyme2Shine Mobile Detailing</h1>
<div style={s.tabs}>
{TABS.map(t => (
<button key={t} style={tab === t ? s.activeTab : s.tab} onClick={() => setTab(t)}>{t}</button>
))}
</div>

{tab === 'Customers' && (
<div>
<h2>Add Customer</h2>
<input style={s.input} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
<input style={s.input} placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
<input style={s.input} placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
<input style={s.input} placeholder="Service description" value={form.service} onChange={e => setForm({...form, service: e.target.value})} />
<button style={s.btn} onClick={addCustomer}>Add Customer</button>
<h2 style={{ marginTop: 20 }}>Customers ({customers.length})</h2>
{customers.map(c => (
<div key={c.id} style={s.card}>
<strong>{c.name}</strong> — {c.phone}<br />
{c.address}<br />
<em>{c.service}</em>
</div>
))}
</div>
)}

{tab === 'Inventory' && (
<div>
<h2>Add Item</h2>
<input style={s.input} placeholder="Item name" value={item.name} onChange={e => setItem({...item, name: e.target.value})} />
<input style={s.input} placeholder="Cost ($)" type="number" value={item.cost} onChange={e => setItem({...item, cost: e.target.value})} />
<button style={s.btn} onClick={addItem}>Add Item</button>
<h2 style={{ marginTop: 20 }}>Items ({inventory.length})</h2>
{inventory.map(i => (
<div key={i.id} style={s.card}>
{i.name} — <strong>${parseFloat(i.cost).toFixed(2)}</strong>
</div>
))}
<div style={{ marginTop: 10, fontSize: 18 }}>
<strong>Total: ${total.toFixed(2)}</strong>
</div>
</div>
)}

{tab === 'Time Clock' && (
<div>
<h2>Clock In</h2>
<input style={s.input} placeholder="Employee name" value={employee} onChange={e => setEmployee(e.target.value)} />
<button style={s.btn} onClick={clockIn}>Clock In</button>
<h2 style={{ marginTop: 20 }}>Time Entries</h2>
{clocks.map(c => (
<div key={c.id} style={s.card}>
<strong>{c.employee}</strong><br />
In: {c.in}<br />
Out: {c.out || <button style={{...s.btn, marginTop: 6}} onClick={() => clockOut(c.id)}>Clock Out</button>}
</div>
))}
</div>
)}
</div>
)
}
