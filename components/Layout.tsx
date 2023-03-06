import Container from '@mui/material/Container'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Container maxWidth="sm" sx={{ padding: 0 }}>
        {children}
      </Container>
    </>
  )
}

export default Layout
