import { CalderData } from './bezierTests'
import './styles.css'

export default function CalderPage (): React.ReactNode {
  return (
    <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0">
      <div className="container mx-auto py-12">
        <h1 className="text-9xl">Calder</h1>
        <CalderData />
      </div>
    </div>
  )
}