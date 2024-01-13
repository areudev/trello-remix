import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import {createBoard, getHomeData} from './queries'
import {requireAuthCookie} from '~/auth/auth'
import {Form, Link, useLoaderData} from '@remix-run/react'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'
import {Button} from '~/components/ui/button'

export const meta: MetaFunction = () => {
  return [{title: 'Boards'}]
}

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const boards = await getHomeData(userId)
  return {boards}
}

export async function action({request}: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const formData = await request.formData()
  const name = String(formData.get('name'))
  const color = String(formData.get('color'))
  if (!name) {
    throw new Response('Bad Request', {status: 400})
  }
  const board = await createBoard(userId, name, color)
  console.log('board', board)

  return {ok: true}
}

export default function Home() {
  return (
    <div>
      <h2>Home Yo</h2>
      <NewBoard />
      <Boards />
    </div>
  )
}

function Boards() {
  const {boards} = useLoaderData<typeof loader>()
  return (
    <div className="p-8">
      <h2 className="font-bold mb-2 text-xl">Boards</h2>
      <nav className="flex flex-wrap gap-8">
        {boards.map((board) => (
          <Board
            key={board.id}
            name={board.name}
            id={board.id}
            color={board.color}
          />
        ))}
      </nav>
    </div>
  )
}
function Board({name, id, color}: {name: string; id: number; color: string}) {
  return (
    <Link
      to={`/board/${id}`}
      className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg relative bg-muted"
      style={{borderColor: color}}>
      <div className="font-bold">{name}</div>
    </Link>
  )
}

function NewBoard() {
  return (
    <Form method="post" className="p-8 max-w-md">
      {/* <input type="hidden" name="intent" value="createBoard" /> */}
      <div>
        <h2 className="font-bold mb-2 text-xl">New Board</h2>
        <div>
          <Label>Name</Label>
          <Input name="name" type="text" required />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Label htmlFor="board-color">Color</Label>
          <input
            id="board-color"
            name="color"
            type="color"
            defaultValue="#cbd5e1"
            className="bg-transparent"
          />
        </div>
        <Button type="submit">Create</Button>
      </div>
    </Form>
  )
}
