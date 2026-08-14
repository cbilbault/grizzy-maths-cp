import { useEffect, useMemo, useState } from 'react'
import type { Exercise, Scaffold } from '../../engine/types'
import { compareRelation, compareWord, sameAnswer } from '../../engine/validate'
import { numberToFrench } from '../../lib/french'
import { BigButton, Cube, Grizzy, Items, Jar, Lemming, PadScreen } from '../kid/ui'

export function ExerciseView({
  ex,
  scaffold,
  leftHanded,
  onResult,
}: {
  ex: Exercise
  scaffold: Scaffold
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  return (
    <div className="flex min-h-0 w-full flex-1">
      <ExerciseInner ex={ex} scaffold={scaffold} leftHanded={leftHanded} onResult={onResult} />
    </div>
  )
}

function ExerciseInner({
  ex,
  scaffold,
  leftHanded,
  onResult,
}: {
  ex: Exercise
  scaffold: Scaffold
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  switch (ex.type) {
    case 'count':
      return <CountView ex={ex} onResult={onResult} />
    case 'build-collection':
      return <BuildView ex={ex} onResult={onResult} />
    case 'group-ten':
      return <GroupTenView ex={ex} onResult={onResult} />
    case 'match-reps':
      return <MatchRepsView ex={ex} onResult={onResult} />
    case 'compare':
      return <CompareView ex={ex} onResult={onResult} />
    case 'number-line':
      return <NumberLineView ex={ex} onResult={onResult} />
    case 'ordinal':
      return <OrdinalView ex={ex} onResult={onResult} />
    case 'write-digits':
      return <WriteView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'hole-equality':
      return <HoleView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'fluency':
      return <FluencyView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'procedure-slate':
      return <SlateView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'column-add':
      return <ColumnView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'problem-4ph':
      return <ProblemView ex={ex} scaffold={scaffold} leftHanded={leftHanded} onResult={onResult} />
    case 'share':
      return <ShareView ex={ex} onResult={onResult} />
    case 'times-as-add':
      return <TimesView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'half-quarter':
      return <HalfView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'length':
      return <LengthView ex={ex} onResult={onResult} />
    case 'mass':
      return <MassView ex={ex} onResult={onResult} />
    case 'money':
      return <MoneyView ex={ex} onResult={onResult} />
    case 'clock':
      return <ClockView ex={ex} onResult={onResult} />
    case 'shape':
      return <ShapeView ex={ex} onResult={onResult} />
    case 'grid-draw':
      return <GridView ex={ex} onResult={onResult} />
    case 'solid':
      return <SolidView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'move-code':
      return <MoveView ex={ex} onResult={onResult} />
    case 'tally-table':
      return <TallyView ex={ex} leftHanded={leftHanded} onResult={onResult} />
    case 'bar-chart':
      return <BarView ex={ex} leftHanded={leftHanded} onResult={onResult} />
  }
}

function CountView({ ex, onResult }: { ex: Extract<Exercise, { type: 'count' }>; onResult: (ok: boolean) => void }) {
  const [marked, setMarked] = useState<boolean[]>(() => Array(ex.count).fill(false))
  const n = marked.filter(Boolean).length
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-3">
      <Items
        kind={ex.item}
        n={ex.count}
        marked={marked}
        onTap={(i) =>
          setMarked((m) => {
            const next = [...m]
            next[i] = !next[i]
            return next
          })
        }
      />
      <p className="rounded-full bg-cream/90 px-4 py-1 text-3xl font-bold">{n}</p>
      <BigButton onClick={() => onResult(n === ex.count)}>C’est bon</BigButton>
    </div>
  )
}

function BuildView({ ex, onResult }: { ex: Extract<Exercise, { type: 'build-collection' }>; onResult: (ok: boolean) => void }) {
  const [given, setGiven] = useState(0)
  return (
    <div className="flex flex-1 flex-col items-center gap-3 p-3">
      <div className="flex items-end gap-4">
        <Grizzy className="h-36" />
        <div className="min-h-20 min-w-28 rounded-2xl bg-cream/90 p-2">
          <Items kind={ex.item} n={given} />
        </div>
      </div>
      <p className="text-lg font-semibold text-cream drop-shadow">Donne {ex.target}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: ex.pool - given }, (_, i) => (
          <Items key={i} kind={ex.item} n={1} onTap={() => setGiven((g) => g + 1)} />
        ))}
      </div>
      <div className="flex gap-2">
        <BigButton tone="cream" onClick={() => setGiven((g) => Math.max(0, g - 1))}>
          −
        </BigButton>
        <BigButton onClick={() => onResult(given === ex.target)}>C’est bon</BigButton>
      </div>
    </div>
  )
}

