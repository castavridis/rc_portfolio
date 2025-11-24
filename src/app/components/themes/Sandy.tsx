import { AnnotationsProvider } from '../useAnnotations'

type SandyThemeProps = {
  children: React.ReactNode
}
export default function SandyTheme ({
  children
}: SandyThemeProps): React.ReactNode {
  return (
    <AnnotationsProvider>
      <div className="font-outfit-100 bg-calder-beige text-calder-black">
        <div className="container mx-auto py-12">
          {children}
        </div>
      </div>
    </AnnotationsProvider>
  )
}