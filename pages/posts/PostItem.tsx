import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Image from 'next/image'

import AddBoxIcon from '@mui/icons-material/AddBox'
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

import TextAccordion from 'components/TextAccordion'
import { Post } from 'lib/models'
import React from 'react'
import { convertToProduct } from './util'

export interface OnCreateProductButtonClickFunc {
  (post: Post): void
}

export interface OnPublishButtonClickFunc {
  (props: { productId: string; postId: string }): void
}

export interface OnEditButtonClickFunc {
  (props: { postId: string }): void
}

export interface OnOriginPostButtonClickFunc {
  (props: { postId: string }): void
}

export default function PostItem(props: {
  post: Post
  onCreateProductButtonClick: OnCreateProductButtonClickFunc
  onPublishButtonClick: OnPublishButtonClickFunc
  onEditButtonClick: OnEditButtonClickFunc
  onOriginPostButtonClick: OnOriginPostButtonClickFunc
}) {
  const {
    post,
    onCreateProductButtonClick,
    onPublishButtonClick,
    onEditButtonClick,
    onOriginPostButtonClick,
  } = props
  const product = convertToProduct({ post })
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={11}>
          <Stack direction="row" spacing={1}>
            <Chip label={post.groupName} />
            <Chip label={post.postCreationTime} variant="outlined" />
            <Chip label={`成本：${post.productCost}`} variant="outlined" />
          </Stack>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose()
                onOriginPostButtonClick({ postId: post.postId })
              }}
            >
              原始文章
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                onEditButtonClick({ postId: post.postId })
              }}
            >
              編輯
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                onCreateProductButtonClick(post)
              }}
            >
              上架 Buy+1
            </MenuItem>
            <MenuItem onClick={handleClose}>發布 FB</MenuItem>
          </Menu>
        </Grid>
      </Grid>
      {post.tags && post.tags.length > 0 && (
        <Box>
          <Stack spacing={1} direction="row" sx={{ pl: 0.5 }}>
            {post.tags?.map((tag, index) => (
              <Chip
                label={tag}
                key={index}
                color={
                  ['現貨', '售完關團'].includes(tag) ? 'warning' : 'default'
                }
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}
      <Box sx={{ p: 1 }}>
        <TextAccordion text={product.description ?? ''} />
      </Box>

      {post.productImages && (
        <Image
          src={post.productImages[0]}
          alt="Picture of the author"
          width={700}
          height={475}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      )}

      <Divider />
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ p: 0.5 }}
      >
        {post.productId ? (
          <Chip
            color="success"
            size="small"
            icon={<AddBoxIcon />}
            label="已上架"
          />
        ) : (
          <Button
            color="inherit"
            startIcon={<AddBoxIcon />}
            onClick={() => onCreateProductButtonClick(post)}
          >
            上架
          </Button>
        )}
        {post.productPublishUrl ? (
          <Chip
            color="success"
            size="small"
            icon={<AddToHomeScreenIcon />}
            label="已發布"
          />
        ) : (
          <Button
            color="inherit"
            startIcon={<AddToHomeScreenIcon />}
            disabled={!post.productId}
            onClick={() =>
              onPublishButtonClick({
                productId: post.productId ?? '',
                postId: post.postId,
              })
            }
          >
            發布
          </Button>
        )}
      </Stack>
    </>
  )
}