function GroupTenView({ ex, onResult }: { ex: Extract<Exercise, { type: 'group-ten' }>; onResult: (ok: boolean) => void }) {
  const tens = Math.floor(ex.total / 10)
  const units = ex.total % 10
  const [value, setValue] = useState('')
  return (
    <PadScreen value={value} onChange={setValue} onSubmit={() => onResult(Number(value) === ex.total)}>
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: tens }, (_, i) => (
          <div key={i} className="rounded-xl bg-wood/80 p-1">
            <div className="grid grid-cols-5 gap-0.5">
              {Array.from({ length: 10 }, (__, j) => (
                <Lemming key={j} className="h-7 w-7" />
              ))}
            </div>
            <p className="text-center text-xs text-cream">10</p>
          </div>
        ))}
        {units > 0 && (
          <div className="rounded-xl bg-cream/80 p-1">
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: units }, (_, j) => (
                <Lemming key={j} className="h-7 w-7" />
              ))}
            </div>
            <p className="text-center text-xs">{units}</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xl font-semibold text-bark">Combien en tout ?</p>
    </PadScreen>
  )
}

function MatchRepsView({ ex, onResult }: { ex: Extract<Exercise, { type: 'match-reps' }>; onResult: (ok: boolean) => void }) {
  const tens = Math.floor(ex.value / 10)
  const units = ex.value % 10
  const decoy = ex.value === 32 ? 23 : ex.value % 10 === 0 ? ex.value + 1 : (ex.value % 10) * 10 + Math.floor(ex.value / 10)
  const cards = useMemo(
    () =>
      [
        { id: 'ok', label: String(ex.value), ok: true },
        { id: 'fr', label: numberToFrench(ex.value), ok: true },
        { id: 'add', label: `${tens * 10} + ${units}`, ok: true },
        { id: 'ko', label: String(decoy > 9 ? decoy : ex.value + 10), ok: false },
      ].sort((a, b) => a.id.localeCompare(b.id)),
    [ex.value, decoy, tens, units],
  )
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  return (
    <div className="flex flex-1 flex-col items-center gap-3 p-3">
      <div className="flex gap-1">
        {Array.from({ length: tens }, (_, i) => (
          <div key={i} className="flex flex-col">
            {Array.from({ length: 10 }, (__, j) => (
              <Cube key={j} className="h-4 w-4" />
            ))}
          </div>
        ))}
        <div className="flex flex-col">
          {Array.from({ length: units }, (_, j) => (
            <Cube key={j} className="h-4 w-4" marked />
          ))}
        </div>
      </div>
      <p className="text-cream">Touche les 3 cartes du même nombre</p>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((c) => (
          <BigButton key={c.id} tone={picked.includes(c.id) ? 'moss' : 'cream'} onClick={() => toggle(c.id)}>
            {c.label}
          </BigButton>
        ))}
      </div>
      <BigButton
        onClick={() => {
          const okIds = cards.filter((c) => c.ok).map((c) => c.id)
          onResult(okIds.every((id) => picked.includes(id)) && picked.length === 3)
        }}
      >
        C’est bon
      </BigButton>
    </div>
  )
}

