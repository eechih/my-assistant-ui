import LoadingButton from '@mui/lab/LoadingButton'
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
import Breadcrumbs from 'components/Breadcrumbs'
import Layout from 'components/Layout'
import RefreshIconButton from 'components/RefreshIconButton'
import { Product } from 'lib/models'
import ProductAPI from 'lib/productApi'
import moment from 'moment'
import Link from 'next/link'
import { formatTime } from 'pages/util'
import * as R from 'ramda'
import * as React from 'react'

import { useLoadingReducer } from 'hooks'

const productAPI = new ProductAPI()

export default function Index() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [checked, setChecked] = React.useState<string[]>([])
  const [publising, setPublishing] = React.useState<boolean>(false)
  const [loadingState, setLoadingState] = useLoadingReducer()

  const listProducts = async () => {
    try {
      setLoadingState({ loading: true, error: null })
      const products = await productAPI.listProducts({ limit: 10 })
      setProducts(products)
      setLoadingState({ loading: false, loaded: true, loadedTime: moment() })
    } catch (err) {
      setLoadingState({ loading: false, error: err as Error })
    }
  }

  React.useEffect(() => {
    console.log('useEffect')
    // Using an IIFE
    listProducts()
  }, [])

  const handleRefreshButtonClick = async () => {
    console.log('handleRefreshButtonClick')
    listProducts()
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

  const publishProduct = async (productId: string) => {
    console.log('publishProduct', productId)
    setPublishing(true)

    try {
      await productAPI.publishProduct({
        productId,
        phpsessId: 'tbo311ajis0n5p9ni2re6l1t26',
      })

      const newProducts = products.map((product) => {
        return product.productId == productId
          ? { ...product, publishing: true }
          : product
      })

      setProducts(newProducts)
    } catch (err) {
      console.error(err)
    }
    setPublishing(false)
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
              loading={loadingState.loading}
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
                    <TableCell style={{ minWidth: 60 }}>商品ID</TableCell>
                    <TableCell style={{ minWidth: 400 }}>名稱</TableCell>
                    <TableCell style={{ minWidth: 80 }}>價格</TableCell>
                    <TableCell style={{ minWidth: 80 }}>廠商</TableCell>
                    <TableCell style={{ minWidth: 80 }}>成本</TableCell>
                    <TableCell style={{ minWidth: 170 }}>下架時間</TableCell>
                    <TableCell style={{ minWidth: 80 }}>動作</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((product) => {
                    const {
                      productId,
                      name,
                      price,
                      cost,
                      location,
                      statusDate,
                      publishing,
                      publishedPostId,
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
                        <TableCell>
                          {moment(statusDate).format('yyyy/MM/DD HH:mm')}
                        </TableCell>
                        <TableCell>
                          <LoadingButton
                            loading={publishing}
                            variant={!!publishedPostId ? 'text' : 'contained'}
                            disabled={!!publishedPostId}
                            onClick={() => {
                              publishProduct(productId)
                            }}
                          >
                            {publishedPostId ? '已發佈' : '發佈'}
                          </LoadingButton>
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
              {formatTime(loadingState.loadedTime)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {checked.join(', ')}
    </Layout>
  )
}
