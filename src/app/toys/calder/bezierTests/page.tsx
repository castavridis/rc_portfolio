import { CalderData } from './bezierTests'

export default function CalderPage (): React.ReactNode {
  return (
    <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0 overflow-auto">
      <div className="container mx-auto py-12">
        <h2 className="text-5xl">Calder</h2>
        <h1 className="text-9xl">Bezier Tests</h1>
        <CalderData />
      </div>
    </div>
  )
}