function CompareView({ ex, onResult }: { ex: Extract<Exercise, { type: 'compare' }>; onResult: (ok: boolean) => void }) {
  const words = [
    { v: 'moins', label: 'moins' },
    { v: 'autant', label: 'autant' },
    { v: 'plus', label: 'plus' },
  ]
  const signs = [
    { v: '<', label: '<' },
    { v: '=', label: '=' },
    { v: '>', label: '>' },
  ]
  const opts = ex.mode === 'words' ? words : signs
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-3">
      <div className="flex w-full items-start justify-around gap-4">
        <div className="rounded-2xl bg-cream/90 p-2">
          <Items kind={ex.item} n={Math.min(ex.left, 12)} />
          <p className="text-center text-2xl font-bold">{ex.left}</p>
        </div>
        <div className="rounded-2xl bg-cream/90 p-2">
          <Items kind={ex.item} n={Math.min(ex.right, 12)} />
          <p className="text-center text-2xl font-bold">{ex.right}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {opts.map((o) => (
          <BigButton
            key={o.v}
            onClick={() =>
              onResult(
                ex.mode === 'words'
                  ? o.v === compareWord(ex.left, ex.right)
                  : o.v === compareRelation(ex.left, ex.right),
              )
            }
          >
            {o.label}
          </BigButton>
        ))}
      </div>
    </div>
  )
}

function NumberLineView({ ex, onResult }: { ex: Extract<Exercise, { type: 'number-line' }>; onResult: (ok: boolean) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <p className="rounded-full bg-cream/90 px-4 py-1 text-xl">Place {ex.target}</p>
      <div className="flex w-full max-w-xl items-end justify-between px-2">
        {Array.from({ length: ex.max - ex.min + 1 }, (_, i) => {
          const n = ex.min + i
          return (
            <button
              key={n}
              type="button"
              onClick={() => onResult(n === ex.target)}
              className="flex flex-col items-center"
            >
              <span className="h-6 w-1 bg-cream" />
              <span className="text-xs text-cream">{n}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OrdinalView({ ex, onResult }: { ex: Extract<Exercise, { type: 'ordinal' }>; onResult: (ok: boolean) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-3">
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: ex.total }, (_, i) => (
          <button key={i} type="button" onClick={() => onResult(i + 1 === ex.rank)}>
            <Lemming className="h-14 w-14" />
          </button>
        ))}
      </div>
    </div>
  )
}

function WriteView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'write-digits' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.value)}>
      <Grizzy className="h-28 sm:h-36" />
      <p className="mt-2 rounded-2xl bg-white px-4 py-2 text-2xl font-bold text-bark sm:text-3xl">{ex.spoken}</p>
    </PadScreen>
  )
}

function HoleView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'hole-equality' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  return (
    <PadScreen
      value={v}
      onChange={setV}
      leftHanded={leftHanded}
      onSubmit={() => onResult(sameAnswer(ex.answer, Number(v)))}
    >
      <p className="rounded-2xl bg-white px-6 py-3 text-4xl font-bold text-bark sm:text-5xl">{ex.promptShort}</p>
    </PadScreen>
  )
}

function FluencyView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'fluency' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [left, setLeft] = useState(ex.seconds)
  const [v, setV] = useState('')
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (left <= 0) onResult(ok >= 4)
  }, [left, ok, onResult])
  const item = ex.items[i]
  if (!item || left <= 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-cream">
        <p className="text-3xl">{ok} réussites</p>
        <BigButton onClick={() => onResult(ok >= 4)}>Continuer</BigButton>
      </div>
    )
  }
  return (
    <PadScreen
      value={v}
      onChange={setV}
      leftHanded={leftHanded}
      onSubmit={() => {
        const good = sameAnswer(item.answer, Number(v))
        if (good) setOk((n) => n + 1)
        setV('')
        setI((n) => n + 1)
      }}
    >
      <p className="text-lg font-semibold text-bark">
        {left} s · {ok} justes
      </p>
      <p className="rounded-2xl bg-white px-6 py-3 text-4xl font-bold text-bark sm:text-5xl">{item.promptShort}</p>
    </PadScreen>
  )
}

