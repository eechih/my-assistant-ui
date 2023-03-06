import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Post } from 'lib/models'
import moment from 'moment'
import { isEmpty, trim } from 'ramda'
import React, { useState } from 'react'

// type FormData = Record<string, undefined | number | string>

type FormData = Pick<
  Post,
  | 'productName'
  | 'productPrice'
  | 'productCost'
  | 'productOption'
  | 'productStatusDate'
  | 'productDescription'
>

export default function FormDialog(props: {
  open: boolean
  post: Post
  onClose: () => void
  onSave: (post: Post) => void
}) {
  const { open, onClose, post, onSave } = props
  const [formData, setFormData] = useState<FormData>(post)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value })
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      productOption: convertStringToOption(event.target.value),
    })
  }

  const handleSaveButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    const postToSave = {
      ...post,
      productName: formData.productName,
      productPrice: parseInt(`${formData.productPrice}`),
      productCost: parseInt(`${formData.productCost}`),
      productOption: formData.productOption,
      productStatusDate: formData.productStatusDate,
      productDescription: formData.productDescription,
    }
    onSave(postToSave)
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>編輯貼文</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>{post.postMessage}</DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="productName"
            label="名稱"
            type="text"
            fullWidth
            variant="standard"
            value={formData.productName}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="productPrice"
            label="價格"
            type="number"
            fullWidth
            variant="standard"
            value={formData.productPrice}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="productCost"
            label="成本"
            type="number"
            fullWidth
            variant="standard"
            value={formData.productCost}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="productOption"
            label="規格"
            type="text"
            fullWidth
            placeholder="範例：紅，黑 / L，M，S"
            variant="standard"
            value={convertOptionToString(formData.productOption)}
            onChange={handleOptionChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="productStatusDate"
            label="收單日期"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={moment(formData.productStatusDate)
              .utcOffset(8)
              .format('yyyy-MM-DDTHH:mm')}
            onChange={handleChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="productDescription"
            label="貼文內容"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={15}
            value={formData.productDescription}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={handleSaveButtonClick}>儲存</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const convertOptionToString = (option?: string[][]): string => {
  if (!option) return ''
  return option.map((v) => v.join('，')).join(' / ')
}

const convertStringToOption = (str: string): string[][] | undefined => {
  if (isEmpty(str)) return undefined
  return str
    .trim()
    .split('/')
    .map(trim)
    .map((s) => s.split(/[,，]/).map(trim))
}
