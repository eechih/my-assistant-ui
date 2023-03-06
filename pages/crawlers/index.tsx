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

import Breadcrumbs from 'components/Breadcrumbs'
import Layout from 'components/Layout'
import RefreshIconButton from 'components/RefreshIconButton'
import CrawlerAPI from 'lib/crawlerApi'
import { Crawler } from 'lib/models'
import moment from 'moment'
import { formatTime } from 'pages/util'
import LightTooltip from './LightTooltip'
import StateLabel from './StateLabel'

const crawlerApi = new CrawlerAPI()

export default function Index() {
  const [crawlers, setCrawlers] = React.useState<Crawler[]>()
  const [loading, setLoading] = React.useState<boolean>()
  const [loadedTime, setLoadedTime] = React.useState<string>()

  React.useEffect(() => {
    console.log('useEffect')
    // Using an IIFE
    ;(async function listCrawlers() {
      const crawlers = await crawlerApi.listCrawlers({ limit: 10 })
      setCrawlers(crawlers)
      setLoadedTime(formatTime(moment()))
      setLoading(false)
    })()
  }, [])

  const handleCreateButtonClick = async () => {
    console.log('handleCreateButtonClick')
    const crawler = await crawlerApi.createCrawler({
      groupId: '1627303077535381',
      limit: 20,
    })
    if (crawler) {
      if (crawlers) setCrawlers([crawler, ...crawlers])
      else setCrawlers([crawler])
      setLoadedTime(formatTime(moment()))
    }
  }

  const handleRefreshButtonClick = async () => {
    console.log('handleRefreshButtonClick')
    setLoading(true)
    const crawlers = await crawlerApi.listCrawlers({ limit: 10 })
    if (crawlers) {
      setCrawlers(crawlers)
      setLoadedTime(formatTime(moment()))
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Box m={1}>
        <Breadcrumbs
          breadcrumbs={[{ label: '首頁', href: '/' }, { label: '爬蟲' }]}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ pt: 2, pb: 2 }}
        >
          <Stack>
            <Typography variant="h6" gutterBottom>
              爬蟲
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
              onClick={handleCreateButtonClick}
            >
              建立爬蟲
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {!crawlers && (
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
          {crawlers && (
            <TableContainer
              sx={{ maxHeight: 440, width: '100%', overflowX: 'auto' }}
            >
              <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 60 }}>
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell style={{ minWidth: 140 }}>爬蟲編號</TableCell>
                    <TableCell style={{ minWidth: 100 }}>
                      <LightTooltip
                        enterDelay={500}
                        leaveDelay={200}
                        title={
                          <Stack m={1}>
                            <StateLabel state="Pending" />
                            <StateLabel state="Processing" />
                            <StateLabel state="Completed" />
                            <StateLabel state="Failed" />
                          </Stack>
                        }
                      >
                        <Typography variant="subtitle2">狀態</Typography>
                      </LightTooltip>
                    </TableCell>
                    <TableCell style={{ minWidth: 190 }}>建立時間</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {crawlers.map((crawler) => {
                    const { crawlerId, state, creationTime } = crawler
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={crawlerId}
                      >
                        <TableCell>
                          <Checkbox color="primary" />
                        </TableCell>
                        <TableCell>
                          <Link href={`/crawlers/${crawlerId}`}>
                            <Typography
                              variant="body2"
                              sx={{ color: '#1976d2' }}
                            >
                              {crawlerId}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <StateLabel state={state} />
                        </TableCell>
                        <TableCell>{formatTime(creationTime)}</TableCell>
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
    </Layout>
  )
}