function SlateView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'procedure-slate' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [step, setStep] = useState(0)
  const [v, setV] = useState('')
  const done = step >= ex.steps.length
  const slate = (
    <div className="w-full max-w-lg rounded-3xl bg-[#1b3a2a] p-4 text-cream shadow-inner">
      <p className="text-3xl font-bold text-honey">
        {ex.start} + {ex.add}
      </p>
      {ex.steps.slice(0, step + (done ? 0 : 1)).map((s) => (
        <p key={s} className="mt-2 text-lg">
          {s}
        </p>
      ))}
    </div>
  )
  if (!done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-3">
        {slate}
        <BigButton onClick={() => setStep((s) => s + 1)}>Ensuite</BigButton>
      </div>
    )
  }
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      {slate}
      <p className="mt-2 text-xl font-semibold text-bark">Écris le résultat</p>
    </PadScreen>
  )
}

function ColumnView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'column-add' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  const pad = (n: number) => String(n).padStart(2, ' ')
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      <pre className="rounded-2xl bg-white p-4 font-mono text-4xl leading-tight text-bark">
        {`  ${pad(ex.terms[0])}\n+ ${pad(ex.terms[1])}\n───`}
      </pre>
    </PadScreen>
  )
}

function ProblemView({
  ex,
  scaffold,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'problem-4ph' }>
  scaffold: Scaffold
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [phase, setPhase] = useState(0)
  const [v, setV] = useState('')
  const [reg, setReg] = useState<boolean | null>(null)
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex justify-center gap-2 text-sm text-cream">
        {['Comprendre', 'Modéliser', 'Calculer', 'Répondre'].map((p, i) => (
          <span key={p} className={`rounded-full px-2 py-1 ${i === phase ? 'bg-honey text-bark' : 'bg-bark/50'}`}>
            {p}
          </span>
        ))}
      </div>
      {phase === 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="max-w-xl rounded-2xl bg-cream/95 p-4 text-xl">{ex.story}</p>
          {ex.understandOptions.map((o) => (
            <BigButton
              key={o.id}
              tone="cream"
              className="w-full max-w-xl text-left text-lg"
              onClick={() => {
                if (o.correct) setPhase(1)
                else onResult(false)
              }}
            >
              {o.label}
            </BigButton>
          ))}
        </div>
      )}
      {phase === 1 && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-cream">Range les nombres : parties et tout</p>
          <div className="flex items-end gap-3">
            <Box label="partie" n={ex.model.left} />
            <span className="text-3xl text-cream">+</span>
            <Box label="partie" n={ex.model.right} />
            <span className="text-3xl text-cream">=</span>
            <Box label="tout" n={ex.model.whole} />
          </div>
          {scaffold === 'manip' && (
            <Items kind="jar" n={Math.min(12, Number(ex.model.whole ?? ex.answer))} />
          )}
          <BigButton onClick={() => setPhase(2)}>Ensuite</BigButton>
        </div>
      )}
      {phase === 2 && (
        <PadScreen
          value={v}
          onChange={setV}
          leftHanded={leftHanded}
          onSubmit={() => {
            if (sameAnswer(ex.answer, Number(v))) setPhase(3)
            else onResult(false)
          }}
        >
          <p className="text-xl font-semibold text-bark">Quel nombre manque ?</p>
        </PadScreen>
      )}
      {phase === 3 && (
        <div className="flex flex-col items-center gap-3">
          <p className="rounded-2xl bg-cream p-4 text-xl">
            Réponse : {String(ex.answer)} {ex.unit}
          </p>
          <p className="text-cream">{ex.regulationQuestion}</p>
          <div className="flex gap-2">
            <BigButton
              tone="moss"
              onClick={() => {
                setReg(true)
                onResult(ex.regulationYes === true)
              }}
            >
              Oui
            </BigButton>
            <BigButton
              tone="wood"
              onClick={() => {
                setReg(false)
                onResult(ex.regulationYes === false)
              }}
            >
              Non
            </BigButton>
          </div>
          {reg !== null && <p className="text-cream">Merci, on vérifie toujours.</p>}
        </div>
      )}
    </div>
  )
}

function Box({ label, n }: { label: string; n: number | null }) {
  return (
    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-cream text-2xl font-bold">
      <span className="text-xs text-wood">{label}</span>
      {n === null ? '□' : n}
    </div>
  )
}

