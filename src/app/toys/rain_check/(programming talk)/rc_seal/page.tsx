import './styles.css'

/**
 * Copy: Want to become a better programmer? Join the Recurse Center!
 * Logo: Recurse logo
 * Visuals:
 *  - Circle containing shape
 *  - Thick paper sticker
 *  - Debossed black ink
 *  - Iridescent green ink/multi-color areas
 *   - Iridescent paper texture
 *  - type on a path around the circle?
 */

function RCLogo ({ size = 100 }: { size?: number }): React.ReactElement {
  return (
    <svg className="rc-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 15" height={size} width={size*0.8} fill="black">
          <rect x="0" y="0" width="12" height="1" />
          <rect x="0" y="0" width="1" height="10" />
          <rect x="11" y="0" width="1" height="10" />
          <rect x="0" y="9" width="12" height="1" />

          <rect x="4" y="9" width="4" height="3" />

          <rect x="1" y="11" width="10" height="1" />
          <rect x="1" y="11" width="1" height="4" />
          <rect x="10" y="11" width="1" height="4" />
          <rect x="1" y="14" width="10" height="1" />

          <rect x="0" y="12" width="2" height="3" />
          <rect x="10" y="12" width="2" height="3" />

          <rect x="10" y="12" width="2" height="3" />

          <rect x="1" y="11" width="2" height="2" />
          <rect x="4" y="11" width="1" height="2" />
          <rect x="6" y="11" width="1" height="2" />
          <rect x="8" y="11" width="1" height="2" />

          <rect x="9" y="13" width="2" height="2" />
          <rect x="7" y="13" width="1" height="2" />
          <rect x="5" y="13" width="1" height="2" />
          <rect x="3" y="13" width="1" height="2" />

        <rect x="2" y="2" width="8" height="6" />
    </svg>
      )
}

function RCLogoAccent ({ size = 100 }): React.ReactElement {
  return (
    <svg className="rc-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 15" height={size} width={size*0.8} fill="black">
      <rect x="2" y="3" width="1" height="1" />
      <rect x="4" y="3" width="1" height="1" />
      <rect x="6" y="3" width="1" height="1" />
      <rect x="3" y="5" width="2" height="1" />
      <rect x="6" y="5" width="2" height="1" />
    </svg>
  )
}

export default function RCSealPage (): React.ReactElement {

  return (
    <div className="flex items-center justify-center">
      <div className="paper w-60 h-60 flex items-center justify-center rounded-full relative overflow-hidden">

        <div className="rc_logo_primary absolute inset-0 bg-zinc-800">
          <div className="mask absolute inset-0 bg-amber-50"></div>
          <div className="paper mix-blend-color-burn absolute inset-0"></div>
        </div>
        <div className="rc_logo_accent absolute inset-0 bg-[cyan]">
          <div className="bg-emerald-500 absolute inset-0"></div>
          <div className="paper absolute inset-0 mix-blend-darken"></div>
        </div>
      </div>
    </div>
  )
}