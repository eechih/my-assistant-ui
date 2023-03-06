import { Crawler } from '@/lib/models'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Breadcrumbs from 'components/Breadcrumbs'
import Layout from 'components/Layout'
import RefreshIconButton from 'components/RefreshIconButton'
import CrawlerAPI from 'lib/crawlerApi'
import { formatTime } from 'pages/util'
import StateLabel from './StateLabel'

const crawlerApi = new CrawlerAPI()

export default function Index() {
  const router = useRouter()
  const crawlerId = router.query.crawlerId as string
  const [crawler, setCrawler] = useState<Crawler>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadedTime, setLoadedTime] = useState<string>()

  useEffect(() => {
    console.log('useEffect', { crawlerId })
    if (crawlerId) {
      // Using an IIFE
      ;(async function getCrawler() {
        const data = await crawlerApi.getCrawler({ crawlerId })
        setCrawler(data)
        setLoadedTime(formatTime(moment()))
      })()
    }
  }, [crawlerId])

  const handleRefreshButtonClick = async () => {
    console.log('handleRefreshButtonClick')
    setLoading(true)
    const crawler = await crawlerApi.getCrawler({ crawlerId })
    if (crawler) {
      setCrawler(crawler)
      setLoadedTime(formatTime(moment()))
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Breadcrumbs
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '爬蟲', href: '/crawlers' },
          { label: crawlerId },
        ]}
      />
      <Paper>
        <Box p={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">爬蟲 {crawlerId}</Typography>

            <RefreshIconButton
              onClick={handleRefreshButtonClick}
              loading={loading}
            />
          </Stack>
        </Box>

        {!crawler && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            height={100}
          >
            <CircularProgress size={30} />
          </Stack>
        )}

        {crawler && (
          <Box p={2}>
            <Stack
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack>
                <Typography variant="subtitle2">建立時間</Typography>
                <Typography variant="overline">
                  {formatTime(crawler.creationTime)}
                </Typography>
              </Stack>

              <Stack>
                <Typography variant="subtitle2">爬蟲狀態</Typography>
                <Box my={0.5}>
                  <StateLabel state={crawler.state} />
                </Box>
              </Stack>

              <Stack>
                <Typography variant="subtitle2">爬蟲參數</Typography>
                <Typography variant="overline">
                  {crawler.messageBody}
                </Typography>
              </Stack>

              {crawler.processingTime && (
                <Stack>
                  <Typography variant="subtitle2">啟動時間</Typography>
                  <Typography variant="overline">
                    {formatTime(crawler.processingTime)}
                  </Typography>
                </Stack>
              )}

              {crawler.completedTime && (
                <Stack>
                  <Typography variant="subtitle2">成功時間</Typography>
                  <Typography variant="overline">
                    {formatTime(crawler.completedTime)}
                  </Typography>
                </Stack>
              )}

              {crawler.failedTime && (
                <Stack>
                  <Typography variant="subtitle2">失敗時間</Typography>
                  <Typography variant="overline">
                    {formatTime(crawler.failedTime)}
                  </Typography>
                </Stack>
              )}

              {crawler.tracing && (
                <Stack>
                  <Typography variant="subtitle2">結果</Typography>
                  <Typography variant="overline">{crawler.tracing}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>
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
    </Layout>
  )
}
