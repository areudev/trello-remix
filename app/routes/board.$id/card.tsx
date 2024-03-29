import invariant from 'tiny-invariant'
import {useFetcher, useSubmit} from '@remix-run/react'
import {useState} from 'react'

import {Icon} from '~/icons/icons'

import {ItemMutation, INTENTS, CONTENT_TYPES} from './types'

interface CardProps {
  title: string
  content: string | null
  id: string
  columnId: string
  order: number
  nextOrder: number
  previousOrder: number
}

export function Card({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
}: CardProps) {
  const submit = useSubmit()
  const deleteFetcher = useFetcher()

  const [acceptDrop, setAcceptDrop] = useState<'none' | 'top' | 'bottom'>(
    'none'
  )

  return deleteFetcher.state !== 'idle' ? null : (
    <li
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
          event.preventDefault()
          event.stopPropagation()
          const rect = event.currentTarget.getBoundingClientRect()
          const midpoint = (rect.top + rect.bottom) / 2
          setAcceptDrop(event.clientY <= midpoint ? 'top' : 'bottom')
        }
      }}
      onDragLeave={() => {
        setAcceptDrop('none')
      }}
      onDrop={(event) => {
        event.stopPropagation()

        const transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card)
        )
        invariant(transfer.id, 'missing cardId')
        invariant(transfer.title, 'missing title')

        const droppedOrder = acceptDrop === 'top' ? previousOrder : nextOrder
        const moveOrder = (droppedOrder + order) / 2

        const mutation: ItemMutation = {
          order: moveOrder,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        }

        submit(
          {...mutation, intent: INTENTS.moveItem},
          {
            method: 'post',
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          }
        )

        setAcceptDrop('none')
      }}
      className={
        'border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 ' +
        (acceptDrop === 'top'
          ? 'border-t-destructive border-b-transparent'
          : acceptDrop === 'bottom'
          ? 'border-b-destructive border-t-transparent'
          : 'border-t-transparent border-b-transparent')
      }>
      <div
        draggable
        className="bg-background text-sm rounded-lg w-full py-1 px-2 relative"
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({id, title})
          )
        }}>
        <h3>{title}</h3>
        <div className="mt-2">{content || <>&nbsp;</>}</div>
        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value={INTENTS.deleteCard} />
          <input type="hidden" name="itemId" value={id} />
          <button
            className="absolute top-4 right-4 hover:text-destructive"
            type="submit"
            onClick={(event) => {
              event.stopPropagation()
            }}>
            <Icon name="trash" />
          </button>
        </deleteFetcher.Form>
      </div>
    </li>
  )
}