function ShareView({ ex, onResult }: { ex: Extract<Exercise, { type: 'share' }>; onResult: (ok: boolean) => void }) {
  const [piles, setPiles] = useState(() => Array(ex.groups).fill(0))
  const used = piles.reduce((a, b) => a + b, 0)
  return (
    <div className="flex flex-1 flex-col items-center gap-3 p-3">
      <p className="text-cream">
        Reste {ex.total - used} pots
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {piles.map((n, i) => (
          <button
            key={i}
            type="button"
            className="rounded-2xl bg-cream/90 p-2"
            onClick={() => {
              if (used >= ex.total) return
              setPiles((p) => {
                const next = [...p]
                next[i]++
                return next
              })
            }}
          >
            <Lemming className="h-12 w-12" />
            <Items kind="jar" n={n} />
          </button>
        ))}
      </div>
      <BigButton
        onClick={() => {
          const each = ex.total / ex.groups
          onResult(piles.every((n) => n === each) && used === ex.total)
        }}
      >
        C’est bon
      </BigButton>
    </div>
  )
}

function TimesView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'times-as-add' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: ex.groups }, (_, i) => (
          <div key={i} className="rounded-xl bg-white p-1">
            <Items kind="jar" n={ex.each} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-2xl font-bold text-bark">
        {ex.groups} fois {ex.each} = ?
      </p>
    </PadScreen>
  )
}

function HalfView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'half-quarter' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  const parts = ex.kind === 'quart' ? 4 : 2
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-honey shadow-inner sm:h-40 sm:w-40">
        {Array.from({ length: parts }, (_, i) => (
          <div
            key={i}
            className="absolute inset-0 origin-bottom-right border-l-2 border-bark/40"
            style={{ transform: `rotate(${(360 / parts) * i}deg)` }}
          />
        ))}
      </div>
      <p className="mt-2 text-2xl font-bold text-bark">
        {ex.kind === 'quart' ? 'Un quart' : 'La moitié'} de {ex.whole}
      </p>
    </PadScreen>
  )
}

function LengthView({ ex, onResult }: { ex: Extract<Exercise, { type: 'length' }>; onResult: (ok: boolean) => void }) {
  if (ex.mode === 'measure') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <div className="w-full max-w-lg">
          <div className="h-4 rounded bg-glacier" style={{ width: `${ex.leftCm * 10}%` }} />
          <div className="mt-1 flex justify-between text-xs text-cream">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <BigButton key={i} tone="cream" onClick={() => onResult(i + 1 === ex.leftCm)}>
              {i + 1} cm
            </BigButton>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <button type="button" className="w-4/5" onClick={() => onResult(ex.answer === 1)}>
        <div className="h-5 rounded-full bg-honey" style={{ width: `${ex.leftCm * 10}%` }} />
      </button>
      <button type="button" className="w-4/5" onClick={() => onResult(ex.answer === 2)}>
        <div className="h-5 rounded-full bg-glacier" style={{ width: `${ex.rightCm * 10}%` }} />
      </button>
      <BigButton tone="cream" onClick={() => onResult(ex.answer === 0)}>
        autant
      </BigButton>
    </div>
  )
}

function MassView({ ex, onResult }: { ex: Extract<Exercise, { type: 'mass' }>; onResult: (ok: boolean) => void }) {
  const tilt = ex.left === ex.right ? 0 : ex.left > ex.right ? -8 : 8
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <div className="text-cream" style={{ transform: `rotate(${tilt}deg)` }}>
        <div className="flex items-end gap-10">
          <button type="button" onClick={() => onResult(ex.answer === 1)} className="flex flex-col items-center">
            <div className="h-16 w-20 rounded-md bg-cream" />
            <Items kind="jar" n={Math.min(ex.left, 6)} />
          </button>
          <div className="h-2 w-40 bg-wood" />
          <button type="button" onClick={() => onResult(ex.answer === 2)} className="flex flex-col items-center">
            <div className="h-16 w-20 rounded-md bg-cream" />
            <Items kind="cube" n={Math.min(ex.right, 6)} />
          </button>
        </div>
      </div>
      <BigButton tone="cream" onClick={() => onResult(ex.answer === 0)}>
        autant
      </BigButton>
    </div>
  )
}

