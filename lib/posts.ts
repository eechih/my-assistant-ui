import fs from 'fs'
import { join } from 'path'

const getSortedPostsData = async () => {
  const path = join(process.cwd(), 'lib', 'posts.json')
  const contents = fs.readFileSync(path, 'utf8')
  return JSON.parse(contents)
}

export { getSortedPostsData }
