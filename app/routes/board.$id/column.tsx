import {useState, useRef} from 'react'
import {useSubmit} from '@remix-run/react'
import invariant from 'tiny-invariant'

import {Icon} from '~/icons/icons'

import {ItemMutation, INTENTS, CONTENT_TYPES, type RenderedItem} from './types'
import {NewCard} from './new-card'
import {flushSync} from 'react-dom'
import {Card} from './card'
import {EditableText} from './components'
import {Button} from '~/components/ui/button'

interface ColumnProps {
  name: string
  columnId: string
  items: RenderedItem[]
}

export function Column({name, columnId, items}: ColumnProps) {
  const submit = useSubmit()

  const [acceptDrop, setAcceptDrop] = useState(false)
  const [edit, setEdit] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  function scrollList() {
    invariant(listRef.current)
    listRef.current.scrollTop = listRef.current.scrollHeight
  }

  return (
    <div
      className={
        'flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 bg-muted rounded-xl shadow-sm  ' +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          items.length === 0 &&
          event.dataTransfer.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault()
          setAcceptDrop(true)
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false)
      }}
      onDrop={(event) => {
        const transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card)
        )
        invariant(transfer.id, 'missing transfer.id')
        invariant(transfer.title, 'missing transfer.title')

        const mutation: ItemMutation = {
          order: 1,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        }

        submit(
          {...mutation, intent: INTENTS.moveItem},
          {
            method: 'post',
            navigate: false,
            // use the same fetcher instance for any mutations on this card so
            // that interruptions cancel the earlier request and revalidation
            fetcherKey: `card:${transfer.id}`,
          }
        )

        setAcceptDrop(false)
      }}>
      <div className="p-2">
        <EditableText
          fieldName="name"
          value={name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${name}" name`}
          inputClassName="border  w-full rounded-lg py-1 px-2 font-medium "
          buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium">
          <input type="hidden" name="intent" value={INTENTS.updateColumn} />
          <input type="hidden" name="columnId" value={columnId} />
        </EditableText>
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <Card
              key={item.id}
              title={item.title}
              content={item.content}
              id={item.id}
              order={item.order}
              columnId={columnId}
              previousOrder={items[index - 1] ? items[index - 1].order : 0}
              nextOrder={
                items[index + 1] ? items[index + 1].order : item.order + 1
              }
            />
          ))}
      </ul>
      {edit ? (
        <NewCard
          columnId={columnId}
          nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2">
          <Button
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true)
              })
              scrollList()
            }}
            className="">
            <Icon name="plus" /> Add a card
          </Button>
        </div>
      )}
    </div>
  )
}
