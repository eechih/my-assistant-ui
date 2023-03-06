import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Layout from 'components/Layout'
import { compare } from 'fast-json-patch'
import { Post } from 'lib/models'
import PostAPI from 'lib/postApi'
import ProductAPI from 'lib/productApi'
import * as R from 'ramda'
import React, { useReducer, useState } from 'react'

import Breadcrumbs from 'components/Breadcrumbs'
import PostFormDialog from './PostFormDialog'
import PostItem, {
  OnCreateProductButtonClickFunc,
  OnEditButtonClickFunc,
  OnOriginPostButtonClickFunc,
  OnPublishButtonClickFunc,
} from './PostItem'
import TextDialog from './TextDialog'
import { convertToProduct } from './util'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

interface PostAction {
  type: string
  payload: Post
}

interface PostsState {
  posts: { [key in string]: Post }
}

const productApi = new ProductAPI()
const postApi = new PostAPI()

const reducer = (state: PostsState, action: PostAction) => {
  console.log('action', action)
  const { type, payload } = action
  switch (type) {
    case 'update':
      state.posts[payload.postId] = {
        ...state.posts[payload.postId],
        ...payload,
      }
      return state
    case 'updateAll':
      state.posts[payload.postId] = payload
      return state
    default:
      return state
  }
}

export default function Index(props: { posts: Post[] }) {
  const initialState = {
    posts: R.indexBy(R.prop('postId'), props.posts),
    fetching: false,
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const [progressing, setProgressing] = useState(false)

  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false)
  const [isTextDialogOpen, setTextDialogOpen] = React.useState(false)
  const [currentPost, setCurrentPost] = React.useState<Post | undefined>()

  const onCreateProductButtonClick: OnCreateProductButtonClickFunc = async (
    post: Post
  ): Promise<void> => {
    setProgressing(true)
    try {
      const { productId } = await productApi.createProduct({ product: {} })
      console.log('productId', productId)
      post.productId = productId
      if (post.productId) {
        const product = convertToProduct({ post })
        console.log('product', product)
        await productApi.updateProduct({ product })
        await postApi.patchPost({
          postId: post.postId,
          patches: [{ op: 'add', path: '/productId', value: post.productId }],
        })
        dispatch({
          type: 'update',
          payload: { ...post, productId: post.productId },
        })
        console.log('上架成功')
      }
    } catch (error) {
      console.log(error)
    }
    setProgressing(false)
  }

  const onEditButtonClick: OnEditButtonClickFunc = async (props: {
    postId: string
  }): Promise<void> => {
    console.log('onEditButtonClick', props)
    const { postId } = props
    if (state.posts[postId]) {
      setTextDialogOpen(false)
      setFormDialogOpen(true)
      setCurrentPost(state.posts[postId])
    }
  }

  const onOriginPostButtonClick: OnOriginPostButtonClickFunc = async (props: {
    postId: string
  }): Promise<void> => {
    console.log('onOriginPostButtonClick', props)
    const { postId } = props
    if (state.posts[postId]) {
      setFormDialogOpen(false)
      setTextDialogOpen(true)
      setCurrentPost(state.posts[postId])
    }
  }

  const onPublishButtonClick: OnPublishButtonClickFunc = async (props: {
    productId: string
    postId: string
  }): Promise<void> => {
    console.log('onPublishButtonClick', props)
    const { productId, postId } = props
    setProgressing(true)
    try {
      const product = await productApi.publishToFB({ productId })
      console.log('product', product)
      if (product.publishUrl) {
        console.log('product', product)
        await postApi.patchPost({
          postId: postId,
          patches: [
            {
              op: 'add',
              path: '/productPublishUrl',
              value: product.publishUrl,
            },
          ],
        })
        dispatch({
          type: 'update',
          payload: {
            ...state.posts[postId],
            productPublishUrl: product.publishUrl,
          },
        })
        console.log('發布成功')
      }
    } catch (error) {
      console.log(error)
    }
    setProgressing(false)
  }

  const savePost = async (post: Post) => {
    console.log('savePost', post)
    const { postId } = post
    const patches = compare(state.posts[postId], post)
    console.log('patches', patches)
    try {
      if (!R.isEmpty(patches)) {
        const updatedPost = await postApi.patchPost({ postId, patches })
        dispatch({
          type: 'updateAll',
          payload: updatedPost,
        })
        console.log('儲存成功')
      }
      setFormDialogOpen(false)
      setCurrentPost(undefined)
    } catch (error) {
      console.log('Error', error)
    }
  }

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Breadcrumbs
          breadcrumbs={[{ label: '首頁', href: '/' }, { label: '貼文' }]}
        />
        <Stack spacing={1}>
          {R.values(state.posts).map((post) => (
            <Item key={post.postId}>
              <PostItem
                post={post}
                onCreateProductButtonClick={onCreateProductButtonClick}
                onPublishButtonClick={onPublishButtonClick}
                onEditButtonClick={onEditButtonClick}
                onOriginPostButtonClick={onOriginPostButtonClick}
              />
            </Item>
          ))}
        </Stack>
        <Dialog
          onClose={() => {
            setProgressing(false)
          }}
          open={progressing}
        >
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      </Box>
      {currentPost && isFormDialogOpen ? (
        <PostFormDialog
          open={isFormDialogOpen}
          formData={currentPost}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={savePost}
        />
      ) : (
        <></>
      )}

      {currentPost && isTextDialogOpen ? (
        <TextDialog
          open={isTextDialogOpen}
          content={currentPost.postMessage}
          handleClose={() => setTextDialogOpen(false)}
        />
      ) : (
        <></>
      )}
    </Layout>
  )
}

export const getStaticProps = async () => {
  const postApi = new PostAPI()
  const posts = await postApi.listPosts({
    groupId: '1627303077535381',
    limit: 30,
  })
  // const posts = await postsApi.listPostsMock();
  return {
    props: { posts: posts },
  }
}
