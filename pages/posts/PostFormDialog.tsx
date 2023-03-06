import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Post } from 'lib/models'
import moment from 'moment'
import { isEmpty } from 'ramda'
import { Controller, useForm } from 'react-hook-form'

interface PostFormDialogProps {
  open: boolean
  formData: Post
  onClose: () => void
  onSubmit: (data: Post) => void
}

export default function PostFormDialog(props: PostFormDialogProps) {
  const { open, onClose, formData } = props
  const form = useForm<Post>({ defaultValues: formData })

  const onSubmit = (data: Post) => {
    console.log('onSubmit', data)
    props.onSubmit({
      ...data,
      productOption: isEmpty(data.productOption)
        ? undefined
        : data.productOption,
      productPrice: parseInt(`${data.productPrice}`),
      productCost: parseInt(`${data.productCost}`),
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>編輯貼文</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>{post.postMessage}</DialogContentText> */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="productName"
            control={form.control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                id={field.name}
                label="名稱"
                type="txt"
                fullWidth
                variant="standard"
                {...field}
              />
            )}
          />

          <Controller
            name="productPrice"
            control={form.control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                id={field.name}
                label="價格"
                type="number"
                fullWidth
                variant="standard"
                {...field}
              />
            )}
          />

          <Controller
            name="productCost"
            control={form.control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                id={field.name}
                label="成本"
                type="number"
                fullWidth
                variant="standard"
                {...field}
              />
            )}
          />

          <Controller
            name="productOption"
            control={form.control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <TextField
                autoFocus
                margin="dense"
                id={name}
                label="規格"
                type="text"
                fullWidth
                variant="standard"
                placeholder="範例：紅，黑 / L，M，S"
                value={formatProductOption(value)}
                name={name}
                onChange={(e) => onChange(parseProductOption(e.target.value))}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            name="productStatusDate"
            control={form.control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <TextField
                autoFocus
                margin="dense"
                id={name}
                label="收單日期"
                type="datetime-local"
                fullWidth
                variant="standard"
                value={formatProductStatusDate(value)}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            name="productDescription"
            control={form.control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                id={field.name}
                label="貼文內容"
                type="text"
                fullWidth
                variant="standard"
                multiline
                rows={12}
                {...field}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={form.handleSubmit(onSubmit)}>儲存</Button>
      </DialogActions>
    </Dialog>
  )
}

const formatProductOption = (input?: string[][]): string => {
  if (!input) return ''
  return input.map((option) => option.join('，')).join(' / ')
}

const parseProductOption = (input: string): string[][] | undefined => {
  return input
    .trim()
    .split('/')
    .filter((s) => !isEmpty(s.trim()))
    .map((s) => s.split(/[,，]/).filter((s) => !isEmpty(s.trim())))
}

const formatProductStatusDate = (input?: string): string => {
  if (!input) return ''
  return moment(input).utcOffset(8).format('yyyy-MM-DDTHH:mm')
}
