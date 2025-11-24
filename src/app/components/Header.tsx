type HeaderProps = {
  heading: string
  subHeading?: React.ReactNode
}
export default function Header ({
  heading,
  subHeading,
}: HeaderProps): React.ReactNode {
  return (
    <header>
      { subHeading
          && <h2 className="text-2xl font-normal mb-2">{subHeading}</h2>
      }
      <h1 className="text-5xl font-semibold">{heading}</h1>
    </header>
  )
}