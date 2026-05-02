'use client'
// app/admin/tasks/bulk/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'

const EXAMPLE_CSV = `title,description,type,reward,requiredQty,instructions,proofType
Complete Brand Survey,Fill out a 5-min brand awareness survey,SURVEY,0.75,500,"1. Open the survey link\n2. Complete all questions\n3. Submit and screenshot confirmation",URL
Post on r/technology,Share a tech opinion post on Reddit,REDDIT_POST,1.50,200,"1. Go to r/technology\n2. Write a 100+ word post\n3. Copy the post URL",URL
Collect Local Menu Data,Gather 3 restaurant menus in your city,DATA_COLLECTION,2.00,150,"1. Visit 3 restaurant websites\n2. Copy menu items and prices\n3. Paste formatted data",TEXT`

export default function BulkUploadPage() {
  const router = useRouter()
  const [csvText, setCsvText] = useState('')
  const [parsed, setParsed] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  function parseCSV(text: string) {
    const lines = text.trim().split('\n')
    if (lines.length < 2) { setError('CSV must have a header row + at least 1 data row'); return }
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',')
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim().replace(/^"|"$/g, '')]))
    })
    setParsed(rows)
    setError('')
  }

  async function upload() {
    if (!parsed.length) return
    setLoading(true)
    const res = await fetch('/api/tasks/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: parsed }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setResult(`✅ ${data.created} tasks created successfully!`)
    setLoading(false)
    setTimeout(() => router.push('/admin/tasks'), 1500)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      setCsvText(text)
      parseCSV(text)
    }
    reader.readAsText(file)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/tasks" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Tasks</h1>
        <p className="text-gray-500 mt-1">Upload a CSV file to create multiple tasks at once</p>
      </div>

      {/* CSV format */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Required CSV Format</h2>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs text-green-400 font-mono">title, description, type, reward, requiredQty, instructions, proofType</pre>
          <div className="mt-2 text-xs text-gray-400 font-mono space-y-1">
            <p>type: SURVEY | REDDIT_POST | REDDIT_UPVOTE | DATA_COLLECTION | SOCIAL_MEDIA | APP_REVIEW | CONTENT_WRITING</p>
            <p>proofType: SCREENSHOT | URL | TEXT</p>
          </div>
        </div>
        <button
          className="mt-3 text-sm text-indigo-600 hover:underline"
          onClick={() => { setCsvText(EXAMPLE_CSV); parseCSV(EXAMPLE_CSV) }}
        >
          Load example CSV
        </button>
      </Card>

      <Card className="p-6 mb-6">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>
        <p className="text-xs text-gray-400 mb-3">— or paste CSV text directly —</p>
        <textarea
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Paste CSV content here..."
          value={csvText}
          onChange={e => { setCsvText(e.target.value); parseCSV(e.target.value) }}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </Card>

      {/* Preview */}
      {parsed.length > 0 && (
        <Card className="mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Preview — {parsed.length} task{parsed.length > 1 ? 's' : ''}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {Object.keys(parsed[0]).map(h => (
                    <th key={h} className="px-3 py-2 text-left text-gray-500 font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parsed.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="px-3 py-2 text-gray-700 max-w-xs truncate">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.length > 5 && <p className="text-center text-xs text-gray-400 py-2">...and {parsed.length - 5} more</p>}
          </div>
        </Card>
      )}

      {result && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 text-sm text-emerald-700">
          <CheckCircle size={16} /> {result}
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/admin/tasks"><Button variant="secondary" size="lg">Cancel</Button></Link>
        <Button
          size="lg"
          className="flex-1"
          disabled={parsed.length === 0}
          loading={loading}
          onClick={upload}
        >
          <Upload size={16} /> Upload {parsed.length > 0 ? `${parsed.length} Tasks` : ''}
        </Button>
      </div>
    </div>
  )
}