function MoneyView({ ex, onResult }: { ex: Extract<Exercise, { type: 'money' }>; onResult: (ok: boolean) => void }) {
  const coins = [1, 2, 5, 10]
  const [sum, setSum] = useState(0)
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-3">
      <p className="rounded-full bg-cream px-4 py-2 text-3xl font-bold">{sum} € / {ex.target} €</p>
      <div className="flex gap-3">
        {coins.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSum((s) => s + c)}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold shadow ${
              c >= 5 ? 'bg-honey' : 'bg-zinc-300'
            }`}
          >
            {c}€
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <BigButton tone="cream" onClick={() => setSum(0)}>
          Recommencer
        </BigButton>
        <BigButton onClick={() => onResult(sum === ex.target)}>C’est bon</BigButton>
      </div>
    </div>
  )
}

function ClockView({ ex, onResult }: { ex: Extract<Exercise, { type: 'clock' }>; onResult: (ok: boolean) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-3">
      <div className="relative h-56 w-56 rounded-full border-8 border-wood bg-cream">
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1
          const a = ((n * 30 - 90) * Math.PI) / 180
          const x = 96 + Math.cos(a) * 80
          const y = 96 + Math.sin(a) * 80
          return (
            <button
              key={n}
              type="button"
              style={{ left: x, top: y }}
              className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-honey text-lg font-bold"
              onClick={() => onResult(n === ex.hour)}
            >
              {n}
            </button>
          )
        })}
        <div className="absolute left-1/2 top-1/2 h-16 w-1 origin-bottom -translate-x-1/2 -translate-y-full bg-bark" />
      </div>
    </div>
  )
}

function ShapeSvg({ name }: { name: 'carré' | 'rectangle' | 'triangle' | 'cercle' }) {
  if (name === 'carré') return <rect x="20" y="20" width="80" height="80" fill="#5BB4D4" stroke="#3a2414" strokeWidth="4" />
  if (name === 'rectangle') return <rect x="10" y="30" width="100" height="60" fill="#E8A317" stroke="#3a2414" strokeWidth="4" />
  if (name === 'triangle') return <polygon points="60,15 110,105 10,105" fill="#3d7a52" stroke="#3a2414" strokeWidth="4" />
  return <circle cx="60" cy="60" r="42" fill="#fff6e4" stroke="#3a2414" strokeWidth="4" />
}

function ShapeView({ ex, onResult }: { ex: Extract<Exercise, { type: 'shape' }>; onResult: (ok: boolean) => void }) {
  return (
    <div className="grid flex-1 grid-cols-2 content-center gap-3 p-4">
      {ex.options.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onResult(s === ex.target)}
          className="rounded-2xl bg-cream/90 p-2"
        >
          <svg viewBox="0 0 120 120" className="mx-auto h-24 w-24">
            <ShapeSvg name={s} />
          </svg>
        </button>
      ))}
    </div>
  )
}

function GridView({ ex, onResult }: { ex: Extract<Exercise, { type: 'grid-draw' }>; onResult: (ok: boolean) => void }) {
  const [cells, setCells] = useState(() => Array(ex.size * ex.size).fill(false))
  return (
    <div className="flex flex-1 items-center justify-center gap-6 p-3">
      <div>
        <p className="mb-1 text-center text-cream">modèle</p>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${ex.size}, 2rem)` }}>
          {ex.pattern.map((on, i) => (
            <div key={i} className={`h-8 w-8 rounded ${on ? 'bg-honey' : 'bg-cream/50'}`} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-center text-cream">toi</p>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${ex.size}, 2rem)` }}>
          {cells.map((on, i) => (
            <button
              key={i}
              type="button"
              className={`h-8 w-8 rounded ${on ? 'bg-honey' : 'bg-cream'}`}
              onClick={() =>
                setCells((c) => {
                  const n = [...c]
                  n[i] = !n[i]
                  return n
                })
              }
            />
          ))}
        </div>
        <BigButton
          className="mt-3"
          onClick={() => onResult(cells.every((v, i) => v === ex.pattern[i]))}
        >
          C’est bon
        </BigButton>
      </div>
    </div>
  )
}

function SolidView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'solid' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      <div className={`h-28 ${ex.solid === 'cube' ? 'w-28' : 'w-40'} bg-honey shadow-[8px_8px_0_#8b5a33]`} />
    </PadScreen>
  )
}

