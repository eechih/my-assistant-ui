import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import * as React from 'react'
import * as R from 'ramda'

import Breadcrumbs from 'components/Breadcrumbs'
import Layout from 'components/Layout'
import RefreshIconButton from 'components/RefreshIconButton'
import ProductAPI from 'lib/productApi'
import { Product } from 'lib/models'
import moment from 'moment'
import { formatTime } from 'pages/util'

const productAPI = new ProductAPI()

export default function Index() {
  const [products, setProducts] = React.useState<Product[]>()
  const [loading, setLoading] = React.useState<boolean>()
  const [loadedTime, setLoadedTime] = React.useState<string>()
  const [checked, setChecked] = React.useState<string[]>([])

  React.useEffect(() => {
    console.log('useEffect')
    // Using an IIFE
    ;(async function listCrawlers() {
      const products = await productAPI.listProducts({ limit: 10 })
      setProducts(products)
      setLoadedTime(formatTime(moment()))
      setLoading(false)
    })()
  }, [])

  const handleRefreshButtonClick = async () => {
    console.log('handleRefreshButtonClick')
    setLoading(true)
    const products = await productAPI.listProducts({ limit: 10 })
    if (products) {
      setProducts(products)
      setLoadedTime(formatTime(moment()))
    }
    setLoading(false)
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name) {
      if (event.target.checked) {
        if (!R.find((v) => v === event.target.name, checked))
          setChecked([...checked, event.target.name].sort())
      } else {
        setChecked(R.reject((v) => v === event.target.name, checked))
      }
    }
  }

  return (
    <Layout>
      <Box m={1}>
        <Breadcrumbs
          breadcrumbs={[{ label: '首頁', href: '/' }, { label: '商品管理' }]}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ pt: 2, pb: 2 }}
        >
          <Stack>
            <Typography variant="h6" gutterBottom>
              商品管理
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <RefreshIconButton
              onClick={handleRefreshButtonClick}
              loading={loading}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                console.log('createProduct')
              }}
            >
              建立商品
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {!products && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              height={440}
            >
              <CircularProgress size={30} />
            </Stack>
          )}
          {products && (
            <TableContainer
              sx={{ maxHeight: 440, width: '100%', overflowX: 'auto' }}
            >
              <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 40 }}>
                      <Checkbox color="primary" disabled />
                    </TableCell>
                    <TableCell style={{ minWidth: 60 }}>編號</TableCell>
                    <TableCell style={{ minWidth: 400 }}>名稱</TableCell>
                    <TableCell style={{ minWidth: 80 }}>價格</TableCell>
                    <TableCell style={{ minWidth: 80 }}>廠商</TableCell>
                    <TableCell style={{ minWidth: 80 }}>成本</TableCell>
                    <TableCell style={{ minWidth: 180 }}>下架時間</TableCell>
                    <TableCell style={{ minWidth: 80 }}>發布FB</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((product) => {
                    const {
                      productId,
                      name,
                      price,
                      cost,
                      option,
                      location,
                      statusDate,
                      publishUrl,
                    } = product
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={productId}
                      >
                        <TableCell>
                          <Checkbox
                            name={productId}
                            color="primary"
                            onChange={handleCheckboxChange}
                            disabled={!!publishUrl}
                          />
                        </TableCell>
                        <TableCell>
                          <Link href={`/products/${productId}`}>
                            <Typography
                              variant="body2"
                              sx={{ color: '#1976d2' }}
                            >
                              {productId}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>{price}</TableCell>
                        <TableCell>{location}</TableCell>
                        <TableCell>{cost}</TableCell>
                        <TableCell>{formatTime(statusDate)}</TableCell>
                        <TableCell>
                          {publishUrl ? '已發布' : '未發布'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Stack direction="row" justifyContent="flex-end" my={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="#9e9e9e">
              資料取得時間
            </Typography>
            <Typography variant="caption" color="#9e9e9e">
              {loadedTime}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {checked.join(', ')}
    </Layout>
  )
}