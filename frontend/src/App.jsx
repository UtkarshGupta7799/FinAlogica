import React, { useState, useMemo } from 'react'
import { useListSpeciesQuery, usePredictMutation, useRecommendQuery } from './app/services.js'

export default function App() {
  const { data: species = [], isLoading: loadingSpecies } = useListSpeciesQuery()
  const [predict, { data: pred, isLoading: loadingPredict, error: predErr }] = usePredictMutation()

  const [file, setFile] = useState(null)
  const [lat, setLat] = useState(23.25)
  const [lon, setLon] = useState(77.41)

  const top = pred?.predictions?.[0]?.label || null
  const { data: rec, isFetching: loadingRec, error: recErr, refetch } =
    useRecommendQuery({ lat, lon, species: top ?? 'tench' }, { skip: !top })

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  const handlePredict = async () => {
    if (!file) return
    try {
      await predict(file).unwrap()
    } catch (e) {
      // handled by RTK Query error state
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="py-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐟</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">FinAlogica</h1>
              <p className="text-sm text-slate-500 mt-1">AI-powered Fish Identification & Weather-Aware Recommendations</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Actions */}
          <div className="space-y-6">

            {/* 1. Upload & Predict */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-800">1. Identify Fish</h3>
                <p className="text-sm text-slate-500">Upload a photo to detect species</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer
                        "
                      />
                    </label>
                    <button
                      onClick={handlePredict}
                      disabled={!file || loadingPredict}
                      className={`
                        w-full py-2.5 px-4 rounded-xl font-medium shadow-sm transition-all
                        ${!file || loadingPredict
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                        }
                      `}
                    >
                      {loadingPredict ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </span>
                      ) : 'Analyze Image'}
                    </button>
                    {predErr && (
                      <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                        Prediction failed. Check connection.
                      </div>
                    )}
                  </div>

                  {/* Preview Area */}
                  <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-sm">No image selected</span>
                    )}
                  </div>
                </div>

                {/* Result */}
                {pred && (
                  <div className="mt-4 animate-fade-in">
                    <div className="p-4 bg-slate-900 rounded-xl text-slate-200 overflow-x-auto text-xs font-mono mb-3">
                      <pre>{JSON.stringify(pred, null, 2)}</pre>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-800 p-4 rounded-xl border border-green-100">
                      <span className="text-xl">🎯</span>
                      <div className="font-medium">
                        Identified as: <span className="font-bold text-green-900 uppercase">{top}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. Recommendations */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-800">2. Smart Recommendations</h3>
                <p className="text-sm text-slate-500">Based on species & local weather</p>
              </div>

              <div className="p-6">
                {!top && (
                  <div className="text-slate-500 text-sm italic mb-4 flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">Info</span>
                    Identify a fish first to unlock recommendations
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value || '0'))}
                      disabled={!top}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lon}
                      onChange={(e) => setLon(parseFloat(e.target.value || '0'))}
                      disabled={!top}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  disabled={!top || loadingRec}
                  onClick={() => refetch()}
                  className={`
                     w-full py-2.5 px-4 rounded-xl font-medium shadow-sm transition-all
                     ${!top || loadingRec
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                    }
                   `}
                >
                  {loadingRec ? 'Generating Insights...' : 'Get Recommendations'}
                </button>

                {recErr && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    Recommendation service unavailable.
                  </div>
                )}

                {rec && (
                  <div className="mt-6">
                    <div className="p-4 bg-slate-900 rounded-xl text-slate-200 overflow-x-auto text-xs font-mono shadow-inner">
                      <pre>{JSON.stringify(rec, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Catalog */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full max-h-[800px] flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Species Catalog</h3>
                  <p className="text-sm text-slate-500">Supported fish database</p>
                </div>
                <div className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600 font-medium">
                  {species.length} species
                </div>
              </div>

              <div className="p-0 overflow-y-auto flex-1">
                {loadingSpecies ? (
                  <div className="p-8 text-center text-slate-400">Loading catalog...</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {species.map(s => (
                      <li key={s.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div>
                          <p className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{s.common_name}</p>
                          <p className="text-xs text-slate-400 italic">{s.scientific_name}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500">
                          ➜
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm py-8 border-t border-slate-200">
          <p className="mb-2">FinAlogica © 2024 • Local Demo</p>
          <div className="flex justify-center gap-4 text-xs font-mono bg-slate-100 inline-block px-4 py-2 rounded-full mx-auto">
            <span>API: :4000</span>
            <span className="text-slate-300">|</span>
            <span>ML: :8001</span>
          </div>
        </footer>

      </div>
    </div>
  )
}
