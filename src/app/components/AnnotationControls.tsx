import useAnnotations from './useAnnotations'

export default function AnnotationControls (): React.ReactNode {
  const opts = useAnnotations()
  return (
    <div className="flex gap-4 p-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="dynamic"
          defaultChecked={opts.isDynamic}
          onChange={opts.handleCheck} />
        Make Dynamic
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="annotation"
          defaultChecked={opts.showAnnotations}
          onChange={opts.handleCheck} />
        Show Annotations
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="mass"
          defaultChecked={opts.showMass}
          onChange={opts.handleCheck} />
        Show Mass
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="lCom"
          defaultChecked={opts.showLocalCom}
          onChange={opts.handleCheck} />
        Show Local COM
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="wCom"
          defaultChecked={opts.showWorldCom}
          onChange={opts.handleCheck} />
        Show World COM
      </label>
    </div>
  )
}