function MoveView({ ex, onResult }: { ex: Extract<Exercise, { type: 'move-code' }>; onResult: (ok: boolean) => void }) {
  const [pos, setPos] = useState(ex.start)
  const [steps, setSteps] = useState(0)
  const move = (d: 'H' | 'B' | 'G' | 'D') => {
    setPos(([x, y]) => {
      let nx = x
      let ny = y
      if (d === 'H') ny--
      if (d === 'B') ny++
      if (d === 'G') nx--
      if (d === 'D') nx++
      nx = Math.max(0, Math.min(ex.cols - 1, nx))
      ny = Math.max(0, Math.min(ex.rows - 1, ny))
      const next: [number, number] = [nx, ny]
      const n = steps + 1
      setSteps(n)
      if (nx === ex.goal[0] && ny === ex.goal[1]) {
        setTimeout(() => onResult(true), 200)
      }
      return next
    })
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-3">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${ex.cols}, 3.5rem)` }}>
        {Array.from({ length: ex.rows * ex.cols }, (_, i) => {
          const x = i % ex.cols
          const y = Math.floor(i / ex.cols)
          const here = pos[0] === x && pos[1] === y
          const goal = ex.goal[0] === x && ex.goal[1] === y
          return (
            <div key={i} className="flex h-14 w-14 items-center justify-center rounded-lg bg-cream/80">
              {here && <Lemming className="h-12 w-12" />}
              {goal && !here && <Jar className="h-10 w-10" />}
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span />
        <BigButton onClick={() => move('H')}>↑</BigButton>
        <span />
        <BigButton onClick={() => move('G')}>←</BigButton>
        <BigButton onClick={() => move('B')}>↓</BigButton>
        <BigButton onClick={() => move('D')}>→</BigButton>
      </div>
    </div>
  )
}

function TallyView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'tally-table' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  return (
    <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
      <table className="overflow-hidden rounded-2xl bg-white text-xl">
        <tbody>
          {ex.labels.map((l, i) => (
            <tr key={l} className="border-b border-wood/20">
              <td className="px-3 py-2">{l}</td>
              <td className="px-3 py-2 tracking-widest">
                {'|||| '.repeat(Math.floor(ex.counts[i] / 5)) + '|'.repeat(ex.counts[i] % 5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PadScreen>
  )
}

function BarView({
  ex,
  leftHanded,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'bar-chart' }>
  leftHanded: boolean
  onResult: (ok: boolean) => void
}) {
  const [v, setV] = useState('')
  const chart = (
    <div className="flex items-end gap-4 rounded-2xl bg-white p-4">
      {ex.values.map((n, i) => (
        <button
          key={ex.labels[i]}
          type="button"
          className="flex flex-col items-center"
          onClick={() => {
            if (ex.mode === 'max') onResult(i === ex.answer)
          }}
        >
          <div className="flex flex-col-reverse gap-0.5">
            {Array.from({ length: n }, (_, k) => (
              <Cube key={k} className="h-6 w-6" />
            ))}
          </div>
          <span className="mt-1 text-sm">{ex.labels[i]}</span>
        </button>
      ))}
    </div>
  )
  if (ex.mode === 'value') {
    return (
      <PadScreen value={v} onChange={setV} leftHanded={leftHanded} onSubmit={() => onResult(Number(v) === ex.answer)}>
        {chart}
      </PadScreen>
    )
  }
  return <div className="flex flex-1 flex-col items-center justify-center p-3">{chart}</div>
}
