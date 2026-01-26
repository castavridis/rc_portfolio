const Slide: ({
  children
}) => React.ReactNode = ({ children }): React.ReactNode => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center border-b-amber-500 border-b-2">
      { children }
    </div>
  )
}

export default function RainCheckPPT (): React.ReactNode {
  return (
    <div>
      <h1 className="text-2xl">
        Security Printing in the Browser
      </h1>
      <Slide>
        Technologies: Next.js, React, TypeScript, HTML, CSS 
        Packages: gsap, @gsap/react
      </Slide>
      <Slide>
        - Foil (Embossing, Debossing)
        - Windows
        - 
        - Security Tape
      </Slide>
      <Slide>
        Foil
      </Slide>
      <Slide>
        Windows
      </Slide>
      <Slide>
        Security Tape
      </Slide>
    </div>
  )
}
