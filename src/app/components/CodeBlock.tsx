type CodeBlockProps = {
  str: string
}
export default function CodeBlock ({
  str
}: CodeBlockProps): React.ReactNode {
  return (
    <code className="font-semibold">
      {str}
    </code>
  )
}
