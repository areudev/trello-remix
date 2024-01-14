import {useState, useRef} from 'react'
import {flushSync} from 'react-dom'
import invariant from 'tiny-invariant'
import {Icon} from '~/icons/icons'
import {Form, useSubmit} from '@remix-run/react'

import {INTENTS} from './types'
import {CancelButton, SaveButton} from './components'
import {Input} from '~/components/ui/input'

export function NewColumn({
  boardId,
  onAdd,
  editInitially,
}: {
  boardId: number
  onAdd: () => void
  editInitially: boolean
}) {
  const [editing, setEditing] = useState(editInitially)
  const inputRef = useRef<HTMLInputElement>(null)
  const submit = useSubmit()

  return editing ? (
    <Form
      method="post"
      navigate={false}
      className="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl shadow bg-background "
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.set('id', crypto.randomUUID())
        submit(formData, {
          navigate: false,
          method: 'post',
          unstable_flushSync: true,
        })
        onAdd()
        invariant(inputRef.current, 'missing input ref')
        inputRef.current.value = ''
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEditing(false)
        }
      }}>
      <input type="hidden" name="intent" value={INTENTS.createColumn} />
      <input type="hidden" name="boardId" value={boardId} />
      <Input
        autoFocus
        required
        ref={inputRef}
        type="text"
        name="name"
        className="border w-full rounded-lg py-1 px-2 font-medium "
      />
      <div className="flex justify-between">
        <SaveButton>Save Column</SaveButton>
        <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
      </div>
    </Form>
  ) : (
    <button
      onClick={() => {
        flushSync(() => {
          setEditing(true)
        })
        onAdd()
      }}
      aria-label="Add new column"
      className="flex-shrink-0 flex justify-center h-16 w-16 bg-black hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-xl">
      <Icon name="plus" size="xl" />
    </button>
  )
}
